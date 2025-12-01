// Quick script to change user role for testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    console.log('✅ Role updated successfully!');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`New Role: ${user.role}`);
    console.log('\n💡 Refresh your browser to see the changes!');
  } catch (error) {
    console.error('❌ Error updating role:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

changeRole();
