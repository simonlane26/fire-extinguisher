// frontend/src/lib/offline/offlineApi.ts
import { createInspection, fetchExtinguisherById, fetchExtinguishers, addExtinguisher, fetchInventoryItems, API_BASE, getAuthHeaders } from '../api';
import { offlineDB, OfflineInspection, PendingExtinguisher } from './database';
import { syncManager } from './syncManager';
import { v4 as uuidv4 } from 'uuid';

/**
 * Offline-aware wrapper for API calls
 * Automatically saves to local database when offline
 */

export async function createInspectionOffline(data: {
  extinguisherId: string;
  status: 'pass' | 'fail' | 'defect';
  notes?: string;
  defects?: string;
  actionTaken?: string;
  inspectorId: string;
  inspectorName: string;
  siteId: string;
  siteName: string;
}): Promise<{ id: string; synced: boolean }> {
  const isOnline = syncManager.getOnlineStatus();

  const inspectionId = uuidv4();
  const timestamp = new Date().toISOString();

  if (isOnline) {
    try {
      // Try to save to server
      const serverInspection = await createInspection({
        extinguisherId: data.extinguisherId,
        status: data.status,
        notes: data.notes,
        defects: data.defects,
        actionTaken: data.actionTaken,
        date: timestamp,
      });

      // Also save to local DB for offline access
      await offlineDB.saveInspection({
        id: inspectionId,
        extinguisherId: data.extinguisherId,
        siteId: data.siteId,
        siteName: data.siteName,
        inspectorId: data.inspectorId,
        inspectorName: data.inspectorName,
        status: data.status,
        notes: data.notes,
        defects: data.defects,
        actionTaken: data.actionTaken,
        createdAt: timestamp,
        serverInspectionId: serverInspection.id,
      });

      await offlineDB.markInspectionSynced(inspectionId, serverInspection.id);

      console.log('Inspection saved to server and cached locally');

      return {
        id: serverInspection.id,
        synced: true,
      };
    } catch (error) {
      console.warn('Server save failed, falling back to offline mode:', error);
      // Fall through to offline save
    }
  }

  // Save offline
  await offlineDB.saveInspection({
    id: inspectionId,
    extinguisherId: data.extinguisherId,
    siteId: data.siteId,
    siteName: data.siteName,
    inspectorId: data.inspectorId,
    inspectorName: data.inspectorName,
    status: data.status,
    notes: data.notes,
    defects: data.defects,
    actionTaken: data.actionTaken,
    createdAt: timestamp,
  });

  console.log('Inspection saved offline - will sync when online');

  return {
    id: inspectionId,
    synced: false,
  };
}

export async function getExtinguisherOffline(id: string): Promise<any> {
  const isOnline = syncManager.getOnlineStatus();

  if (isOnline) {
    try {
      // Try to fetch from server
      const extinguisher = await fetchExtinguisherById(id);

      // Update cache
      await offlineDB.cacheExtinguishers([extinguisher]);

      return extinguisher;
    } catch (error) {
      console.warn('Server fetch failed, using cached data:', error);
    }
  }

  // Fallback to offline cache
  const cached = await offlineDB.getExtinguisherById(id);

  if (!cached) {
    throw new Error('Extinguisher not found in offline cache. Please sync when online.');
  }

  return cached;
}

