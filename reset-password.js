// Reset user password directly in the database
require('dotenv').config({ path: '.env.production' });
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

// DATABASE_URL must be set in the environment (e.g. via .env.production or
// `DATABASE_URL="..." node reset-password.js ...`) — never hardcode it here.
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('❌ DATABASE_URL is not set. Set it in .env.production or pass it inline.');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl
    }
  }
});

async function resetPassword() {
  const email = process.argv[2];
  const newPassword = process.argv[3];

  if (!email || !newPassword) {
    console.error('\n❌ Usage: node reset-password.js <email> <new-password>\n');
    console.log('Example: node reset-password.js user@example.com MyNewPassword123\n');
    process.exit(1);
  }

  if (newPassword.length < 6) {
    console.error('❌ Password must be at least 6 characters long');
    process.exit(1);
  }

  try {
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      console.error(`❌ User not found: ${email}`);
      process.exit(1);
    }

    // Hash the new password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { email },
      data: { passwordHash }
    });

    console.log('\n✅ Password reset successfully!');
    console.log(`User: ${user.name} (${user.email})`);
    console.log('\n💡 You can now log in with the new password!\n');
  } catch (error) {
    console.error('❌ Error resetting password:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

resetPassword();
