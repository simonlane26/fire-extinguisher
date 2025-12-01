// Quick script to change user role in PRODUCTION database
const { PrismaClient } = require('@prisma/client');

// Use the production database URL from .env.production
const databaseUrl = "postgresql://neondb_owner:npg_SQ0PaCqIzhM9@ep-flat-pond-aba4029j.eu-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function changeRole() {
  const email = 'simonlane22@gmail.com';
  const newRole = process.argv[2] || 'super_admin';

  const validRoles = ['super_admin', 'admin', 'manager', 'inspector', 'viewer'];

  if (!validRoles.includes(newRole)) {
    console.error(`❌ Invalid role: ${newRole}`);
    console.log(`Valid roles: ${validRoles.join(', ')}`);
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: newRole },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    console.log('✅ Role updated successfully in PRODUCTION database!');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`New Role: ${user.role}`);
    console.log('\n💡 Log out and log back in to see the changes!');
  } catch (error) {
    console.error('❌ Error updating role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

changeRole();
