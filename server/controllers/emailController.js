const prisma = require('../prismaClient');
const nodemailer = require('nodemailer');

// Cấu hình email transporter (cần cấu hình trong .env)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Lấy danh sách email campaigns
 */
const getCampaigns = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const where = {};
    if (status) {
      where.status = status;
    }
    // Chỉ admin mới xem được tất cả campaigns
    if (userRole !== 'admin') {
      where.createdBy = userId;
    }

    const campaigns = await prisma.emailCampaign.findMany({
      where,
      include: {
        stats: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: parseInt(limit),
      skip: (parseInt(page) - 1) * parseInt(limit),
    });

    const total = await prisma.emailCampaign.count({ where });

    res.json({
      success: true,
      data: campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách campaigns',
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết một campaign
 */
const getCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        stats: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy campaign',
      });
    }

    // Kiểm tra quyền truy cập
    if (userRole !== 'admin' && campaign.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    res.json({
      success: true,
      data: campaign,
    });
  } catch (error) {
    console.error('Error getting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin campaign',
      error: error.message,
    });
  }
};

/**
 * Tạo campaign mới
 */
const createCampaign = async (req, res) => {
  try {
    const { name, subject, content, recipients, scheduledAt } = req.body;
    const userId = req.user.id;

    if (!name || !subject || !content) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc',
      });
    }

    const campaign = await prisma.emailCampaign.create({
      data: {
        name,
        subject,
        content,
        recipients: recipients || [],
        scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
        status: scheduledAt ? 'SCHEDULED' : 'DRAFT',
        createdBy: userId,
        stats: {
          create: {
            sent: 0,
            opened: 0,
            clicked: 0,
            bounced: 0,
            unsubscribed: 0,
          },
        },
      },
      include: {
        stats: true,
      },
    });

    res.status(201).json({
      success: true,
      data: campaign,
      message: 'Tạo campaign thành công',
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tạo campaign',
      error: error.message,
    });
  }
};

/**
 * Cập nhật campaign
 */
const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, subject, content, recipients, scheduledAt, status } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy campaign',
      });
    }

    // Kiểm tra quyền
    if (userRole !== 'admin' && campaign.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền chỉnh sửa',
      });
    }

    // Không cho phép chỉnh sửa campaign đã gửi
    if (campaign.status === 'SENT' && status !== 'SENT') {
      return res.status(400).json({
        success: false,
        message: 'Không thể chỉnh sửa campaign đã gửi',
      });
    }

    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(subject && { subject }),
        ...(content && { content }),
        ...(recipients && { recipients }),
        ...(scheduledAt && { scheduledAt: new Date(scheduledAt) }),
        ...(status && { status }),
      },
      include: {
        stats: true,
      },
    });

    res.json({
      success: true,
      data: updatedCampaign,
      message: 'Cập nhật campaign thành công',
    });
  } catch (error) {
    console.error('Error updating campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật campaign',
      error: error.message,
    });
  }
};

/**
 * Xóa campaign
 */
const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy campaign',
      });
    }

    // Kiểm tra quyền
    if (userRole !== 'admin' && campaign.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa',
      });
    }

    // Không cho phép xóa campaign đã gửi
    if (campaign.status === 'SENT') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa campaign đã gửi',
      });
    }

    await prisma.emailCampaign.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Xóa campaign thành công',
    });
  } catch (error) {
    console.error('Error deleting campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi xóa campaign',
      error: error.message,
    });
  }
};

/**
 * Gửi email campaign
 */
const sendCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const campaign = await prisma.emailCampaign.findUnique({
      where: { id },
      include: {
        stats: true,
      },
    });

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy campaign',
      });
    }

    // Kiểm tra quyền
    if (userRole !== 'admin' && campaign.createdBy !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền gửi campaign',
      });
    }

    if (campaign.status === 'SENT') {
      return res.status(400).json({
        success: false,
        message: 'Campaign đã được gửi',
      });
    }

    if (campaign.recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Campaign chưa có người nhận',
      });
    }

    // Tạo transporter
    const transporter = createTransporter();

    if (!transporter) {
      return res.status(500).json({
        success: false,
        message: 'Cấu hình email chưa đúng',
      });
    }

    // Gửi email
    let sentCount = 0;
    let errorCount = 0;

    for (const recipient of campaign.recipients) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: recipient,
          subject: campaign.subject,
          html: campaign.content,
        });
        sentCount++;
      } catch (error) {
        console.error(`Error sending to ${recipient}:`, error);
        errorCount++;
      }
    }

    // Cập nhật campaign
    const updatedCampaign = await prisma.emailCampaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
        stats: {
          update: {
            sent: sentCount,
            bounced: errorCount,
          },
        },
      },
      include: {
        stats: true,
      },
    });

    res.json({
      success: true,
      data: updatedCampaign,
      message: `Đã gửi ${sentCount} email thành công`,
    });
  } catch (error) {
    console.error('Error sending campaign:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi gửi campaign',
      error: error.message,
    });
  }
};

/**
 * Lấy danh sách users để chọn làm recipients
 */
const getRecipients = async (req, res) => {
  try {
    const { role, search } = req.query;

    const where = {};
    if (role) {
      where.role = role;
    }
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 100,
    });

    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('Error getting recipients:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách người nhận',
      error: error.message,
    });
  }
};

module.exports = {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  sendCampaign,
  getRecipients,
};
