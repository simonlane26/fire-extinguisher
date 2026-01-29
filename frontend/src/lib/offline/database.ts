// frontend/src/lib/offline/database.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';
import { Capacitor } from '@capacitor/core';

export interface OfflineInspection {
  id: string;
  extinguisherId: string;
  siteId: string;
  siteName: string;
  inspectorId: string;
  inspectorName: string;
  status: 'pass' | 'fail' | 'defect';
  notes?: string;
  defects?: string;
  actionTaken?: string;
  createdAt: string;
  synced: boolean; // false until uploaded to server
  syncAttempts: number;
  lastSyncAttempt?: string;
  serverInspectionId?: string; // ID from server after successful sync
}

export interface OfflineExtinguisher {
  id: string;
  siteId: string;
  siteName: string;
  number: string;
  type: string;
  size: string;
  location: string;
  building?: string;
  floor?: string;
  zone?: string;
  manufacturer?: string;
  serialNumber?: string;
  manufactureDate?: string;
  installDate?: string;
  lastServiceDate?: string;
  nextServiceDue?: string;
  qrCode?: string;
  status: string;
  condition?: string;
  lastSyncedAt: string;
}

export interface OfflinePhoto {
  id: string;
  inspectionId: string;
  localPath: string; // Path in Capacitor Filesystem
  base64Data?: string; // For small photos
  fileName: string;
  mimeType: string;
  createdAt: string;
  synced: boolean;
  serverPhotoId?: string;
}

export interface SyncQueueItem {
  id: string;
  type: 'inspection' | 'extinguisher' | 'photo';
  action: 'create' | 'update' | 'delete';
  itemId: string;
  data: string; // JSON stringified data
  createdAt: string;
  attempts: number;
  lastAttempt?: string;
  error?: string;
}

export interface PendingExtinguisher {
  id: string;
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
  status: string;
  condition: string;
  notes?: string;
  createdAt: string;
  synced: boolean;
  syncAttempts: number;
  lastSyncAttempt?: string;
  serverExtinguisherId?: string;
}

export interface OfflineInventoryItem {
  id: string;
  partNumber: string;
  partName: string;
  category?: string;
  description?: string;
  quantity: number;
  minStockLevel: number;
  unitPrice: number;
  supplier?: string;
  lastSyncedAt: string;
}

class OfflineDatabase {
  private sqlite: SQLiteConnection;
  private db: SQLiteDBConnection | null = null;
  private dbName = 'firexcheck.db';
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  constructor() {
    this.sqlite = new SQLiteConnection(CapacitorSQLite);
  }

  isInitialized(): boolean {
    return this.initialized && this.db !== null;
  }

  // Ensures database is initialized before any operation
  async ensureInitialized(): Promise<boolean> {
    if (this.initialized && this.db) return true;

    if (this.initPromise) {
      await this.initPromise;
      return this.initialized;
    }

    try {
      this.initPromise = this.initialize();
      await this.initPromise;
      return true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      return false;
    }
  }

