import { Request, Response } from 'express';
import z from "zod";
import { UserSchema } from '../types/user.type.js';
// re-use UserSchema from types
export const CreateUserDTO = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["customer", "seller", "superadmin"]).default("customer"),
    phone: z.string().optional(),
    shopName: z.string().min(3).optional(),
    businessDescription: z.string().max(500).optional(),
})
export type CreateUserDTO = z.infer<typeof CreateUserDTO>;

export const LoginUserDTO = z.object({
    email: z.email(),
    password: z.string().min(6)
});
export type LoginUserDTO = z.infer<typeof LoginUserDTO>;