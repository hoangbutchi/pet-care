const prisma = require('../prisma/client');

// @desc    Get price tables for a product
// @route   GET /api/prices/product/:productId
// @access  Public
const getProductPrices = async (req, res) => {
  try {
    const { productId } = req.params;
    const { channelId, regionId, customerGroupId, date } = req.query;

    const queryDate = date ? new Date(date) : new Date();

    const where = {
      productId,
      isActive: true,
      startDate: { lte: queryDate },
      OR: [
        { endDate: null },
        { endDate: { gte: queryDate } }
      ],
      ...(channelId && { channelId }),
      ...(regionId && { regionId }),
      ...(customerGroupId && { customerGroupId })
    };

    const prices = await prisma.priceTable.findMany({
      where,
      include: {
        channel: true,
        region: true,
        customerGroup: true,
        product: {
          select: { id: true, name: true, sku: true }
        }
      },
      orderBy: { priority: 'desc' }
    });

    res.json(prices);
  } catch (error) {
    console.error('Get product prices error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create price table
// @route   POST /api/prices
// @access  Private/Admin
const createPriceTable = async (req, res) => {
  try {
    const {
      name,
      description,
      productId,
      channelId,
      regionId,
      customerGroupId,
      costPrice,
      regularPrice,
      salePrice,
      vatRate,
      startDate,
      endDate,
      priority
    } = req.body;

    // Validation
    if (!productId || !regularPrice) {
      return res.status(400).json({ message: 'Product ID and regular price are required' });
    }

    // Calculate margin and VAT
    const margin = regularPrice && costPrice ? regularPrice - costPrice : null;
    const vatAmount = regularPrice && vatRate ? (regularPrice * vatRate) / 100 : null;

    const priceTable = await prisma.priceTable.create({
      data: {
        name,
        description,
        productId,
        channelId,
        regionId,
        customerGroupId,
        costPrice: costPrice || 0,
        regularPrice,
        salePrice,
        margin,
        vatRate: vatRate || 10,
        vatAmount,
        startDate: startDate ? new Date(startDate) : new Date(),
        endDate: endDate ? new Date(endDate) : null,
        priority: priority || 0
      },
      include: {
        channel: true,
        region: true,
        customerGroup: true,
        product: {
          select: { id: true, name: true, sku: true }
        }
      }
    });

    // Log price history
    await prisma.priceHistory.create({
      data: {
        priceTableId: priceTable.id,
        oldPrice: 0,
        newPrice: regularPrice,
        changedBy: req.user?.id,
        reason: 'Price table created'
      }
    });

    res.status(201).json(priceTable);
  } catch (error) {
    console.error('Create price table error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update price table
// @route   PUT /api/prices/:id
// @access  Private/Admin
const updatePriceTable = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      costPrice,
      regularPrice,
      salePrice,
      vatRate,
      startDate,
      endDate,
      priority,
      isActive
    } = req.body;

    // Get old price
    const oldPriceTable = await prisma.priceTable.findUnique({ where: { id } });
    if (!oldPriceTable) {
      return res.status(404).json({ message: 'Price table not found' });
    }

    // Calculate margin and VAT
    const margin = regularPrice && costPrice ? regularPrice - costPrice : null;
    const vatAmount = regularPrice && vatRate ? (regularPrice * vatRate) / 100 : null;

    const priceTable = await prisma.priceTable.update({
      where: { id },
      data: {
        name,
        description,
        costPrice,
        regularPrice,
        salePrice,
        margin,
        vatRate,
        vatAmount,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        priority,
        isActive
      },
      include: {
        channel: true,
        region: true,
        customerGroup: true,
        product: {
          select: { id: true, name: true, sku: true }
        }
      }
    });

    // Log price history if price changed
    if (regularPrice && regularPrice !== oldPriceTable.regularPrice) {
      await prisma.priceHistory.create({
        data: {
          priceTableId: id,
          oldPrice: oldPriceTable.regularPrice,
          newPrice: regularPrice,
          changedBy: req.user?.id,
          reason: req.body.reason || 'Price updated'
        }
      });
    }

    res.json(priceTable);
  } catch (error) {
    console.error('Update price table error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete price table
// @route   DELETE /api/prices/:id
// @access  Private/Admin
const deletePriceTable = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.priceTable.delete({
      where: { id }
    });

    res.json({ message: 'Price table deleted successfully' });
  } catch (error) {
    console.error('Delete price table error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get price history
// @route   GET /api/prices/:id/history
// @access  Private/Admin
const getPriceHistory = async (req, res) => {
  try {
    const { id } = req.params;
    const { limit = 50 } = req.query;

    const history = await prisma.priceHistory.findMany({
      where: { priceTableId: id },
      orderBy: { changedAt: 'desc' },
      take: parseInt(limit)
    });

    res.json(history);
  } catch (error) {
    console.error('Get price history error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create promotion
// @route   POST /api/promotions
// @access  Private/Admin
const createPromotion = async (req, res) => {
  try {
    const {
      name,
      description,
      code,
      discountType,
      discountValue,
      minQuantity,
      minOrderValue,
      customerGroupId,
      customerIds,
      startDate,
      endDate,
      usageLimit,
      perCustomerLimit,
      isFlashSale,
      flashSaleStock,
      canStack,
      productIds
    } = req.body;

    if (!name || !discountValue || !startDate || !endDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const promotion = await prisma.promotion.create({
      data: {
        name,
        description,
        code,
        discountType: discountType || 'PERCENTAGE',
        discountValue,
        minQuantity,
        minOrderValue,
        customerGroupId,
        customerIds: customerIds || [],
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        usageLimit,
        perCustomerLimit,
        isFlashSale,
        flashSaleStock,
        canStack,
        products: productIds ? {
          create: productIds.map(productId => ({ productId }))
        } : undefined
      },
      include: {
        products: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
        customerGroup: true
      }
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error('Create promotion error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all promotions
// @route   GET /api/promotions
// @access  Public
const getPromotions = async (req, res) => {
  try {
    const { isActive, startDate, endDate } = req.query;
    const now = new Date();

    const where = {
      ...(isActive !== undefined && { isActive: isActive === 'true' }),
      ...(startDate && { startDate: { lte: new Date(startDate) } }),
      ...(endDate && { endDate: { gte: new Date(endDate) } })
    };

    const promotions = await prisma.promotion.findMany({
      where,
      include: {
        products: {
          include: {
            product: {
              select: { id: true, name: true, sku: true }
            }
          }
        },
        customerGroup: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(promotions);
  } catch (error) {
    console.error('Get promotions error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get price channels, regions, customer groups
// @route   GET /api/prices/channels
// @access  Public
const getPriceChannels = async (req, res) => {
  try {
    const channels = await prisma.priceChannel.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(channels);
  } catch (error) {
    console.error('Get price channels error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getPriceRegions = async (req, res) => {
  try {
    const regions = await prisma.priceRegion.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(regions);
  } catch (error) {
    console.error('Get price regions error:', error);
    res.status(500).json({ message: error.message });
  }
};

const getCustomerGroups = async (req, res) => {
  try {
    const groups = await prisma.customerGroup.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' }
    });
    res.json(groups);
  } catch (error) {
    console.error('Get customer groups error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductPrices,
  createPriceTable,
  updatePriceTable,
  deletePriceTable,
  getPriceHistory,
  createPromotion,
  getPromotions,
  getPriceChannels,
  getPriceRegions,
  getCustomerGroups
};
