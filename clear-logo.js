// Quick script to clear the old logo URL from database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearLogo() {
  const email = 'simonlane22@gmail.com';

  try {
    // Get user's tenant
    const user = await prisma.user.findUnique({
      where: { email },
      select: { tenantId: true }
    });

    if (!user) {
      console.error('❌ User not found');
      process.exit(1);
    }

    // Clear the logo URL
    const tenant = await prisma.tenant.update({
      where: { id: user.tenantId },
      data: { logoUrl: null },
      select: {
        id: true,
        companyName: true,
        logoUrl: true,
      }
    });

    console.log('✅ Logo URL cleared successfully!');
    console.log(`Tenant: ${tenant.companyName}`);
    console.log(`Logo URL: ${tenant.logoUrl || '(none)'}`);
    console.log('\n💡 Now you can upload a new logo to S3!');
  } catch (error) {
    console.error('❌ Error clearing logo:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

clearLogo();
