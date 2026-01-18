const prisma = require('../prisma/client');

// @desc    Book an appointment
// @route   POST /api/appointments
// @access  Private
const createAppointment = async (req, res) => {
    const { petId, service, date, time, notes } = req.body;

    try {
        console.log('Create appointment request:', {
            userId: req.user.id,
            petId,
            service,
            date,
            time,
            notes
        });

        // Validate pet belongs to user (if petId provided)
        if (petId) {
            console.log('Checking pet with ID:', petId);
            const pet = await prisma.pet.findUnique({
                where: { id: petId }
            });

            console.log('Found pet:', pet);

            if (!pet) {
                console.log('Pet not found');
                return res.status(400).json({ message: 'Pet not found' });
            }

            if (pet.ownerId !== req.user.id) {
                console.log('Pet owner mismatch:', { petOwnerId: pet.ownerId, userId: req.user.id });
                return res.status(400).json({ message: 'Pet does not belong to you' });
            }
        }

        // Check for existing appointment at same time (optional)
        const existingAppointment = await prisma.appointment.findFirst({
            where: {
                date: new Date(date),
                time: time,
                status: {
                    not: 'CANCELLED'
                }
            }
        });

        if (existingAppointment) {
            return res.status(400).json({ message: 'Time slot is already booked' });
        }

        const appointment = await prisma.appointment.create({
            data: {
                customerId: req.user.id,
                petId: petId || null,
                service,
                date: new Date(date),
                time,
                notes: notes || null,
                status: 'PENDING'
            },
            include: {
                customer: {
                    select: { id: true, name: true, email: true }
                },
                pet: {
                    select: { id: true, name: true, species: true }
                }
            }
        });

        res.status(201).json(appointment);

    } catch (error) {
        console.error('Create appointment error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my appointments
// @route   GET /api/appointments/my
// @access  Private
const getMyAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: { customerId: req.user.id },
            include: {
                pet: {
                    select: { id: true, name: true, species: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(appointments);
    } catch (error) {
        console.error('Get my appointments error:', error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get all appointments (Admin/Staff)
// @route   GET /api/appointments
// @access  Private/Staff
const getAllAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            include: {
                customer: {
                    select: { id: true, name: true, email: true }
                },
                pet: {
                    select: { id: true, name: true, species: true }
                }
            },
            orderBy: { date: 'desc' }
        });
        res.json(appointments);
    } catch (error) {
        console.error('Get all appointments error:', error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Staff
const updateAppointmentStatus = async (req, res) => {
    const { status } = req.body;
    
    try {
        const appointment = await prisma.appointment.update({
            where: { id: req.params.id },
            data: { status },
            include: {
                customer: {
                    select: { id: true, name: true, email: true }
                },
                pet: {
                    select: { id: true, name: true, species: true }
                }
            }
        });

        res.json(appointment);
    } catch (error) {
        console.error('Update appointment error:', error);
        if (error.code === 'P2025') {
            return res.status(404).json({ message: 'Appointment not found' });
        }
        res.status(500).json({ message: error.message });
    }
}

module.exports = { createAppointment, getMyAppointments, getAllAppointments, updateAppointmentStatus };
