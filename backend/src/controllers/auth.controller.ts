import { Request, Response } from 'express';
import User, { IUser } from '../models/User.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';
import { CreateUserDTO, LoginUserDTO } from '../dtos/user.dtos.js';
import mongoose from 'mongoose';

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = CreateUserDTO.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid input',
        errors: parsed.error.issues,
      });
    }

    const { name, email, password, role, phone, shopName, businessDescription } = parsed.data;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const passwordHash = await hashPassword(password);

    // Create user data object
    const userData: any = {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'customer',
      authProvider: 'local',
      isVerified: false,
    };

    if (phone) userData.phone = phone;
    if (role === 'seller') {
      if (shopName) userData.shopName = shopName;
      if (businessDescription) userData.businessDescription = businessDescription;
      userData.isSellerActive = true;
    }

    // Create user - handle the return type properly
    const createdUser = await User.create(userData);

    // Check if createdUser is an array (shouldn't be, but TypeScript thinks it might be)
    let user;
    if (Array.isArray(createdUser)) {
      // If somehow it's an array, take the first element
      user = createdUser[0] as IUser & { _id: mongoose.Types.ObjectId };
    } else {
      // Normal case - single document
      user = createdUser as IUser & { _id: mongoose.Types.ObjectId };
    }

    const token = generateToken(user._id.toString(), user.role);

    const userResponse: any = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };

    if (user.role === 'seller') {
      userResponse.shopName = user.shopName;
      userResponse.businessDescription = user.businessDescription;
      userResponse.isSellerActive = user.isSellerActive;
    }

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = LoginUserDTO.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message || 'Invalid input',
        errors: parsed.error.issues,
      });
    }

    const { email, password } = parsed.data;

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+passwordHash'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    if (user.authProvider !== 'local') {
      return res.status(400).json({
        success: false,
        message: `Please login using ${user.authProvider}`,
      });
      
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(user._id.toString(), user.role);

    const userResponse: any = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };
    if (user.role === 'seller') {
      userResponse.shopName = user.shopName;
      userResponse.businessDescription = user.businessDescription;
      userResponse.isSellerActive = user.isSellerActive;
    }
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: userResponse,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

export const getMe = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userResponse: any = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      createdAt: user.createdAt,
    };

    if (user.role === 'seller') {
      userResponse.shopName = user.shopName;
      userResponse.businessDescription = user.businessDescription;
      userResponse.isSellerActive = user.isSellerActive;
    }

    return res.status(200).json({
      success: true,
      data: userResponse,
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, phone, shopName, businessDescription } = req.body;

    const user = await User.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Email already in use',
        });
      }
      user.email = email.toLowerCase();
    }

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;

    if (user.role === 'seller') {
      if (shopName) user.shopName = shopName;
      if (businessDescription !== undefined)
        user.businessDescription = businessDescription;
    }

    if (req.file) {
      // Normalize path separator to forward slash for URL compatibility
      const imagePath = `uploads/${req.file.filename}`;
      user.image = imagePath;
      console.log('User image updated:', imagePath);
    }

    await user.save();

    const userResponse: any = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isVerified: user.isVerified,
      authProvider: user.authProvider,
      image: user.image,
      createdAt: user.createdAt,
    };

    if (user.role === 'seller') {
      userResponse.shopName = user.shopName;
      userResponse.businessDescription = user.businessDescription;
      userResponse.isSellerActive = user.isSellerActive;
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: userResponse,
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during profile update',
    });
  }
};