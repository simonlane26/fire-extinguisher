// frontend/src/lib/offline/syncManager.ts
import { Network } from '@capacitor/network';
import { offlineDB, OfflineInspection, OfflinePhoto, PendingExtinguisher } from './database';
import { API_BASE, getAuthHeaders, createInspection, fetchExtinguishers, addExtinguisher, fetchInventoryItems } from '../api';

export type SyncStatus = 'idle' | 'syncing' | 'error';

export interface SyncProgress {
  status: SyncStatus;
  current: number;
  total: number;
  message: string;
  error?: string;
}

class SyncManager {
  private isOnline: boolean = true;
  private isSyncing: boolean = false;
  private listeners: ((progress: SyncProgress) => void)[] = [];
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.initializeNetworkListener();
  }

  private async initializeNetworkListener(): Promise<void> {
    // Check initial status
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    // Listen for network changes
    Network.addListener('networkStatusChange', (status) => {
      const wasOffline = !this.isOnline;
      this.isOnline = status.connected;

      console.log(`Network status changed: ${status.connected ? 'ONLINE' : 'OFFLINE'}`);

      // If just came back online, trigger sync
      if (wasOffline && this.isOnline) {
        console.log('Connection restored - starting sync...');
        this.syncAll();
      }
    });
  }

  public getOnlineStatus(): boolean {
    return this.isOnline;
  }

  public onSyncProgress(callback: (progress: SyncProgress) => void): () => void {
    this.listeners.push(callback);
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback);
    };
  }

  private notifyListeners(progress: SyncProgress): void {
    this.listeners.forEach(listener => listener(progress));
  }

  public async syncAll(): Promise<void> {
    if (this.isSyncing) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    if (!this.isOnline) {
      console.log('Cannot sync - device is offline');
      this.notifyListeners({
        status: 'error',
        current: 0,
        total: 0,
        message: 'Cannot sync - no internet connection',
        error: 'offline',
      });
      return;
    }

    this.isSyncing = true;

    try {
      console.log('Starting full sync...');

      // Get unsynced items
      const [extinguishers, inspections, photos] = await Promise.all([
        offlineDB.getUnsyncedExtinguishers(),
        offlineDB.getUnsyncedInspections(),
        offlineDB.getUnsyncedPhotos(),
      ]);

      const total = extinguishers.length + inspections.length + photos.length;

      if (total === 0) {
        console.log('Nothing to sync');
        this.notifyListeners({
          status: 'idle',
          current: 0,
          total: 0,
          message: 'All data synced',
        });
        this.isSyncing = false;
        return;
      }

      console.log(`Found ${extinguishers.length} extinguishers, ${inspections.length} inspections and ${photos.length} photos to sync`);

      let current = 0;

      // Sync extinguishers first (inspections may depend on them)
      for (const extinguisher of extinguishers) {
        current++;
        this.notifyListeners({
          status: 'syncing',
          current,
          total,
          message: `Syncing extinguisher ${current} of ${total}...`,
        });

        try {
          await this.syncExtinguisher(extinguisher);
        } catch (error) {
          console.error('Failed to sync extinguisher:', error);
          // Continue with next item
        }
      }

      // Sync inspections
      for (const inspection of inspections) {
        current++;
        this.notifyListeners({
          status: 'syncing',
          current,
          total,
          message: `Syncing inspection ${current} of ${total}...`,
        });

        try {
          await this.syncInspection(inspection);
        } catch (error) {
          console.error('Failed to sync inspection:', error);
          // Continue with next item
        }
      }

      // Sync photos
      for (const photo of photos) {
        current++;
        this.notifyListeners({
          status: 'syncing',
          current,
          total,
          message: `Syncing photo ${current} of ${total}...`,
        });

        try {
          await this.syncPhoto(photo);
        } catch (error) {
          console.error('Failed to sync photo:', error);
          // Continue with next item
        }
      }

      console.log('Sync completed successfully');
      this.notifyListeners({
        status: 'idle',
        current: total,
        total,
        message: 'Sync completed',
      });

    } catch (error: any) {
      console.error('Sync failed:', error);
      this.notifyListeners({
        status: 'error',
        current: 0,
        total: 0,
        message: 'Sync failed',
        error: error.message,
      });
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncExtinguisher(extinguisher: PendingExtinguisher): Promise<void> {
    try {
      // Create extinguisher via API
      const serverExtinguisher = await addExtinguisher({
        siteId: extinguisher.siteId,
        location: extinguisher.location,
        building: extinguisher.building,
        floor: extinguisher.floor,
        type: extinguisher.type,
        capacity: extinguisher.capacity,
        manufacturer: extinguisher.manufacturer,
        serialNumber: extinguisher.serialNumber,
        installDate: extinguisher.installDate,
        expiryDate: extinguisher.expiryDate,
        status: extinguisher.status,
        condition: extinguisher.condition,
        notes: extinguisher.notes,
      });

      // Mark as synced
      await offlineDB.markExtinguisherSynced(extinguisher.id, serverExtinguisher.id);

      // Also add to cached extinguishers for offline browsing
      await offlineDB.cacheExtinguishers([serverExtinguisher]);

      console.log(`Synced extinguisher ${extinguisher.id} -> ${serverExtinguisher.id}`);
    } catch (error: any) {
      console.error(`Failed to sync extinguisher ${extinguisher.id}:`, error);
      await offlineDB.updateExtinguisherSyncAttempt(extinguisher.id, error.message);
      throw error;
    }
  }

  private async syncInspection(inspection: OfflineInspection): Promise<void> {
    try {
      // Get the extinguisher from offline cache
      const extinguisher = await offlineDB.getExtinguisherById(inspection.extinguisherId);

      if (!extinguisher) {
        throw new Error(`Extinguisher ${inspection.extinguisherId} not found in cache`);
      }

      // Create inspection via API
      const serverInspection = await createInspection({
        extinguisherId: inspection.extinguisherId,
        status: inspection.status,
        notes: inspection.notes,
        defects: inspection.defects,
        actionTaken: inspection.actionTaken,
        date: inspection.createdAt,
      });

      // Mark as synced
      await offlineDB.markInspectionSynced(inspection.id, serverInspection.id);

      console.log(`Synced inspection ${inspection.id} -> ${serverInspection.id}`);
    } catch (error: any) {
      console.error(`Failed to sync inspection ${inspection.id}:`, error);
      throw error;
    }
  }

  private async syncPhoto(photo: OfflinePhoto): Promise<void> {
    try {
      // Find the inspection
      const inspections = await offlineDB.getUnsyncedInspections();
      const inspection = inspections.find(i => i.id === photo.inspectionId);

      if (!inspection?.serverInspectionId) {
        throw new Error('Inspection must be synced before photos');
      }

      // Upload photo via API
      let photoData: Blob | string;

      if (photo.base64Data) {
        // Convert base64 to blob
        const response = await fetch(`data:${photo.mimeType};base64,${photo.base64Data}`);
        photoData = await response.blob();
      } else {
        // Read from filesystem
        const { Filesystem, Directory } = await import('@capacitor/filesystem');
        const file = await Filesystem.readFile({
          path: photo.localPath,
          directory: Directory.Data,
        });
        const response = await fetch(`data:${photo.mimeType};base64,${file.data}`);
        photoData = await response.blob();
      }

      // Upload to server
      const formData = new FormData();
      formData.append('file', photoData, photo.fileName);
      formData.append('inspectionId', inspection.serverInspectionId);

      const response = await fetch(`${API_BASE}/photos/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Photo upload failed');
      }

      const serverPhoto = await response.json();

      // Mark as synced
      await offlineDB.markPhotoSynced(photo.id, serverPhoto.id);

      console.log(`Synced photo ${photo.id} -> ${serverPhoto.id}`);
    } catch (error: any) {
      console.error(`Failed to sync photo ${photo.id}:`, error);
      throw error;
    }
  }

  public startAutoSync(intervalMinutes: number = 5): void {
    this.stopAutoSync();

    console.log(`Auto-sync enabled (every ${intervalMinutes} minutes)`);

    this.syncInterval = setInterval(() => {
      if (this.isOnline && !this.isSyncing) {
        console.log('Auto-sync triggered');
        this.syncAll();
      }
    }, intervalMinutes * 60 * 1000);
  }

  public stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
      console.log('Auto-sync disabled');
    }
  }

  public async downloadExtinguishersForOffline(siteIds?: string[]): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot download - device is offline');
    }

    try {
      console.log('Downloading extinguishers for offline use...');

      // Fetch all extinguishers
      const extinguishers = await fetchExtinguishers();

      // Filter by site if specified
      let filtered = extinguishers;
      if (siteIds && siteIds.length > 0) {
        filtered = extinguishers.filter((e: any) => siteIds.includes(e.siteId));
      }

      // Cache them locally
      await offlineDB.cacheExtinguishers(filtered);

      console.log(`Downloaded ${filtered.length} extinguishers for offline use`);
    } catch (error) {
      console.error('Failed to download extinguishers:', error);
      throw error;
    }
  }

  public async downloadInventoryForOffline(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot download - device is offline');
    }

    try {
      console.log('Downloading inventory for offline use...');

      // Fetch all inventory items
      const inventory = await fetchInventoryItems();

      // Cache them locally
      await offlineDB.cacheInventory(inventory);

      console.log(`Downloaded ${inventory.length} inventory items for offline use`);
    } catch (error) {
      console.error('Failed to download inventory:', error);
      throw error;
    }
  }

  public async downloadAllForOffline(): Promise<void> {
    if (!this.isOnline) {
      throw new Error('Cannot download - device is offline');
    }

    console.log('Downloading all data for offline use...');

    // Download both extinguishers and inventory
    await Promise.all([
      this.downloadExtinguishersForOffline(),
      this.downloadInventoryForOffline(),
    ]);

    console.log('All data downloaded for offline use');
  }

  public async getOfflineStats(): Promise<{
    isOnline: boolean;
    isSyncing: boolean;
    pendingExtinguishers: number;
    pendingInspections: number;
    pendingPhotos: number;
    cachedExtinguishers: number;
    cachedInventory: number;
  }> {
    const stats = await offlineDB.getStats();

    return {
      isOnline: this.isOnline,
      isSyncing: this.isSyncing,
      pendingExtinguishers: stats.unsyncedExtinguishers,
      pendingInspections: stats.unsyncedInspections,
      pendingPhotos: stats.unsyncedPhotos,
      cachedExtinguishers: stats.totalExtinguishers,
      cachedInventory: stats.cachedInventory,
    };
  }
}

// Singleton instance
export const syncManager = new SyncManager();
