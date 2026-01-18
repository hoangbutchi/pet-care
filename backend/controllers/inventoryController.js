const prisma = require('../prisma/client');

// @desc    Get inventory for a product
// @route   GET /api/inventory/product/:productId
// @access  Public
const getProductInventory = async (req, res) => {
  try {
    const { productId } = req.params;

    const inventory = await prisma.inventory.findUnique({
      where: { productId },
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        },
        movements: {
          orderBy: { performedAt: 'desc' },
          take: 10
        }
      }
    });

    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    res.json(inventory);
  } catch (error) {
    console.error('Get product inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update inventory (adjust stock)
// @route   PUT /api/inventory/:id
// @access  Private/Admin
const updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      quantity,
      minimumLevel,
      maximumLevel,
      reorderPoint,
      status,
      reason,
      notes
    } = req.body;

    const inventory = await prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const oldQuantity = inventory.quantity;
    const newQuantity = quantity !== undefined ? quantity : oldQuantity;
    const quantityChange = newQuantity - oldQuantity;

    // Determine movement type
    let movementType = 'ADJUSTMENT';
    if (quantityChange > 0) {
      movementType = 'IN';
    } else if (quantityChange < 0) {
      movementType = 'OUT';
    }

    // Update inventory
    const availableQuantity = newQuantity - (inventory.reservedQuantity || 0);
    
    // Auto-update status based on quantity
    let autoStatus = inventory.status;
    if (status) {
      autoStatus = status;
    } else {
      if (newQuantity === 0) {
        autoStatus = 'OUT_OF_STOCK';
      } else if (minimumLevel && newQuantity < minimumLevel) {
        autoStatus = 'LOW_STOCK';
      } else if (newQuantity > 0) {
        autoStatus = 'IN_STOCK';
      }
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        availableQuantity,
        minimumLevel: minimumLevel !== undefined ? minimumLevel : inventory.minimumLevel,
        maximumLevel: maximumLevel !== undefined ? maximumLevel : inventory.maximumLevel,
        reorderPoint: reorderPoint !== undefined ? reorderPoint : inventory.reorderPoint,
        status: autoStatus,
        lastUpdated: new Date(),
        ...(quantityChange > 0 && { lastRestocked: new Date() })
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        }
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: inventory.productId },
      data: { status: autoStatus }
    });

    // Create stock movement record
    if (quantityChange !== 0) {
      await prisma.stockMovement.create({
        data: {
          inventoryId: id,
          productId: inventory.productId,
          type: movementType,
          quantity: Math.abs(quantityChange),
          balanceBefore: oldQuantity,
          balanceAfter: newQuantity,
          referenceType: 'MANUAL_ADJUSTMENT',
          reason: reason || 'Manual inventory adjustment',
          notes,
          performedBy: req.user?.id
        }
      });
    }

    res.json(updatedInventory);
  } catch (error) {
    console.error('Update inventory error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stock in (add stock)
// @route   POST /api/inventory/:id/stock-in
// @access  Private/Admin
const stockIn = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, notes, referenceType, referenceId } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const inventory = await prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    const oldQuantity = inventory.quantity;
    const newQuantity = oldQuantity + quantity;
    const availableQuantity = newQuantity - (inventory.reservedQuantity || 0);

    // Update status
    let newStatus = inventory.status;
    if (minimumLevel && newQuantity >= minimumLevel) {
      newStatus = 'IN_STOCK';
    } else if (newQuantity > 0) {
      newStatus = 'LOW_STOCK';
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        availableQuantity,
        status: newStatus,
        lastRestocked: new Date(),
        lastUpdated: new Date()
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        }
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: inventory.productId },
      data: { status: newStatus }
    });

    // Create stock movement
    await prisma.stockMovement.create({
      data: {
        inventoryId: id,
        productId: inventory.productId,
        type: 'IN',
        quantity,
        balanceBefore: oldQuantity,
        balanceAfter: newQuantity,
        referenceType: referenceType || 'STOCK_IN',
        referenceId,
        reason: reason || 'Stock in',
        notes,
        performedBy: req.user?.id
      }
    });

    res.json(updatedInventory);
  } catch (error) {
    console.error('Stock in error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stock out (remove stock)
// @route   POST /api/inventory/:id/stock-out
// @access  Private/Admin
const stockOut = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, reason, notes, referenceType, referenceId } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Valid quantity is required' });
    }

    const inventory = await prisma.inventory.findUnique({ where: { id } });
    if (!inventory) {
      return res.status(404).json({ message: 'Inventory not found' });
    }

    if (inventory.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient stock' });
    }

    const oldQuantity = inventory.quantity;
    const newQuantity = oldQuantity - quantity;
    const availableQuantity = newQuantity - (inventory.reservedQuantity || 0);

    // Update status
    let newStatus = inventory.status;
    if (newQuantity === 0) {
      newStatus = 'OUT_OF_STOCK';
    } else if (minimumLevel && newQuantity < inventory.minimumLevel) {
      newStatus = 'LOW_STOCK';
    }

    const updatedInventory = await prisma.inventory.update({
      where: { id },
      data: {
        quantity: newQuantity,
        availableQuantity,
        status: newStatus,
        lastUpdated: new Date()
      },
      include: {
        product: {
          select: { id: true, name: true, sku: true }
        }
      }
    });

    // Update product status
    await prisma.product.update({
      where: { id: inventory.productId },
      data: { status: newStatus }
    });

    // Create stock movement
    await prisma.stockMovement.create({
      data: {
        inventoryId: id,
        productId: inventory.productId,
        type: 'OUT',
        quantity,
        balanceBefore: oldQuantity,
        balanceAfter: newQuantity,
        referenceType: referenceType || 'STOCK_OUT',
        referenceId,
        reason: reason || 'Stock out',
        notes,
        performedBy: req.user?.id
      }
    });

    res.json(updatedInventory);
  } catch (error) {
    console.error('Stock out error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stock movements
// @route   GET /api/inventory/:id/movements
// @access  Private/Admin
const getStockMovements = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 50, type, startDate, endDate } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const where = {
      inventoryId: id,
      ...(type && { type }),
      ...(startDate && endDate && {
        performedAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      })
    };

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: parseInt(limit),
        orderBy: { performedAt: 'desc' }
      }),
      prisma.stockMovement.count({ where })
    ]);

    res.json({
      data: movements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get stock movements error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get low stock products
// @route   GET /api/inventory/low-stock
// @access  Private/Admin
const getLowStockProducts = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const inventories = await prisma.inventory.findMany({
      where: {
        OR: [
          { status: 'LOW_STOCK' },
          { status: 'OUT_OF_STOCK' },
          {
            AND: [
              { quantity: { lt: prisma.inventory.fields.minimumLevel } },
              { quantity: { gt: 0 } }
            ]
          }
        ]
      },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            status: true,
            images: {
              where: { isPrimary: true },
              take: 1
            }
          }
        }
      },
      orderBy: [
        { status: 'asc' },
        { quantity: 'asc' }
      ],
      skip,
      take: parseInt(limit)
    });

    const total = await prisma.inventory.count({
      where: {
        OR: [
          { status: 'LOW_STOCK' },
          { status: 'OUT_OF_STOCK' },
          {
            AND: [
              { quantity: { lt: prisma.inventory.fields.minimumLevel } },
              { quantity: { gt: 0 } }
            ]
          }
        ]
      }
    });

    res.json({
      data: inventories,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get low stock products error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inventory dashboard stats
// @route   GET /api/inventory/dashboard
// @access  Private/Admin
const getInventoryDashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
      lowStockProducts
    ] = await Promise.all([
      prisma.inventory.count(),
      prisma.inventory.count({ where: { status: 'IN_STOCK' } }),
      prisma.inventory.count({ where: { status: 'LOW_STOCK' } }),
      prisma.inventory.count({ where: { status: 'OUT_OF_STOCK' } }),
      // Total value calculation would need price data
      prisma.inventory.count({ where: { status: 'LOW_STOCK' } }),
      prisma.inventory.findMany({
        where: {
          OR: [
            { status: 'LOW_STOCK' },
            { status: 'OUT_OF_STOCK' }
          ]
        },
        include: {
          product: {
            select: {
              id: true,
              name: true,
              sku: true
            }
          }
        },
        take: 10,
        orderBy: { quantity: 'asc' }
      })
    ]);

    res.json({
      summary: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock,
        totalValue: 0 // Would calculate from prices
      },
      lowStockProducts
    });
  } catch (error) {
    console.error('Get inventory dashboard error:', error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProductInventory,
  updateInventory,
  stockIn,
  stockOut,
  getStockMovements,
  getLowStockProducts,
  getInventoryDashboard
};
