const prisma = require('../prismaClient');
const { v4: uuidv4 } = require('uuid');

/**
 * Lấy danh sách consultations
 */
const getConsultations = async (req, res) => {
  try {
    const { status, role } = req.query;
    const userId = req.user.id;
    const userRole = req.user.role;

    const where = {};
    if (status) {
      where.status = status;
    }

    // Client chỉ xem được consultations của mình
    // Consultant xem được consultations được assign
    // Admin xem được tất cả
    if (userRole === 'user' || userRole === 'client') {
      where.clientId = userId;
    } else if (userRole === 'consultant' || userRole === 'vet') {
      where.consultantId = userId;
    }
    // Admin xem tất cả, không cần filter

    const consultations = await prisma.consultation.findMany({
      where,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
          },
        },
      },
      orderBy: {
        scheduledAt: 'desc',
      },
    });

    res.json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error('Error getting consultations:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách lịch tư vấn',
      error: error.message,
    });
  }
};

/**
 * Lấy chi tiết một consultation
 */
const getConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
            breed: true,
            age: true,
            weight: true,
          },
        },
      },
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tư vấn',
      });
    }

    // Kiểm tra quyền truy cập
    if (
      userRole !== 'admin' &&
      consultation.clientId !== userId &&
      consultation.consultantId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập',
      });
    }

    res.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error('Error getting consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy thông tin lịch tư vấn',
      error: error.message,
    });
  }
};

/**
 * Tạo consultation mới
 */
const createConsultation = async (req, res) => {
  try {
    const { consultantId, petId, scheduledAt, duration = 30, notes } = req.body;
    const userId = req.user.id;

    if (!consultantId || !scheduledAt) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (consultantId, scheduledAt)',
      });
    }

    // Kiểm tra consultant có tồn tại không
    const consultant = await prisma.user.findUnique({
      where: { id: consultantId },
    });

    if (!consultant || (consultant.role !== 'consultant' && consultant.role !== 'vet' && consultant.role !== 'admin')) {
      return res.status(400).json({
        success: false,
        message: 'Consultant không hợp lệ',
      });
    }

    // Kiểm tra pet nếu có
    if (petId) {
      const pet = await prisma.pet.findUnique({
        where: { id: petId },
      });

      if (!pet || pet.ownerId !== userId) {
        return res.status(400).json({
          success: false,
          message: 'Pet không hợp lệ',
        });
      }
    }

    // Kiểm tra xung đột lịch
    const conflictingConsultation = await prisma.consultation.findFirst({
      where: {
        consultantId,
        scheduledAt: {
          gte: new Date(new Date(scheduledAt).getTime() - duration * 60000),
          lte: new Date(new Date(scheduledAt).getTime() + duration * 60000),
        },
        status: {
          not: 'CANCELLED',
        },
      },
    });

    if (conflictingConsultation) {
      return res.status(400).json({
        success: false,
        message: 'Consultant đã có lịch hẹn vào thời gian này',
      });
    }

    // Tạo roomId unique
    const roomId = `room-${uuidv4()}`;

    const consultation = await prisma.consultation.create({
      data: {
        clientId: userId,
        consultantId,
        petId: petId || null,
        scheduledAt: new Date(scheduledAt),
        duration,
        notes: notes || null,
        roomId,
        status: 'SCHEDULED',
      },
      include: {
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: petId
          ? {
              select: {
                id: true,
                name: true,
                species: true,
              },
            }
          : false,
      },
    });

    res.status(201).json({
      success: true,
      data: consultation,
      message: 'Đặt lịch tư vấn thành công',
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi đặt lịch tư vấn',
      error: error.message,
    });
  }
};

/**
 * Cập nhật consultation
 */
const updateConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const { scheduledAt, duration, notes, status, documents } = req.body;
    const userId = req.user.id;
    const userRole = req.user.role;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tư vấn',
      });
    }

    // Kiểm tra quyền
    if (
      userRole !== 'admin' &&
      consultation.clientId !== userId &&
      consultation.consultantId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền chỉnh sửa',
      });
    }

    // Không cho phép chỉnh sửa consultation đã hoàn thành
    if (consultation.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Không thể chỉnh sửa lịch tư vấn đã hoàn thành',
      });
    }

    const updateData = {};
    if (scheduledAt) updateData.scheduledAt = new Date(scheduledAt);
    if (duration) updateData.duration = duration;
    if (notes !== undefined) updateData.notes = notes;
    if (status) updateData.status = status;
    if (documents) updateData.documents = documents;

    // Nếu bắt đầu consultation
    if (status === 'IN_PROGRESS' && consultation.status !== 'IN_PROGRESS') {
      updateData.startedAt = new Date();
    }

    // Nếu kết thúc consultation
    if (status === 'COMPLETED' && consultation.status !== 'COMPLETED') {
      updateData.endedAt = new Date();
    }

    const updatedConsultation = await prisma.consultation.update({
      where: { id },
      data: updateData,
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        consultant: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        pet: {
          select: {
            id: true,
            name: true,
            species: true,
          },
        },
      },
    });

    res.json({
      success: true,
      data: updatedConsultation,
      message: 'Cập nhật lịch tư vấn thành công',
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi cập nhật lịch tư vấn',
      error: error.message,
    });
  }
};

/**
 * Xóa/hủy consultation
 */
const deleteConsultation = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy lịch tư vấn',
      });
    }

    // Kiểm tra quyền
    if (
      userRole !== 'admin' &&
      consultation.clientId !== userId &&
      consultation.consultantId !== userId
    ) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa',
      });
    }

    // Không cho phép xóa consultation đã hoàn thành
    if (consultation.status === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'Không thể xóa lịch tư vấn đã hoàn thành',
      });
    }

    // Thay vì xóa, đánh dấu là CANCELLED
    await prisma.consultation.update({
      where: { id },
      data: {
        status: 'CANCELLED',
      },
    });

    res.json({
      success: true,
      message: 'Hủy lịch tư vấn thành công',
    });
  } catch (error) {
    console.error('Error deleting consultation:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi hủy lịch tư vấn',
      error: error.message,
    });
  }
};

/**
 * Lấy danh sách available slots của consultant
 */
const getAvailableSlots = async (req, res) => {
  try {
    const { consultantId, date, duration = 30 } = req.query;

    if (!consultantId || !date) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc (consultantId, date)',
      });
    }

    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Lấy các consultations đã có trong ngày
    const existingConsultations = await prisma.consultation.findMany({
      where: {
        consultantId,
        scheduledAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          not: 'CANCELLED',
        },
      },
      select: {
        scheduledAt: true,
        duration: true,
      },
    });

    // Tạo danh sách slots trong ngày (9:00 - 17:00, mỗi slot 30 phút)
    const slots = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += parseInt(duration)) {
        const slotTime = new Date(startDate);
        slotTime.setHours(hour, minute, 0, 0);

        // Kiểm tra slot có bị conflict không
        const isConflict = existingConsultations.some((consultation) => {
          const consultStart = new Date(consultation.scheduledAt);
          const consultEnd = new Date(
            consultStart.getTime() + consultation.duration * 60000
          );
          const slotEnd = new Date(slotTime.getTime() + parseInt(duration) * 60000);

          return (
            (slotTime >= consultStart && slotTime < consultEnd) ||
            (slotEnd > consultStart && slotEnd <= consultEnd) ||
            (slotTime <= consultStart && slotEnd >= consultEnd)
          );
        });

        if (!isConflict && slotTime > new Date()) {
          slots.push({
            time: slotTime.toISOString(),
            available: true,
          });
        }
      }
    }

    res.json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Error getting available slots:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách slots',
      error: error.message,
    });
  }
};

/**
 * Lấy danh sách consultants
 */
const getConsultants = async (req, res) => {
  try {
    const consultants = await prisma.user.findMany({
      where: {
        role: {
          in: ['consultant', 'vet', 'admin'],
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({
      success: true,
      data: consultants,
    });
  } catch (error) {
    console.error('Error getting consultants:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách consultants',
      error: error.message,
    });
  }
};

module.exports = {
  getConsultations,
  getConsultation,
  createConsultation,
  updateConsultation,
  deleteConsultation,
  getAvailableSlots,
  getConsultants,
};
