// Script to check production database and verify column exists
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndFix() {
  try {
    console.log('Checking production database PushSubscription table...\n');

    // Check current columns
    const columns = await prisma.$queryRawUnsafe(`
      SELECT column_name, data_type
      FROM information_schema.columns
      WHERE table_name = 'PushSubscription'
      ORDER BY ordinal_position;
    `);

    console.log('Current columns:');
    columns.forEach(col => console.log(`  - ${col.column_name} (${col.data_type})`));

    const hasDeviceName = columns.some(col => col.column_name === 'deviceName');

    if (!hasDeviceName) {
      console.log('\n❌ deviceName column missing! Adding it now...');

      await prisma.$executeRawUnsafe(`
        ALTER TABLE "PushSubscription"
        ADD COLUMN "deviceName" TEXT;
      `);

      console.log('✅ Column added!');
    } else {
      console.log('\n✅ deviceName column exists');
    }

    // Now check if there are any existing subscriptions
    const count = await prisma.pushSubscription.count();
    console.log(`\nCurrent push subscriptions in database: ${count}`);

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFix();
