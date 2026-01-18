const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
    { name: 'Dog', slug: 'dog', description: 'Products for dogs' },
    { name: 'Cat', slug: 'cat', description: 'Products for cats' },
];

const products = [
    {
        name: 'Premium Dog Food',
        price: 45.99,
        salePrice: null,
        categorySlug: 'dog',
        image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop',
        tag: 'sale', // Note: We need to handle tags separately or add logic
        description: 'Nutritious blend for your dog with high protein content and essential vitamins.',
        inStock: true
    },
    {
        name: 'Stainless Dog Bowl',
        price: 12.99,
        salePrice: null,
        categorySlug: 'dog',
        image: '/assets/products/dog-bowl-stainless.png', // Placeholder path
        tag: 'popular',
        description: 'Durable and easy to clean stainless steel bowl, perfect for food or water.',
        inStock: true
    },
    {
        name: 'Chew Bone Toy',
        price: 8.99,
        salePrice: null,
        categorySlug: 'dog',
        image: '/assets/products/chew-bone-toy.png',
        description: 'Keep your dog entertained for hours with this durable rubber chew toy.',
        inStock: true
    },
    {
        name: 'Comfy Dog Bed',
        price: 55.00,
        salePrice: null,
        categorySlug: 'dog',
        image: '/assets/products/comfy-dog-bed.png',
        tag: 'new',
        description: 'Softest sleep for your pet with memory foam cushion and washable cover.',
        inStock: true
    },
    {
        name: 'Dog Mania Food',
        price: 30.50,
        salePrice: null,
        categorySlug: 'dog',
        image: '/assets/products/dog-mania-food.png',
        description: 'Delicious flavor they love, made with real chicken and vegetables.',
        inStock: true
    },
    {
        name: 'Water Fountain',
        price: 35.99,
        salePrice: null,
        categorySlug: 'cat',
        image: '/assets/products/water-fountain.png',
        description: 'Fresh running water to encourage hydration for your cat throughout the day.',
        inStock: true
    },
    {
        name: 'Nutriplan Cat Food',
        price: 28.00,
        salePrice: null,
        categorySlug: 'cat',
        image: '/assets/products/nutriplan-cat-food.png',
        tag: 'popular',
        description: 'Balanced diet for cats specially formulated for indoor felines.',
        inStock: true
    },
    {
        name: 'Tasty Treat Pouch',
        price: 5.99,
        salePrice: null,
        categorySlug: 'cat',
        image: '/assets/products/tasty-treat-pouch.png',
        description: 'Irresistible snacks perfect for training or just showing some love.',
        inStock: false
    }
];

async function main() {
    console.log('Start seeding...');

    // 1. Create Categories
    const categoryMap = {};
    for (const cat of categories) {
        const upsertedCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categoryMap[cat.slug] = upsertedCat.id;
        console.log(`Upserted category: ${cat.name}`);
    }

    // 2. Create Products
    for (const p of products) {
        // Generate simple SKU
        const sku = `PROD-${Math.floor(Math.random() * 100000)}`;

        // Check if exists by name to avoid duplicates on re-run (simplified)
        const existing = await prisma.product.findFirst({
            where: { name: p.name }
        });

        if (!existing) {
            const product = await prisma.product.create({
                data: {
                    sku: sku,
                    name: p.name,
                    shortDescription: p.description,
                    description: p.description,
                    categoryId: categoryMap[p.categorySlug],
                    status: p.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK',
                    images: {
                        create: [{
                            url: p.image,
                            isPrimary: true,
                            alt: p.name
                        }]
                    },
                    inventory: {
                        create: {
                            quantity: p.inStock ? 50 : 0,
                            availableQuantity: p.inStock ? 50 : 0,
                            status: p.inStock ? 'IN_STOCK' : 'OUT_OF_STOCK'
                        }
                    },
                    prices: {
                        create: {
                            name: 'Default',
                            costPrice: p.price * 0.7,
                            regularPrice: p.price,
                            salePrice: p.salePrice,
                            vatRate: 10,
                            startDate: new Date(),
                            isActive: true
                        }
                    }
                }
            });
            console.log(`Created product: ${p.name}`);
        } else {
            console.log(`Product already exists: ${p.name}`);
        }
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
