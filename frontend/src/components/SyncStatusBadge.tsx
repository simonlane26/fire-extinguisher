// frontend/src/components/SyncStatusBadge.tsx
import React, { useState, useEffect } from 'react';
import { syncManager, SyncProgress } from '../lib/offline/syncManager';
import { Cloud, CloudOff, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';

export function SyncStatusBadge() {
  const [status, setStatus] = useState<SyncProgress>({
    status: 'idle',
    current: 0,
    total: 0,
    message: 'All synced',
  });
  const [isOnline, setIsOnline] = useState(syncManager.getOnlineStatus());
  const [stats, setStats] = useState({
    pendingExtinguishers: 0,
    pendingInspections: 0,
    pendingPhotos: 0,
    cachedExtinguishers: 0,
    cachedInventory: 0
  });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // Subscribe to sync progress
    const unsubscribe = syncManager.onSyncProgress(setStatus);

    // Update status periodically
    const updateStats = async () => {
      try {
        setIsOnline(syncManager.getOnlineStatus());
        const currentStats = await syncManager.getOfflineStats();
        setStats({
          pendingExtinguishers: currentStats.pendingExtinguishers,
          pendingInspections: currentStats.pendingInspections,
          pendingPhotos: currentStats.pendingPhotos,
          cachedExtinguishers: currentStats.cachedExtinguishers,
          cachedInventory: currentStats.cachedInventory,
        });
      } catch (error) {
        console.error('SyncStatusBadge: Error fetching stats:', error);
        // Keep showing badge with default values
      }
    };

    updateStats();
    const interval = setInterval(updateStats, 3000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  const handleManualSync = async () => {
    if (isOnline) {
      await syncManager.syncAll();
    }
  };

  const handleDownloadData = async () => {
    if (isOnline) {
      try {
        await syncManager.downloadExtinguishersForOffline();
        alert('Extinguisher data downloaded for offline use');
      } catch (error: any) {
        alert(`Failed to download data: ${error.message}`);
      }
    }
  };

  const hasPendingData = stats.pendingExtinguishers > 0 || stats.pendingInspections > 0 || stats.pendingPhotos > 0;
  const totalPending = stats.pendingExtinguishers + stats.pendingInspections + stats.pendingPhotos;

  return (
    <div className="fixed bottom-20 right-4 z-50" style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      {/* Compact Badge */}
      <div
        className={`bg-white shadow-xl rounded-lg border-2 border-gray-200 transition-all cursor-pointer ${
          expanded ? 'p-4 min-w-[280px]' : 'p-3'
        }`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          {/* Status Icon */}
          <div className="relative">
            {isOnline ? (
              <Cloud className="w-5 h-5 text-green-600" />
            ) : (
              <CloudOff className="w-5 h-5 text-gray-400" />
            )}

            {hasPendingData && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-pulse" />
            )}
          </div>

          {/* Status Text */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline Mode'}
              </span>

              {status.status === 'syncing' && (
                <RefreshCw className="w-3 h-3 text-blue-600 animate-spin" />
              )}
            </div>

            {!expanded && hasPendingData && (
              <div className="text-xs text-orange-600">
                {totalPending} pending
              </div>
            )}
          </div>

          {/* Expand/Collapse Icon */}
          <div className={`transition-transform ${expanded ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Expanded Details */}
        {expanded && (
          <div className="mt-4 space-y-3 border-t pt-3" onClick={(e) => e.stopPropagation()}>
            {/* Sync Progress */}
            {status.status === 'syncing' && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{status.message}</span>
                  <span className="text-blue-600 font-medium">
                    {status.current}/{status.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${(status.current / status.total) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error State */}
            {status.status === 'error' && (
              <div className="flex items-start gap-2 p-2 bg-red-50 rounded text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span className="text-red-700">{status.error || 'Sync failed'}</span>
              </div>
            )}

            {/* Success State */}
            {status.status === 'idle' && !hasPendingData && isOnline && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <CheckCircle className="w-4 h-4" />
                <span>All data synced</span>
              </div>
            )}

            {/* Stats */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Extinguishers:</span>
                <span className={`font-medium ${stats.pendingExtinguishers > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                  {stats.pendingExtinguishers}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Inspections:</span>
                <span className={`font-medium ${stats.pendingInspections > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                  {stats.pendingInspections}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Photos:</span>
                <span className={`font-medium ${stats.pendingPhotos > 0 ? 'text-orange-600' : 'text-gray-900'}`}>
                  {stats.pendingPhotos}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cached Extinguishers:</span>
                <span className="font-medium text-gray-900">{stats.cachedExtinguishers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cached Inventory:</span>
                <span className="font-medium text-gray-900">{stats.cachedInventory}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              {isOnline && hasPendingData && status.status !== 'syncing' && (
                <button
                  onClick={handleManualSync}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <RefreshCw className="w-4 h-4" />
                  Sync Now
                </button>
              )}

              {isOnline && (
                <button
                  onClick={handleDownloadData}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  title="Download extinguisher data for offline use"
                >
                  <Cloud className="w-4 h-4" />
                  Download
                </button>
              )}
            </div>

            {/* Offline Notice */}
            {!isOnline && (
              <div className="p-2 bg-gray-50 rounded text-xs text-gray-600 text-center">
                Working offline. Changes will sync when online.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Alternative minimal version that stays at top of screen
export function SyncStatusBar() {
  const [isOnline, setIsOnline] = useState(syncManager.getOnlineStatus());
  const [stats, setStats] = useState({ pendingExtinguishers: 0, pendingInspections: 0, pendingPhotos: 0 });

  useEffect(() => {
    const updateStats = async () => {
      setIsOnline(syncManager.getOnlineStatus());
      const currentStats = await syncManager.getOfflineStats();
      setStats({
        pendingExtinguishers: currentStats.pendingExtinguishers,
        pendingInspections: currentStats.pendingInspections,
        pendingPhotos: currentStats.pendingPhotos,
      });
    };

    updateStats();
    const interval = setInterval(updateStats, 5000);

    return () => clearInterval(interval);
  }, []);

  const hasPendingData = stats.pendingExtinguishers > 0 || stats.pendingInspections > 0 || stats.pendingPhotos > 0;

  if (isOnline && !hasPendingData) {
    return null; // Hide when online with no pending data
  }

  return (
    <div
      className={`w-full py-2 px-4 text-sm text-center ${
        !isOnline
          ? 'bg-gray-100 text-gray-700'
          : 'bg-orange-50 text-orange-700'
      }`}
    >
      {!isOnline ? (
        <div className="flex items-center justify-center gap-2">
          <CloudOff className="w-4 h-4" />
          <span>Working Offline - Changes will sync when online</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <RefreshCw className="w-4 h-4" />
          <span>
            {stats.pendingExtinguishers + stats.pendingInspections + stats.pendingPhotos} items pending sync
          </span>
          <button
            onClick={() => syncManager.syncAll()}
            className="ml-2 px-2 py-1 bg-orange-600 text-white rounded text-xs hover:bg-orange-700"
          >
            Sync Now
          </button>
        </div>
      )}
    </div>
  );
}
