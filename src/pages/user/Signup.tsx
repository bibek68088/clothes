import React, { useState } from "react";
import { Button, Modal, notification } from "antd";
import { TextInput, PasswordInput, Checkbox, Stack } from "@mantine/core";
import { useForm } from "@mantine/form";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Mail, Lock, User, ShoppingBag } from "lucide-react";

interface SignupFormValues {
  email: string;
  password: string;
  username: string;
  agreeTerms: boolean;
}

// Mock API (replace with real API)
const mockSignup = async (
  email: string,
  username: string,
  password: string
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email && username && password) {
        resolve({ success: true, user: { email, username } });
      } else {
        reject(new Error("All fields are required"));
      }
    }, 1000);
  });
};

export const SignupPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<SignupFormValues>({
    initialValues: {
      email: "",
      password: "",
      username: "",
      agreeTerms: false,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length >= 6 ? null : "Password must be at least 6 characters",
      username: (value) =>
        value.length >= 3 ? null : "Username must be at least 3 characters",
      agreeTerms: (value) => (value ? null : "You must agree to the terms"),
    },
  });

  const handleSubmit = async (values: SignupFormValues) => {
    setLoading(true);
    try {
      const result = await mockSignup(
        values.email,
        values.username,
        values.password
      );
      notification.success({
        message: "Welcome to our Store!",
        description: "Your account has been created successfully.",
        placement: "topRight",
      });
      console.log("Signup result:", result);
    } catch (error: any) {
      notification.error({
        message: "Signup Failed",
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
        backgroundImage: `url('https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop')`,
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
          Create Account
        </motion.h1>
        <motion.p 
          className="text-gray-300 text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Join us for exclusive access to the latest fashion
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
                label="Username"
                placeholder="Choose a username"
                required
                leftSection={<User className="w-5 h-5 text-gray-400" />}
                classNames={{
                  label: "text-white mb-2 font-medium",
                  input: "bg-white/10 text-white placeholder-gray-400 border-white/20 pl-12 h-12 rounded-xl focus:border-white/40 transition-all duration-300 hover:bg-white/20",
                  section: "absolute left-3 top-[38px] transition-transform duration-200",
                }}
                {...form.getInputProps("username")}
              />
            </motion.div>
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
                placeholder="Create a password"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Checkbox
                label={
                  <span className="text-gray-300">
                    I agree to the{" "}
                    <span
                      className="text-white cursor-pointer hover:underline"
                      onClick={() => setIsModalOpen(true)}
                    >
                      Terms & Conditions
                    </span>
                  </span>
                }
                required
                classNames={{
                  input: "border-white/20 checked:bg-white checked:border-white",
                }}
                {...form.getInputProps("agreeTerms", { type: "checkbox" })}
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
                Create Account
              </Button>
            </motion.div>
          </Stack>
        </form>

        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-gray-400">Already have an account? </span>
          <Link
            to="/login"
            className="text-white hover:text-gray-200 font-semibold transition-colors hover:underline"
          >
            Sign In
          </Link>
        </motion.div>
      </motion.div>

      <Modal
        title="Terms & Conditions"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button 
            key="close" 
            onClick={() => setIsModalOpen(false)}
            className="bg-white text-black hover:bg-gray-100"
          >
            Close
          </Button>,
        ]}
        className="backdrop-blur-md"
        styles={{
          header: {
            background: '#000',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            padding: '16px 24px',
          },
          content: {
            background: '#000',
          },
          body: {
            padding: '24px',
            color: '#fff',
          },
          mask: {
            backdropFilter: 'blur(8px)',
            background: 'rgba(0,0,0,0.6)',
          },
        }}
      >
        <div className="text-gray-300">
          <h3 className="text-white font-semibold mb-4">Welcome to Our Fashion Store</h3>
          <p className="mb-4">
            By creating an account, you agree to our terms of service and privacy policy. We are committed to protecting your personal information and providing you with the best shopping experience.
          </p>
          <p className="mb-4">
            As a member, you'll get exclusive access to:
            <ul className="list-disc pl-6 mt-2">
              <li>Early access to sales</li>
              <li>Special member-only discounts</li>
              <li>New arrival notifications</li>
              <li>Personalized style recommendations</li>
            </ul>
          </p>
        </div>
      </Modal>
    </div>
  );
};