import { Request, Response } from 'express';
import Message from '../models/Message.js';
import { ApiError, sendResponse } from '../utils/apiHelpers.js';

/**
 * Send a message to a seller
 */
export const sendMessage = async (req: Request, res: Response) => {
  try {
    const { receiverId, productId, subject, message } = req.body;
    const senderId = req.user.id;

    if (!receiverId || !subject || !message) {
      throw new ApiError('Receiver, subject, and message are required', 400);
    }

    const newMessage = await Message.create({
      senderId,
      receiverId,
      productId,
      subject,
      message,
    });

    const populatedMessage = await Message.findById(newMessage._id)
      .populate('senderId', 'name email shopName')
      .populate('receiverId', 'name email shopName')
      .populate('productId', 'title slug');

    sendResponse(res, 201, populatedMessage, 'Message sent successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Get inbox messages (messages received by the logged-in user)
 */
export const getInbox = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { isRead } = req.query;

    const query: any = { receiverId: userId };
    if (isRead !== undefined) {
      query.isRead = isRead === 'true';
    }

    const messages = await Message.find(query)
      .populate('senderId', 'name email shopName')
      .populate('productId', 'title slug')
      .sort({ createdAt: -1 });

    const unreadCount = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    sendResponse(res, 200, { messages, unreadCount }, 'Inbox retrieved successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Get sent messages (messages sent by the logged-in user)
 */
export const getSentMessages = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const messages = await Message.find({ senderId: userId })
      .populate('receiverId', 'name email shopName')
      .populate('productId', 'title slug')
      .sort({ createdAt: -1 });

    sendResponse(res, 200, messages, 'Sent messages retrieved successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Mark message as read
 */
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({ _id: id, receiverId: userId });

    if (!message) {
      throw new ApiError('Message not found', 404);
    }

    message.isRead = true;
    await message.save();

    sendResponse(res, 200, message, 'Message marked as read');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Delete a message
 */
export const deleteMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const message = await Message.findOne({
      _id: id,
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    if (!message) {
      throw new ApiError('Message not found', 404);
    }

    await message.deleteOne();

    sendResponse(res, 200, null, 'Message deleted successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};

/**
 * Get unread message count
 */
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;

    const count = await Message.countDocuments({
      receiverId: userId,
      isRead: false,
    });

    sendResponse(res, 200, { count }, 'Unread count retrieved successfully');
  } catch (error: any) {
    throw new ApiError(error.message, 500);
  }
};
