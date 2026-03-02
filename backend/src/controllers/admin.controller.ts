import { Request, Response } from 'express';
import User, { IUser } from '../models/User.js';
import StoreSettings from '../models/StoreSettings.js';
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
        const search = (req.query.search as string | undefined)?.trim();
        const role = req.query.role as string | undefined;
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }

        if (role && ['customer', 'seller', 'superadmin'].includes(role)) {
            query.role = role;
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-passwordHash')
            .sort({ createdAt: -1 })
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

/**
 * Get store settings
 * @route GET /api/admin/store-settings
 * @access Private/SuperAdmin
 */
export const getStoreSettings = async (_req: Request, res: Response) => {
    try {
        let settings = await StoreSettings.findOne();

        if (!settings) {
            settings = await StoreSettings.create({});
        }

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch store settings',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};

/**
 * Update store settings
 * @route PUT /api/admin/store-settings
 * @access Private/SuperAdmin
 */
export const updateStoreSettings = async (req: Request, res: Response) => {
    try {
        const { storeName, storeEmail, storePhone, currency, timezone } = req.body;

        const updatePayload = {
            storeName: storeName?.trim(),
            storeEmail: storeEmail?.trim()?.toLowerCase(),
            storePhone: storePhone?.trim(),
            currency,
            timezone: timezone?.trim(),
        };

        const settings = await StoreSettings.findOneAndUpdate(
            {},
            { $set: updatePayload },
            {
                new: true,
                upsert: true,
                runValidators: true,
                setDefaultsOnInsert: true,
            }
        );

        res.status(200).json({
            success: true,
            message: 'Store settings updated successfully',
            data: settings,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update store settings',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }
};
