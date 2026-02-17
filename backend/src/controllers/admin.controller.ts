import { Request, Response } from 'express';
import User, { IUser } from '../models/User.js';
import bcrypt from 'bcrypt';

/**
 * Get all users
 * @route GET /api/admin/users
 * @access Private/Admin
 */
export const getUsers = async (req: Request, res: Response) => {
    try {
        // Pagination params
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const total = await User.countDocuments();
        const users = await User.find()
            .select('-passwordHash')
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: users,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Get single user
 * @route GET /api/admin/users/:id
 * @access Private/Admin
 */
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Create user
 * @route POST /api/admin/users
 * @access Private/Admin
 */
export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role, phone, shopName, businessDescription } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Get image path if uploaded
        let image = '';
        if (req.file) {
            image = req.file.path.replace(/\\/g, '/'); // Normalize path
        }

        const user = await User.create({
            name,
            email,
            passwordHash,
            role: role || 'customer',
            phone,
            image,
            shopName,
            businessDescription,
            isVerified: true // Admin created users are verified by default
        });

        res.status(201).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Update user
 * @route PUT /api/admin/users/:id
 * @access Private/Admin
 */
export const updateUser = async (req: Request, res: Response) => {
    try {
        let user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        // Update fields
        const { name, email, role, phone, shopName, businessDescription } = req.body;

        // Only update password if provided
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.passwordHash = await bcrypt.hash(req.body.password, salt);
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (role) user.role = role;
        if (phone) user.phone = phone;
        if (shopName) user.shopName = shopName;
        if (businessDescription) user.businessDescription = businessDescription;

        // Update image if uploaded
        if (req.file) {
            user.image = req.file.path.replace(/\\/g, '/');
        }

        await user.save();

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Delete user
 * @route DELETE /api/admin/users/:id
 * @access Private/Admin
 */
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        await user.deleteOne();

        res.status(200).json({
            success: true,
            message: 'User removed',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
