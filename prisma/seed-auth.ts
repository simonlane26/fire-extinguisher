// prisma/seed-auth.ts - Seed script for creating test tenant and users
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding authentication data...');

  // Create a test tenant
  const tenant = await prisma.tenant.upsert({
    where: { id: 'tenant-demo' },
    update: {},
    create: {
      id: 'tenant-demo',
      companyName: 'Demo Company',
      subdomain: 'demo',
      logoUrl: null,
      subscriptionPlan: 'trial',
      subscriptionStatus: 'active',
    },
  });

  console.log('✅ Created tenant:', tenant.companyName);

  // Create test users with different roles
  const password = 'password123'; // Test password
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const users = [
    {
      id: 'user-admin',
      email: 'admin@demo.com',
      name: 'Admin User',
      role: 'admin',
      passwordHash,
      tenantId: tenant.id,
      status: 'active',
    },
    {
      id: 'user-manager',
      email: 'manager@demo.com',
      name: 'Manager User',
      role: 'manager',
      passwordHash,
      tenantId: tenant.id,
      status: 'active',
    },
    {
      id: 'user-inspector',
      email: 'inspector@demo.com',
      name: 'Inspector User',
      role: 'inspector',
      passwordHash,
      tenantId: tenant.id,
      status: 'active',
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: userData,
    });
    console.log(`✅ Created user: ${user.name} (${user.email}) - Role: ${user.role}`);
  }

  console.log('\n📝 Test Credentials:');
  console.log('Email: admin@demo.com');
  console.log('Email: manager@demo.com');
  console.log('Email: inspector@demo.com');
  console.log('Password (all): password123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