export async function searchExtinguishersOffline(query: string): Promise<any[]> {
  const isOnline = syncManager.getOnlineStatus();

  if (isOnline) {
    try {
      // Try to fetch from server
      const extinguishers = await fetchExtinguishers();

      // Update cache
      await offlineDB.cacheExtinguishers(extinguishers);

      // Filter results
      const lowerQuery = query.toLowerCase();
      return extinguishers.filter((e: any) =>
        e.serialNumber?.toLowerCase().includes(lowerQuery) ||
        e.location?.toLowerCase().includes(lowerQuery) ||
        e.building?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.warn('Server search failed, using cached data:', error);
    }
  }

  // Fallback to offline search
  return await offlineDB.searchExtinguishers(query);
}

export async function addExtinguisherOffline(data: {
  siteId?: string;
  location: string;
  building?: string;
  floor?: string;
  type: string;
  capacity?: string;
  manufacturer?: string;
  serialNumber?: string;
  installDate?: string;
  expiryDate?: string;
  status?: string;
  condition?: string;
  notes?: string;
}): Promise<{ id: string; synced: boolean }> {
  const isOnline = syncManager.getOnlineStatus();
  const extinguisherId = uuidv4();
  const timestamp = new Date().toISOString();

  if (isOnline) {
    try {
      // Try to save to server
      const serverExtinguisher = await addExtinguisher({
        siteId: data.siteId,
        location: data.location,
        building: data.building,
        floor: data.floor,
        type: data.type,
        capacity: data.capacity,
        manufacturer: data.manufacturer,
        serialNumber: data.serialNumber,
        installDate: data.installDate,
        expiryDate: data.expiryDate,
        status: data.status || 'Active',
        condition: data.condition || 'Good',
        notes: data.notes,
      });

      // Also cache for offline use
      await offlineDB.cacheExtinguishers([serverExtinguisher]);

      console.log('Extinguisher saved to server and cached locally');

      return {
        id: serverExtinguisher.id,
        synced: true,
      };
    } catch (error) {
      console.warn('Server save failed, falling back to offline mode:', error);
      // Fall through to offline save
    }
  }

  // Save offline (pending sync)
  await offlineDB.savePendingExtinguisher({
    id: extinguisherId,
    siteId: data.siteId,
    location: data.location,
    building: data.building,
    floor: data.floor,
    type: data.type,
    capacity: data.capacity,
    manufacturer: data.manufacturer,
    serialNumber: data.serialNumber,
    installDate: data.installDate,
    expiryDate: data.expiryDate,
    status: data.status || 'Active',
    condition: data.condition || 'Good',
    notes: data.notes,
    createdAt: timestamp,
  });

  console.log('Extinguisher saved offline - will sync when online');

  return {
    id: extinguisherId,
    synced: false,
  };
}

export async function getExtinguisherByQRCodeOffline(qrCode: string): Promise<any> {
  const isOnline = syncManager.getOnlineStatus();

  if (isOnline) {
    try {
      // Fetch from server
      const extinguishers = await fetchExtinguishers();
      const match = extinguishers.find((e: any) => e.qrCode === qrCode);

      if (match) {
        // Update cache
        await offlineDB.cacheExtinguishers([match]);
        return match;
      }
    } catch (error) {
      console.warn('Server fetch failed, using cached data:', error);
    }
  }

  // Fallback to offline cache
  const cached = await offlineDB.getExtinguisherByQRCode(qrCode);

  if (!cached) {
    throw new Error('QR code not found in offline cache. Please sync when online.');
  }

  return cached;
}

export async function savePhotoOffline(data: {
  inspectionId: string;
  photoData: string; // base64
  fileName: string;
  mimeType: string;
}): Promise<{ id: string; synced: boolean }> {
  const photoId = uuidv4();
  const timestamp = new Date().toISOString();

  // Always save locally first
  await offlineDB.savePhoto({
    id: photoId,
    inspectionId: data.inspectionId,
    localPath: `photos/${photoId}`, // Virtual path
    base64Data: data.photoData,
    fileName: data.fileName,
    mimeType: data.mimeType,
    createdAt: timestamp,
  });

  const isOnline = syncManager.getOnlineStatus();

  if (isOnline) {
    try {
      // Try to upload immediately
      const blob = await (await fetch(`data:${data.mimeType};base64,${data.photoData}`)).blob();

      const formData = new FormData();
      formData.append('file', blob, data.fileName);
      formData.append('inspectionId', data.inspectionId);

      const response = await fetch(`${API_BASE}/photos/upload`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: formData,
      });

      if (response.ok) {
        const serverPhoto = await response.json();
        await offlineDB.markPhotoSynced(photoId, serverPhoto.id);

        console.log('Photo uploaded to server');

        return {
          id: serverPhoto.id,
          synced: true,
        };
      }
    } catch (error) {
      console.warn('Photo upload failed, will retry during sync:', error);
    }
  }

  console.log('Photo saved offline - will sync when online');

  return {
    id: photoId,
    synced: false,
  };
}

/**
 * Force sync all pending data
 */
export async function forceSyncAll(): Promise<void> {
  await syncManager.syncAll();
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<{
  isOnline: boolean;
  pendingExtinguishers: number;
  pendingInspections: number;
  pendingPhotos: number;
  cachedExtinguishers: number;
  cachedInventory: number;
}> {
  const stats = await syncManager.getOfflineStats();

  return {
    isOnline: stats.isOnline,
    pendingExtinguishers: stats.pendingExtinguishers,
    pendingInspections: stats.pendingInspections,
    pendingPhotos: stats.pendingPhotos,
    cachedExtinguishers: stats.cachedExtinguishers,
    cachedInventory: stats.cachedInventory,
  };
}

/**
 * Get cached inventory items
 */
export async function getInventoryOffline(): Promise<any[]> {
  const isOnline = syncManager.getOnlineStatus();

  if (isOnline) {
    try {
      // Fetch from server and cache
      const inventory = await fetchInventoryItems();
      await offlineDB.cacheInventory(inventory);
      return inventory;
    } catch (error) {
      console.warn('Server fetch failed, using cached inventory:', error);
    }
  }

  // Fallback to cached inventory
  return await offlineDB.getCachedInventory();
}

/**
 * Download all data for offline use
 */
export async function downloadAllForOffline(): Promise<void> {
  await syncManager.downloadAllForOffline();
}