  async initialize(): Promise<void> {
    try {
      // Check if the platform supports SQLite
      const platform = Capacitor.getPlatform();
      if (platform === 'web') {
        console.warn('Web platform detected - using in-memory SQLite');
      }

      // Create or open database
      const ret = await this.sqlite.checkConnectionsConsistency();
      const isConn = (await this.sqlite.isConnection(this.dbName, false)).result;

      if (ret.result && isConn) {
        this.db = await this.sqlite.retrieveConnection(this.dbName, false);
      } else {
        this.db = await this.sqlite.createConnection(
          this.dbName,
          false,
          'no-encryption',
          1,
          false
        );
      }

      await this.db.open();
      await this.createTables();
      this.initialized = true;

      console.log('Offline database initialized');
    } catch (error) {
      console.error('Failed to initialize offline database:', error);
      this.initialized = false;
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const queries = `
      -- Offline Inspections Table
      CREATE TABLE IF NOT EXISTS offline_inspections (
        id TEXT PRIMARY KEY,
        extinguisherId TEXT NOT NULL,
        siteId TEXT NOT NULL,
        siteName TEXT NOT NULL,
        inspectorId TEXT NOT NULL,
        inspectorName TEXT NOT NULL,
        status TEXT NOT NULL,
        notes TEXT,
        defects TEXT,
        actionTaken TEXT,
        createdAt TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        syncAttempts INTEGER DEFAULT 0,
        lastSyncAttempt TEXT,
        serverInspectionId TEXT
      );

      -- Offline Extinguishers Table (cached from server)
      CREATE TABLE IF NOT EXISTS offline_extinguishers (
        id TEXT PRIMARY KEY,
        siteId TEXT NOT NULL,
        siteName TEXT NOT NULL,
        number TEXT NOT NULL,
        type TEXT NOT NULL,
        size TEXT NOT NULL,
        location TEXT NOT NULL,
        building TEXT,
        floor TEXT,
        zone TEXT,
        manufacturer TEXT,
        serialNumber TEXT,
        manufactureDate TEXT,
        installDate TEXT,
        lastServiceDate TEXT,
        nextServiceDue TEXT,
        qrCode TEXT,
        status TEXT NOT NULL,
        condition TEXT,
        lastSyncedAt TEXT NOT NULL
      );

      -- Offline Photos Table
      CREATE TABLE IF NOT EXISTS offline_photos (
        id TEXT PRIMARY KEY,
        inspectionId TEXT NOT NULL,
        localPath TEXT NOT NULL,
        base64Data TEXT,
        fileName TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        serverPhotoId TEXT,
        FOREIGN KEY (inspectionId) REFERENCES offline_inspections(id)
      );

      -- Sync Queue Table
      CREATE TABLE IF NOT EXISTS sync_queue (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        action TEXT NOT NULL,
        itemId TEXT NOT NULL,
        data TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        attempts INTEGER DEFAULT 0,
        lastAttempt TEXT,
        error TEXT
      );

      -- Pending Extinguishers Table (created offline, waiting to sync)
      CREATE TABLE IF NOT EXISTS pending_extinguishers (
        id TEXT PRIMARY KEY,
        siteId TEXT,
        location TEXT NOT NULL,
        building TEXT,
        floor TEXT,
        type TEXT NOT NULL,
        capacity TEXT,
        manufacturer TEXT,
        serialNumber TEXT,
        installDate TEXT,
        expiryDate TEXT,
        status TEXT DEFAULT 'Active',
        condition TEXT DEFAULT 'Good',
        notes TEXT,
        createdAt TEXT NOT NULL,
        synced INTEGER DEFAULT 0,
        syncAttempts INTEGER DEFAULT 0,
        lastSyncAttempt TEXT,
        serverExtinguisherId TEXT
      );

      -- Offline Inventory Table (cached from server)
      CREATE TABLE IF NOT EXISTS offline_inventory (
        id TEXT PRIMARY KEY,
        partNumber TEXT NOT NULL,
        partName TEXT NOT NULL,
        category TEXT,
        description TEXT,
        quantity INTEGER DEFAULT 0,
        minStockLevel INTEGER DEFAULT 0,
        unitPrice REAL DEFAULT 0,
        supplier TEXT,
        lastSyncedAt TEXT NOT NULL
      );

      -- Indexes for performance
      CREATE INDEX IF NOT EXISTS idx_inspections_synced ON offline_inspections(synced);
      CREATE INDEX IF NOT EXISTS idx_inspections_extinguisher ON offline_inspections(extinguisherId);
      CREATE INDEX IF NOT EXISTS idx_photos_inspection ON offline_photos(inspectionId);
      CREATE INDEX IF NOT EXISTS idx_photos_synced ON offline_photos(synced);
      CREATE INDEX IF NOT EXISTS idx_sync_queue_type ON sync_queue(type);
      CREATE INDEX IF NOT EXISTS idx_pending_ext_synced ON pending_extinguishers(synced);
      CREATE INDEX IF NOT EXISTS idx_inventory_category ON offline_inventory(category);
    `;

    await this.db.execute(queries);
  }

  // ==================== INSPECTIONS ====================

  async saveInspection(inspection: Omit<OfflineInspection, 'synced' | 'syncAttempts'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO offline_inspections
      (id, extinguisherId, siteId, siteName, inspectorId, inspectorName, status, notes, defects, actionTaken, createdAt, synced, syncAttempts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    `;

    await this.db.run(query, [
      inspection.id,
      inspection.extinguisherId,
      inspection.siteId,
      inspection.siteName,
      inspection.inspectorId,
      inspection.inspectorName,
      inspection.status,
      inspection.notes || null,
      inspection.defects || null,
      inspection.actionTaken || null,
      inspection.createdAt,
    ]);
  }

  async getUnsyncedInspections(): Promise<OfflineInspection[]> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getUnsyncedInspections');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM offline_inspections WHERE synced = 0 ORDER BY createdAt ASC'
    );

    return result.values || [];
  }

  async markInspectionSynced(localId: string, serverInspectionId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE offline_inspections SET synced = 1, serverInspectionId = ? WHERE id = ?',
      [serverInspectionId, localId]
    );
  }

  async getInspectionsByExtinguisher(extinguisherId: string): Promise<OfflineInspection[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM offline_inspections WHERE extinguisherId = ? ORDER BY createdAt DESC',
      [extinguisherId]
    );

    return result.values || [];
  }

  // ==================== EXTINGUISHERS ====================

  async cacheExtinguishers(extinguishers: any[]): Promise<void> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for cacheExtinguishers');
        return;
      }
    }

    // Clear existing cache
    await this.db.run('DELETE FROM offline_extinguishers');

    // Insert new data
    const query = `
      INSERT INTO offline_extinguishers
      (id, siteId, siteName, number, type, size, location, building, floor, zone,
       manufacturer, serialNumber, manufactureDate, installDate, lastServiceDate,
       nextServiceDue, qrCode, status, condition, lastSyncedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();

    for (const ext of extinguishers) {
      await this.db.run(query, [
        ext.id,
        ext.siteId || '',
        ext.site?.name || '',
        ext.serialNumber || ext.id,
        ext.type,
        ext.capacity || '',
        ext.location,
        ext.building || null,
        ext.floor || null,
        ext.zone || null,
        ext.manufacturer || null,
        ext.serialNumber || null,
        ext.manufactureDate || null,
        ext.installDate || null,
        ext.lastMaintenance || null,
        ext.nextMaintenance || null,
        ext.qrCode || null,
        ext.status,
        ext.condition || null,
        now,
      ]);
    }
  }

  async getExtinguisherById(id: string): Promise<OfflineExtinguisher | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM offline_extinguishers WHERE id = ? LIMIT 1',
      [id]
    );

    return result.values?.[0] || null;
  }

  async getExtinguisherByQRCode(qrCode: string): Promise<OfflineExtinguisher | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM offline_extinguishers WHERE qrCode = ? LIMIT 1',
      [qrCode]
    );

