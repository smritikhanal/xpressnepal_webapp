"use client";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "../_components/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 via-amber-50 to-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Particles */}
      {Array.from({ length: 8 }, (_, i) => ({
        id: i,
        width: 60 + (i * 13) % 80,
        height: 60 + (i * 17) % 80,
        left: (i * 47) % 100,
        top: (i * 31) % 100,
        yOffset: -30 + (i * 19) % 60,
        xOffset: -30 + (i * 23) % 60,
        duration: 12 + (i * 5) % 8,
      })).map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/5"
          style={{
            width: p.width,
            height: p.height,
            left: `${p.left}%`,
            top: `${p.top}%`,
          }}
          animate={{
            y: [0, p.yOffset],
            x: [0, p.xOffset],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl relative z-10"
      >
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardHeader className="space-y-3 text-center pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mx-auto w-16 h-16 rounded-full bg-linear-to-br from-primary to-orange-600 flex items-center justify-center"
            >
              <ShoppingBag className="h-8 w-8 text-white" />
            </motion.div>
            <CardTitle className="text-3xl font-bold bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
              Create Account
            </CardTitle>
            <CardDescription className="text-base">
              Join XpressNepal and start shopping or selling today
            </CardDescription>
          </CardHeader>
          <CardContent>
           
            {/* Register Form */}
            <RegisterForm />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}