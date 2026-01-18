const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create price channels
  const channels = await Promise.all([
    prisma.priceChannel.upsert({
      where: { code: 'ONLINE' },
      update: {},
      create: {
        code: 'ONLINE',
        name: 'Online',
        description: 'Online store',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'OFFLINE' },
      update: {},
      create: {
        code: 'OFFLINE',
        name: 'Offline',
        description: 'Physical store',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'APP' },
      update: {},
      create: {
        code: 'APP',
        name: 'Mobile App',
        description: 'Mobile application',
      },
    }),
    prisma.priceChannel.upsert({
      where: { code: 'MARKETPLACE' },
      update: {},
      create: {
        code: 'MARKETPLACE',
        name: 'Marketplace',
        description: 'Third-party marketplace',
      },
    }),
  ]);

  // Create price regions
  const regions = await Promise.all([
    prisma.priceRegion.upsert({
      where: { code: 'NORTH' },
      update: {},
      create: {
        code: 'NORTH',
        name: 'Miền Bắc',
        description: 'Northern region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'CENTRAL' },
      update: {},
      create: {
        code: 'CENTRAL',
        name: 'Miền Trung',
        description: 'Central region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'SOUTH' },
      update: {},
      create: {
        code: 'SOUTH',
        name: 'Miền Nam',
        description: 'Southern region',
      },
    }),
    prisma.priceRegion.upsert({
      where: { code: 'INTERNATIONAL' },
      update: {},
      create: {
        code: 'INTERNATIONAL',
        name: 'Quốc tế',
        description: 'International',
      },
    }),
  ]);

  // Create customer groups
  const customerGroups = await Promise.all([
    prisma.customerGroup.upsert({
      where: { code: 'RETAIL' },
      update: {},
      create: {
        code: 'RETAIL',
        name: 'Lẻ',
        description: 'Retail customers',
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'WHOLESALE' },
      update: {},
      create: {
        code: 'WHOLESALE',
        name: 'Sỉ',
        description: 'Wholesale customers',
        discount: 10,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'VIP' },
      update: {},
      create: {
        code: 'VIP',
        name: 'VIP',
        description: 'VIP customers',
        discount: 15,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_1' },
      update: {},
      create: {
        code: 'AGENT_1',
        name: 'Đại lý cấp 1',
        description: 'Level 1 Agent',
        discount: 20,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_2' },
      update: {},
      create: {
        code: 'AGENT_2',
        name: 'Đại lý cấp 2',
        description: 'Level 2 Agent',
        discount: 25,
      },
    }),
    prisma.customerGroup.upsert({
      where: { code: 'AGENT_3' },
      update: {},
      create: {
        code: 'AGENT_3',
        name: 'Đại lý cấp 3',
        description: 'Level 3 Agent',
        discount: 30,
      },
    }),
  ]);

  // Create sample categories
  const rootCategory = await prisma.category.upsert({
    where: { slug: 'root' },
    update: {},
    create: {
      name: 'Root Category',
      slug: 'root',
      level: 0,
    },
  });

  console.log('Seed completed!');
  console.log(`Created ${channels.length} price channels`);
  console.log(`Created ${regions.length} price regions`);
  console.log(`Created ${customerGroups.length} customer groups`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
