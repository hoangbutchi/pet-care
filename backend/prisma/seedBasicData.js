const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding basic data...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'dog-food' },
      update: {},
      create: {
        name: 'Dog Food',
        slug: 'dog-food',
        description: 'Food for dogs',
        level: 1,
        sortOrder: 1,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cat-food' },
      update: {},
      create: {
        name: 'Cat Food',
        slug: 'cat-food',
        description: 'Food for cats',
        level: 1,
        sortOrder: 2,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'dog-toys' },
      update: {},
      create: {
        name: 'Dog Toys',
        slug: 'dog-toys',
        description: 'Toys for dogs',
        level: 1,
        sortOrder: 3,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'cat-toys' },
      update: {},
      create: {
        name: 'Cat Toys',
        slug: 'cat-toys',
        description: 'Toys for cats',
        level: 1,
        sortOrder: 4,
        isActive: true,
      },
    }),
    prisma.category.upsert({
      where: { slug: 'accessories' },
      update: {},
      create: {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Pet accessories',
        level: 1,
        sortOrder: 5,
        isActive: true,
      },
    }),
  ]);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { name: 'Royal Canin' },
      update: {},
      create: {
        name: 'Royal Canin',
        slug: 'royal-canin',
        description: 'Premium pet food brand',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'Pedigree' },
      update: {},
      create: {
        name: 'Pedigree',
        slug: 'pedigree',
        description: 'Dog food brand',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'Whiskas' },
      update: {},
      create: {
        name: 'Whiskas',
        slug: 'whiskas',
        description: 'Cat food brand',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'KONG' },
      update: {},
      create: {
        name: 'KONG',
        slug: 'kong',
        description: 'Pet toy brand',
        isActive: true,
      },
    }),
    prisma.brand.upsert({
      where: { name: 'Petmate' },
      update: {},
      create: {
        name: 'Petmate',
        slug: 'petmate',
        description: 'Pet accessories brand',
        isActive: true,
      },
    }),
  ]);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'premium' },
      update: {},
      create: {
        name: 'Premium',
        slug: 'premium',
        color: '#gold',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'organic' },
      update: {},
      create: {
        name: 'Organic',
        slug: 'organic',
        color: '#green',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'bestseller' },
      update: {},
      create: {
        name: 'Best Seller',
        slug: 'bestseller',
        color: '#red',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'new-arrival' },
      update: {},
      create: {
        name: 'New Arrival',
        slug: 'new-arrival',
        color: '#blue',
      },
    }),
    prisma.tag.upsert({
      where: { slug: 'sale' },
      update: {},
      create: {
        name: 'Sale',
        slug: 'sale',
        color: '#orange',
      },
    }),
  ]);

  console.log('Basic data seed completed!');
  console.log(`Created ${categories.length} categories`);
  console.log(`Created ${brands.length} brands`);
  console.log(`Created ${tags.length} tags`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });