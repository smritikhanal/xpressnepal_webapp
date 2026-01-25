import z from "zod";

export const UserSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["customer", "seller", "superadmin"]).default("customer"),
    phone: z.string().optional(),
    shopName: z.string().min(3).optional(),
    businessDescription: z.string().max(500).optional(),
    isVerified: z.boolean().optional(),
    authProvider: z.enum(["local", "google", "github"]).default("local"),
    isSellerActive: z.boolean().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});

export type UserType = z.infer<typeof UserSchema>;