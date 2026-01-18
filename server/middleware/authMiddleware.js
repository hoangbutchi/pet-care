const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
            
            // Lấy user với role và permissions để set vào req.user
            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
                include: {
                    role: {
                        include: {
                            permissions: true
                        }
                    },
                    permissions: {
                        include: {
                            permission: true
                        }
                    }
                }
            });

            if (!user || !user.isActive) {
                return res.status(401).json({ message: 'Not authorized, user not found or inactive' });
            }

            // Set user info vào req.user
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role ? {
                    id: user.role.id,
                    name: user.role.name,
                    slug: user.role.slug
                } : null,
                simpleRole: user.simpleRole, // Add simple role for backward compatibility
                permissions: [
                    ...(user.role ? user.role.permissions.map(p => p.name) : []),
                    ...user.permissions.map(up => up.permission.name)
                ]
            };
            
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role && req.user.role.slug === 'admin') {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as an admin' });
    }
};

const staffOrAdmin = (req, res, next) => {
    if (req.user && req.user.role && 
        (req.user.role.slug === 'admin' || req.user.role.slug === 'staff')) {
        next();
    } else {
        res.status(401).json({ message: 'Not authorized as staff/admin' });
    }
};

module.exports = { protect, admin, staffOrAdmin };
