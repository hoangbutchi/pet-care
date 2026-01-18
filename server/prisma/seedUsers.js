const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding users...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@petcare.com' },
    update: {},
    create: {
      email: 'admin@petcare.com',
      name: 'Admin User',
      password: hashedPassword,
      simpleRole: 'ADMIN'
    }
  });

  // Create regular user
  const userPassword = await bcrypt.hash('user123', 10);
  
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@petcare.com' },
    update: {},
    create: {
      email: 'user@petcare.com',
      name: 'Regular User',
      password: userPassword,
      simpleRole: 'USER'
    }
  });

  console.log('Users seeded successfully!');
  console.log('Admin:', adminUser);
  console.log('User:', regularUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });