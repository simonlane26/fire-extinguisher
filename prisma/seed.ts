import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { subdomain: 'demo' },
    update: {},
    create: {
      companyName: 'Demo Fire Services',
      subdomain: 'demo',
      subscriptionPlan: 'trial',
      subscriptionStatus: 'trial',
    },
  });

  await prisma.extinguisher.create({
    data: {
      tenantId: tenant.id,
      location: 'Reception',
      building: 'HQ',
      type: 'CO2',
      status: 'Active',
      condition: 'Good',
    },
  });

  console.log('Seeded tenant:', tenant.id);
}

main().catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
