const prisma = require('../prisma/client');

// @desc    Get all pets for logged in user
// @route   GET /api/pets
// @access  Private
const getMyPets = async (req, res) => {
    try {
        const pets = await prisma.pet.findMany({
            where: { ownerId: req.user.id },
            include: {
                medicalHistory: {
                    orderBy: { date: 'desc' }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(pets);
    } catch (error) {
        console.error('Get pets error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a new pet
// @route   POST /api/pets
// @access  Private
const addPet = async (req, res) => {
    const { name, species, breed, age, weight } = req.body;

    try {
        const pet = await prisma.pet.create({
            data: {
                ownerId: req.user.id,
                name,
                species,
                breed: breed || null,
                age: age ? parseFloat(age) : null,
                weight: weight ? parseFloat(weight) : null,
                imageUrl: req.file ? `/uploads/pets/${req.file.filename}` : null
            },
            include: {
                medicalHistory: true
            }
        });

        res.status(201).json(pet);
    } catch (error) {
        console.error("Error adding pet:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ message: 'Pet with this name already exists' });
        }
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add health record/medical history
// @route   POST /api/pets/:id/health
// @access  Private
const addHealthRecord = async (req, res) => {
    const { title, description, vet, date } = req.body;
    try {
        const pet = await prisma.pet.findUnique({
            where: { id: req.params.id }
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Verify owner or staff
        if (pet.ownerId !== req.user.id && req.user.role === 'USER') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const newRecord = await prisma.medicalRecord.create({
            data: {
                petId: req.params.id,
                title,
                description: description || null,
                vet: vet || null,
                date: date ? new Date(date) : new Date()
            }
        });

        const updatedPet = await prisma.pet.findUnique({
            where: { id: req.params.id },
            include: {
                medicalHistory: {
                    orderBy: { date: 'desc' }
                }
            }
        });

        res.status(201).json(updatedPet);

    } catch (error) {
        console.error('Add health record error:', error);
        res.status(500).json({ message: error.message });
    }
}

// @desc    Get Pet by ID
// @route   GET /api/pets/:id
// @access  Private
const getPetById = async (req, res) => {
    try {
        const pet = await prisma.pet.findUnique({
            where: { id: req.params.id },
            include: {
                medicalHistory: {
                    orderBy: { date: 'desc' }
                },
                owner: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        if (!pet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        // Verify owner or staff
        if (pet.ownerId !== req.user.id && req.user.role === 'USER') {
            return res.status(401).json({ message: 'Not authorized' });
        }

        res.json(pet);
    } catch (error) {
        console.error('Get pet by ID error:', error);
        res.status(500).json({ message: error.message });
    }
}

module.exports = { getMyPets, addPet, addHealthRecord, getPetById };
