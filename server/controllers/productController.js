const prisma = require('../prisma/client');
const { v4: uuidv4 } = require('uuid');

// Helper function to generate SKU
const generateSKU = async (prefix = 'PROD') => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 5).toUpperCase();
  const sku = `${prefix}-${timestamp}-${random}`;

  // Check if SKU exists
  const existing = await prisma.product.findUnique({ where: { sku } });
  if (existing) {
    return generateSKU(prefix); // Retry if exists
  }
  return sku;
};
const mapProductListItem = (product) => {
  const price = product.prices?.[0] || null;
  const inventory = product.inventory;

  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    thumbnail: product.images?.find(i => i.isPrimary)?.url || null,
    price: price?.regularPrice || 0,
    salePrice: price?.salePrice || null,
    inStock: inventory?.availableQuantity > 0,
    category: product.category ? {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug
    } : null,
    brand: product.brand ? {
      id: product.brand.id,
      name: product.brand.name
    } : null
  };
};

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      categoryId,
      brandId,
      status,
      minPrice,
      maxPrice,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Build filter object
    const where = {
      isDeleted: false,
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
    };

    // Search logic (multi-field)
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get products with specific relations for list view
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          brand: { select: { id: true, name: true } },
          images: {
            where: { isPrimary: true },
            take: 1
          },
          inventory: { select: { availableQuantity: true, status: true } },
          prices: {
            where: { isActive: true },
            orderBy: { priority: 'desc' },
            take: 1
          }
        },
        orderBy: { [sortBy]: sortOrder }
      }),
      prisma.product.count({ where })
    ]);

    // Format response
    const formattedProducts = products.map(p => ({
      id: p.id,
      sku: p.sku,
      name: p.name,
      slug: p.slug,
      image: p.images[0]?.url || null,
      category: p.category,
      brand: p.brand,
      price: p.prices[0]?.regularPrice || 0,
      salePrice: p.prices[0]?.salePrice || null,
      stock: p.inventory?.availableQuantity || 0,
      status: p.status,
      createdAt: p.createdAt
    }));

    res.json({
      data: formattedProducts,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        pages: Math.ceil(total / limitNumber)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await prisma.product.findFirst({
      where: {
        id: req.params.id,
        isDeleted: false
      },
      include: {
        category: {
          include: { parent: true }
        },
        brand: true,
        images: {
          orderBy: { sortOrder: 'asc' }
        },
        videos: true,
        documents: true,
        tags: {
          include: { tag: true }
        },
        variants: {
          where: { isActive: true }
        },
        inventory: true,
        prices: {
          where: {
            isActive: true,
            startDate: { lte: new Date() },
            OR: [
              { endDate: null },
              { endDate: { gte: new Date() } }
            ]
          },
          include: {
            channel: true,
            region: true,
            customerGroup: true
          },
          orderBy: { priority: 'desc' }
        },
        promotions: {
          include: {
            promotion: {
              where: {
                isActive: true,
                startDate: { lte: new Date() },
                endDate: { gte: new Date() }
              }
            }
          }
        }
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      sku,
      name,
      shortDescription,
      description,
      categoryId,
      brandId,
      attributes,
      tags,
      images,
      videos,
      documents,
      variants,
      costPrice,
      regularPrice,
      salePrice,
      vatRate
    } = req.body;

    // 1. Validation: Required fields
    if (!name || !categoryId) {
      return res.status(400).json({ message: 'Name and categoryId are required' });
    }

    // 2. Validation: Check Category Existence
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId }
    });
    if (!categoryExists) {
      return res.status(400).json({ message: `Category with ID ${categoryId} not found.` });
    }

    // 3. Validation: Check Brand Existence (if provided)
    if (brandId) {
      const brandExists = await prisma.brand.findUnique({
        where: { id: brandId }
      });
      if (!brandExists) {
        return res.status(400).json({ message: `Brand with ID ${brandId} not found.` });
      }
    }

    // 4. Generate or Validate SKU
    let productSKU = sku;
    if (!productSKU) {
      productSKU = await generateSKU();
    } else {
      const skuExists = await prisma.product.findUnique({ where: { sku: productSKU } });
      if (skuExists) {
        return res.status(400).json({ message: 'SKU already exists' });
      }
    }

    // 5. Determine Status
    // Allowed: IN_STOCK, OUT_OF_STOCK, DISCONTINUED
    // Calculate stock from variants OR use direct stock field for simple products
    let initialStock = 0;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      initialStock = variants.reduce((sum, v) => sum + (v.stock || 0), 0);
    } else if (req.body.stock) {
      initialStock = parseInt(req.body.stock) || 0;
    }

    let status = 'IN_STOCK';
    if (initialStock === 0) {
      status = 'OUT_OF_STOCK';
    }
    // User can force status if it's one of the allowed, but we default to logic above
    if (req.body.status && ['IN_STOCK', 'OUT_OF_STOCK', 'DISCONTINUED'].includes(req.body.status)) {
      status = req.body.status;
    }

    // 6. Prepare Variants
    let preparedVariants = undefined;
    if (variants && Array.isArray(variants) && variants.length > 0) {
      preparedVariants = [];
      for (const variant of variants) {
        preparedVariants.push({
          sku: variant.sku || await generateSKU('VAR'),
          name: variant.name,
          attributes: variant.attributes || {},
          price: variant.price,
          stock: variant.stock || 0,
          isActive: true
        });
      }
    }

    // 7. Create Product
    const product = await prisma.product.create({
      data: {
        sku: productSKU,
        name,
        shortDescription,
        description,
        categoryId,
        brandId,
        attributes: attributes || {},
        status, // Enum value
        isActive: true,
        images: images ? {
          create: images.map((img, index) => ({
            url: img.url,
            alt: img.alt,
            isPrimary: index === 0,
            sortOrder: index
          }))
        } : undefined,
        videos: videos ? {
          create: videos.map(video => ({
            url: video.url,
            type: video.type || 'YOUTUBE',
            embedCode: video.embedCode,
            thumbnail: video.thumbnail
          }))
        } : undefined,
        documents: documents ? {
          create: documents.map(doc => ({
            url: doc.url,
            fileName: doc.fileName,
            displayName: doc.displayName,
            fileType: doc.fileType,
            fileSize: doc.fileSize
          }))
        } : undefined,
        tags: tags ? {
          create: tags.map(tagId => ({ tagId }))
        } : undefined,
        variants: preparedVariants ? {
          create: preparedVariants
        } : undefined,
        inventory: {
          create: {
            quantity: initialStock,
            availableQuantity: initialStock,
            status: initialStock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK'
          }
        },
        prices: (costPrice || regularPrice) ? {
          create: {
            name: 'Default Price',
            costPrice: costPrice || 0,
            regularPrice: regularPrice || 0,
            salePrice: salePrice,
            vatRate: vatRate || 10,
            startDate: new Date(),
            isActive: true
          }
        } : undefined
      },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true
      }
    });

    // 8. Initial Stock Movement
    if (initialStock > 0) {
      await prisma.stockMovement.create({
        data: {
          inventoryId: product.inventory.id,
          productId: product.id,
          type: 'IN',
          quantity: initialStock,
          balanceBefore: 0,
          balanceAfter: initialStock,
          referenceType: 'PRODUCT_CREATION',
          reason: 'Initial stock',
          notes: 'Product created with initial stock'
        }
      });
    }

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    // Handle Prisma Key Constraint Violation (P2003) - e.g., Invalid Foreign Key
    if (error.code === 'P2003') {
      return res.status(400).json({
        message: 'Invalid reference ID. Please check categoryId, brandId, or tagIds.',
        detail: error.meta?.field_name
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      shortDescription,
      description,
      categoryId,
      brandId,
      attributes,
      tags,
      images,
      videos,
      documents,
      variants,
      status
    } = req.body;

    // Check if product exists
    const existingProduct = await prisma.product.findFirst({
      where: { id, isDeleted: false }
    });

    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    // ===== STEP 1: Prepare variants (async-safe) =====
    let preparedVariants = undefined;

    if (variants && Array.isArray(variants) && variants.length > 0) {
      preparedVariants = [];

      for (const variant of variants) {
        preparedVariants.push({
          sku: variant.sku || await generateSKU('VAR'),
          name: variant.name,
          attributes: variant.attributes || {},
          price: variant.price,
          stock: variant.stock || 0
        });
      }
    }
    // Update product
    const product = await prisma.product.update({
      where: { id },
      data: {
        name,
        shortDescription,
        description,
        categoryId,
        brandId,
        attributes,
        status,
        // Handle images
        ...(images && {
          images: {
            deleteMany: {},
            create: images.map((img, index) => ({
              url: img.url,
              alt: img.alt,
              isPrimary: index === 0,
              sortOrder: index
            }))
          }
        }),
        // Handle videos
        ...(videos && {
          videos: {
            deleteMany: {},
            create: videos.map(video => ({
              url: video.url,
              type: video.type || 'EMBED',
              embedCode: video.embedCode,
              thumbnail: video.thumbnail
            }))
          }
        }),
        // Handle documents
        ...(documents && {
          documents: {
            deleteMany: {},
            create: documents.map(doc => ({
              url: doc.url,
              fileName: doc.fileName,
              displayName: doc.displayName,
              fileType: doc.fileType,
              fileSize: doc.fileSize
            }))
          }
        }),
        // Handle tags
        ...(tags && {
          tags: {
            deleteMany: {},
            create: tags.map(tagId => ({ tagId }))
          }
        }),
        // Handle variants
        // Handle variants
        ...(preparedVariants && {
          variants: {
            deleteMany: {},
            create: preparedVariants
          }
        }),

      },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true
      }
    });

    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete product (soft delete)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.update({
      where: { id },
      data: {
        isDeleted: true,
        deletedAt: new Date(),
        isActive: false,
        status: 'DISCONTINUED'
      }
    });

    // Also update inventory status
    await prisma.inventory.updateMany({
      where: { productId: id },
      data: { status: 'DISCONTINUED' }
    });

    res.json({ message: 'Product deleted successfully', product });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get categories
// @route   GET /api/products/categories
// @access  Public
const getCategories = async (req, res) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      include: {
        parent: true,
        children: true,
        _count: {
          select: { products: true }
        }
      },
      orderBy: { sortOrder: 'asc' }
    });

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get brands
// @route   GET /api/products/brands
// @access  Public
const getBrands = async (req, res) => {
  try {
    const brands = await prisma.brand.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });

    res.json(brands);
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get tags
// @route   GET /api/products/tags
// @access  Public
const getTags = async (req, res) => {
  try {
    const tags = await prisma.tag.findMany({
      orderBy: { name: 'asc' }
    });

    res.json(tags);
  } catch (error) {
    console.error('Get tags error:', error);
    res.status(500).json({ message: error.message });
  }
};
const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const product = await prisma.product.findFirst({
      where: {
        slug,
        isDeleted: false
      },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true
      }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by slug error:', error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  getProducts,
  getProductById,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getBrands,
  getTags
};
