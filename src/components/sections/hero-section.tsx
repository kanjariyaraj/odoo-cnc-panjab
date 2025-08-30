"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Car, Zap, Shield, Clock } from "lucide-react";

export function HeroSection() {
  const floatingIcons = [
    { icon: Car, delay: 0, x: 20, y: 30 },
    { icon: Zap, delay: 1, x: -30, y: -20 },
    { icon: Shield, delay: 2, x: 40, y: -40 },
    { icon: Clock, delay: 0.5, x: -20, y: 50 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-orange-400/20 to-red-400/20 rounded-full blur-3xl"
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-blue-200"
            >
              <Zap className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">
                AI-Powered Roadside Assistance
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6"
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-600 bg-clip-text text-transparent">
                Emergency Help
              </span>
              <br />
              <span className="text-gray-800">
                When You Need It Most
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-xl text-gray-600 mb-8 max-w-2xl"
            >
              Get instant roadside assistance with our AI-powered platform. 
              Professional mechanics arrive in minutes, not hours. Track everything in real-time.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-full shadow-lg text-lg group">
                  Get Help Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 font-semibold px-8 py-3 rounded-full text-lg group">
                  <Play className="mr-2 w-5 h-5" />
                  How It Works
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-3 gap-6 mt-12"
            >
              {[
                { label: "Response Time", value: "< 15 min", color: "text-blue-600" },
                { label: "Success Rate", value: "99.8%", color: "text-green-600" },
                { label: "Mechanics", value: "5000+", color: "text-purple-600" },
              ].map((stat, index) => (
                <div key={stat.label} className="text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    className={`text-2xl md:text-3xl font-bold ${stat.color} mb-1`}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Animated Car Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            {/* Main Car Illustration */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <div className="w-full max-w-lg mx-auto">
                {/* Car Body */}
                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="w-80 h-40 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl shadow-2xl relative overflow-hidden"
                  >
                    {/* Car Windows */}
                    <div className="absolute top-4 left-8 right-8 h-16 bg-blue-200/30 rounded-2xl backdrop-blur-sm" />
                    
                    {/* Car Details */}
                    <div className="absolute bottom-4 left-6 w-4 h-4 bg-yellow-400 rounded-full animate-pulse" />
                    <div className="absolute bottom-4 right-6 w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                    
                    {/* Shine Effect */}
                    <motion.div
                      animate={{ x: [-100, 400] }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut",
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                    />
                  </motion.div>
                  
                  {/* Wheels */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -bottom-6 left-8 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-300"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute -bottom-6 right-8 w-12 h-12 bg-gray-800 rounded-full border-4 border-gray-300"
                  />
                </div>
              </div>
            </motion.div>

            {/* Floating Icons */}
            {floatingIcons.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -20, 0],
                  x: [0, item.x, 0],
                }}
                transition={{
                  duration: 0.6,
                  delay: item.delay,
                  y: {
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item.delay,
                  },
                  x: {
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: item.delay,
                  },
                }}
                className={`absolute w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center`}
                style={{
                  top: `${item.y}%`,
                  left: `${50 + item.x}%`,
                }}
              >
                <item.icon className="w-8 h-8 text-blue-600" />
              </motion.div>
            ))}

            {/* Background Glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-orange-400/20 rounded-full blur-3xl -z-10"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}