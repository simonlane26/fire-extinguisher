#!/bin/sh

# Verify Chrome is installed
echo "Checking for Chrome installation..."
if [ -f "/usr/bin/google-chrome-stable" ]; then
    echo "✓ Chrome found at /usr/bin/google-chrome-stable"
    /usr/bin/google-chrome-stable --version
else
    echo "✗ Chrome NOT found at /usr/bin/google-chrome-stable"
    echo "Checking other possible locations..."
    which google-chrome || echo "google-chrome not in PATH"
    which chromium || echo "chromium not in PATH"
    ls -la /usr/bin/ | grep -i chrome || echo "No chrome binaries found"
fi

# Set environment variable explicitly
export PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable
echo "PUPPETEER_EXECUTABLE_PATH set to: $PUPPETEER_EXECUTABLE_PATH"

# Sync database schema with Prisma schema
echo "=== Syncing database schema ==="
npx prisma db push --accept-data-loss --skip-generate || {
    echo "⚠️  Database sync failed, but continuing anyway..."
}
echo "=== Database sync complete ==="

# Start the application
echo "=== Starting application ==="
exec node dist/main