    return result.values?.[0] || null;
  }

  async searchExtinguishers(query: string): Promise<OfflineExtinguisher[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      `SELECT * FROM offline_extinguishers
       WHERE number LIKE ? OR location LIKE ? OR building LIKE ?
       ORDER BY number ASC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    return result.values || [];
  }

  async getCachedExtinguishers(): Promise<OfflineExtinguisher[]> {
    if (!this.db) {
      // Try to initialize if not already
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getCachedExtinguishers');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM offline_extinguishers ORDER BY location ASC'
    );

    return result.values || [];
  }

  // ==================== PENDING EXTINGUISHERS (Created Offline) ====================

  async savePendingExtinguisher(extinguisher: Omit<PendingExtinguisher, 'synced' | 'syncAttempts'>): Promise<void> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        throw new Error('Database not available - cannot save extinguisher offline');
      }
    }

    const query = `
      INSERT INTO pending_extinguishers
      (id, siteId, location, building, floor, type, capacity, manufacturer, serialNumber,
       installDate, expiryDate, status, condition, notes, createdAt, synced, syncAttempts)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    `;

    await this.db.run(query, [
      extinguisher.id,
      extinguisher.siteId || null,
      extinguisher.location,
      extinguisher.building || null,
      extinguisher.floor || null,
      extinguisher.type,
      extinguisher.capacity || null,
      extinguisher.manufacturer || null,
      extinguisher.serialNumber || null,
      extinguisher.installDate || null,
      extinguisher.expiryDate || null,
      extinguisher.status || 'Active',
      extinguisher.condition || 'Good',
      extinguisher.notes || null,
      extinguisher.createdAt,
    ]);
  }

  async getUnsyncedExtinguishers(): Promise<PendingExtinguisher[]> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getUnsyncedExtinguishers');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM pending_extinguishers WHERE synced = 0 ORDER BY createdAt ASC'
    );

    return result.values || [];
  }

  async markExtinguisherSynced(localId: string, serverExtinguisherId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE pending_extinguishers SET synced = 1, serverExtinguisherId = ? WHERE id = ?',
      [serverExtinguisherId, localId]
    );
  }

  async updateExtinguisherSyncAttempt(id: string, error?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE pending_extinguishers SET syncAttempts = syncAttempts + 1, lastSyncAttempt = ? WHERE id = ?',
      [new Date().toISOString(), id]
    );
  }

  async getPendingExtinguisherById(id: string): Promise<PendingExtinguisher | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM pending_extinguishers WHERE id = ? LIMIT 1',
      [id]
    );

    return result.values?.[0] || null;
  }

  async getAllPendingExtinguishers(): Promise<PendingExtinguisher[]> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getAllPendingExtinguishers');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM pending_extinguishers ORDER BY createdAt DESC'
    );

    return result.values || [];
  }

  // ==================== INVENTORY ====================

  async cacheInventory(items: any[]): Promise<void> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for cacheInventory');
        return;
      }
    }

    // Clear existing cache
    await this.db.run('DELETE FROM offline_inventory');

    const query = `
      INSERT INTO offline_inventory
      (id, partNumber, partName, category, description, quantity, minStockLevel, unitPrice, supplier, lastSyncedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const now = new Date().toISOString();

    for (const item of items) {
      await this.db.run(query, [
        item.id,
        item.partNumber,
        item.partName,
        item.category || null,
        item.description || null,
        item.quantity || 0,
        item.minStockLevel || 0,
        item.unitPrice || 0,
        item.supplier || null,
        now,
      ]);
    }
  }

  async getCachedInventory(): Promise<OfflineInventoryItem[]> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getCachedInventory');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM offline_inventory ORDER BY partName ASC'
    );

    return result.values || [];
  }

  async getCachedInventoryByCategory(category: string): Promise<OfflineInventoryItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM offline_inventory WHERE category = ? ORDER BY partName ASC',
      [category]
    );

    return result.values || [];
  }

  async searchCachedInventory(query: string): Promise<OfflineInventoryItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      `SELECT * FROM offline_inventory
       WHERE partNumber LIKE ? OR partName LIKE ? OR description LIKE ?
       ORDER BY partName ASC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );

    return result.values || [];
  }

  // ==================== PHOTOS ====================

  async savePhoto(photo: Omit<OfflinePhoto, 'synced'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO offline_photos
      (id, inspectionId, localPath, base64Data, fileName, mimeType, createdAt, synced)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `;

    await this.db.run(query, [
      photo.id,
      photo.inspectionId,
      photo.localPath,
      photo.base64Data || null,
      photo.fileName,
      photo.mimeType,
      photo.createdAt,
    ]);
  }

  async getUnsyncedPhotos(): Promise<OfflinePhoto[]> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        console.warn('Database not available for getUnsyncedPhotos');
        return [];
      }
    }

    const result = await this.db.query(
      'SELECT * FROM offline_photos WHERE synced = 0 ORDER BY createdAt ASC'
    );

    return result.values || [];
  }

  async markPhotoSynced(localId: string, serverPhotoId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE offline_photos SET synced = 1, serverPhotoId = ? WHERE id = ?',
      [serverPhotoId, localId]
    );
  }

  // ==================== SYNC QUEUE ====================

  async addToSyncQueue(item: Omit<SyncQueueItem, 'attempts' | 'createdAt'>): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      INSERT INTO sync_queue (id, type, action, itemId, data, createdAt, attempts)
      VALUES (?, ?, ?, ?, ?, ?, 0)
    `;

    await this.db.run(query, [
      item.id,
      item.type,
      item.action,
      item.itemId,
      item.data,
      new Date().toISOString(),
    ]);
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.query(
      'SELECT * FROM sync_queue ORDER BY createdAt ASC'
    );

    return result.values || [];
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run('DELETE FROM sync_queue WHERE id = ?', [id]);
  }

  async updateSyncQueueAttempt(id: string, error?: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.run(
      'UPDATE sync_queue SET attempts = attempts + 1, lastAttempt = ?, error = ? WHERE id = ?',
      [new Date().toISOString(), error || null, id]
    );
  }

  // ==================== UTILITY ====================

  async clearAllData(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.execute(`
      DELETE FROM offline_inspections;
      DELETE FROM offline_extinguishers;
      DELETE FROM offline_photos;
      DELETE FROM sync_queue;
    `);
  }

  async getStats(): Promise<{
    totalInspections: number;
    unsyncedInspections: number;
    totalExtinguishers: number;
    unsyncedExtinguishers: number;
    unsyncedPhotos: number;
    cachedInventory: number;
    queuedItems: number;
  }> {
    if (!this.db) {
      const ready = await this.ensureInitialized();
      if (!ready || !this.db) {
        return {
          totalInspections: 0,
          unsyncedInspections: 0,
          totalExtinguishers: 0,
          unsyncedExtinguishers: 0,
          unsyncedPhotos: 0,
          cachedInventory: 0,
          queuedItems: 0,
        };
      }
    }

    const [inspections, unsyncedInsp, extinguishers, pendingExt, photos, inventory, queue] = await Promise.all([
      this.db.query('SELECT COUNT(*) as count FROM offline_inspections'),
      this.db.query('SELECT COUNT(*) as count FROM offline_inspections WHERE synced = 0'),
      this.db.query('SELECT COUNT(*) as count FROM offline_extinguishers'),
      this.db.query('SELECT COUNT(*) as count FROM pending_extinguishers WHERE synced = 0'),
      this.db.query('SELECT COUNT(*) as count FROM offline_photos WHERE synced = 0'),
      this.db.query('SELECT COUNT(*) as count FROM offline_inventory'),
      this.db.query('SELECT COUNT(*) as count FROM sync_queue'),
    ]);

    return {
      totalInspections: inspections.values?.[0]?.count || 0,
      unsyncedInspections: unsyncedInsp.values?.[0]?.count || 0,
      totalExtinguishers: extinguishers.values?.[0]?.count || 0,
      unsyncedExtinguishers: pendingExt.values?.[0]?.count || 0,
      unsyncedPhotos: photos.values?.[0]?.count || 0,
      cachedInventory: inventory.values?.[0]?.count || 0,
      queuedItems: queue.values?.[0]?.count || 0,
    };
  }

  async close(): Promise<void> {
    if (this.db) {
      await this.sqlite.closeConnection(this.dbName, false);
      this.db = null;
    }
  }
}

// Singleton instance
export const offlineDB = new OfflineDatabase();
