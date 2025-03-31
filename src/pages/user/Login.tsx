import React, { useState } from "react";
import { Button, notification } from "antd";
import { TextInput, PasswordInput, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, ShoppingBag } from "lucide-react";

interface LoginFormValues {
  email: string;
  password: string;
}

// Mock API (replace with real API)
const mockLogin = async (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "test@example.com" && password === "password123") {
        resolve({ success: true, token: "fake-token" });
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 1000);
  });
};

export const LoginPage: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
    },
  });

  const handleSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    try {
      const result = await mockLogin(values.email, values.password);
      notification.success({
        message: "Welcome back!",
        description: "Get ready to explore our latest collections.",
        placement: "topRight",
      });
      console.log("Login result:", result);
    } catch (error: any) {
      notification.error({
        message: "Login Failed",
        description: error.message,
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const inputVariants = {
    focus: { scale: 1.02, transition: { duration: 0.2 } },
    blur: { scale: 1, transition: { duration: 0.2 } },
  };

  return (
    <div 
      className="min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 flex items-center justify-center p-4"
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-black/40 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-white/10"
      >
        <motion.div 
          className="flex justify-center mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white/10 p-4 rounded-full border border-white/20 shadow-lg">
            <ShoppingBag className="w-12 h-12 text-white" />
          </div>
        </motion.div>

        <motion.h1 
          className="text-3xl font-bold text-white text-center mb-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Welcome Back
        </motion.h1>
        <motion.p 
          className="text-gray-300 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Sign in to your account to continue shopping
        </motion.p>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Stack gap={20}>
            <motion.div 
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
            >
              <TextInput
                label="Email"
                placeholder="Enter your email"
                required
                leftSection={<Mail className="w-5 h-5 text-gray-400" />}
                classNames={{
                  label: "text-white mb-2 font-medium",
                  input: "bg-white/10 text-white placeholder-gray-400 border-white/20 pl-12 h-12 rounded-xl focus:border-white/40 transition-all duration-300 hover:bg-white/20",
                  section: "absolute left-3 top-[38px] transition-transform duration-200",
                }}
                {...form.getInputProps("email")}
              />
            </motion.div>
            <motion.div 
              className="relative"
              variants={inputVariants}
              whileFocus="focus"
              whileTap="focus"
            >
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                required
                leftSection={<Lock className="w-5 h-5 text-gray-400" />}
                classNames={{
                  label: "text-white mb-2 font-medium",
                  input: "bg-white/10 text-white placeholder-gray-400 border-white/20 pl-12 h-12 rounded-xl focus:border-white/40 transition-all duration-300 hover:bg-white/20",
                  section: "absolute left-3 top-[38px] transition-transform duration-200",
                  visibilityToggle: "text-gray-400 hover:text-white transition-colors",
                  innerInput: "bg-transparent !pl-0",
                }}
                {...form.getInputProps("password")}
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="w-full h-12 bg-gradient-to-r from-neutral-100 to-white border-none text-black font-semibold rounded-xl hover:from-white hover:to-neutral-200 transition-all duration-300 mt-4 shadow-lg hover:shadow-xl"
              >
                Sign In
              </Button>
            </motion.div>
          </Stack>
        </form>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <span className="text-gray-400">New to our store? </span>
          <Link
            to="/signup"
            className="text-white hover:text-gray-200 font-semibold transition-colors hover:underline"
          >
            Create Account
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
};