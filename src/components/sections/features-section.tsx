"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  MapPin, 
  CreditCard, 
  Clock, 
  Shield, 
  Users,
  Zap,
  PhoneCall
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Diagnostics",
      description: "Our advanced AI analyzes your vehicle's symptoms and provides instant preliminary diagnosis before the mechanic arrives.",
      color: "from-blue-500 to-purple-600",
      delay: 0,
    },
    {
      icon: MapPin,
      title: "Real-Time Tracking",
      description: "Track your assigned mechanic's location in real-time with precise ETA updates and live journey monitoring.",
      color: "from-green-500 to-blue-500",
      delay: 0.1,
    },
    {
      icon: CreditCard,
      title: "Transparent Pricing",
      description: "Know the exact cost upfront with no hidden fees. Secure payment processing with multiple payment options.",
      color: "from-orange-500 to-red-500",
      delay: 0.2,
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Emergency assistance available round the clock, 365 days a year. Help is always just a tap away.",
      color: "from-purple-500 to-pink-500",
      delay: 0.3,
    },
    {
      icon: Shield,
      title: "Certified Mechanics",
      description: "All our mechanics are certified professionals with verified credentials and insurance coverage.",
      color: "from-teal-500 to-green-500",
      delay: 0.4,
    },
    {
      icon: Users,
      title: "Multi-Vehicle Support",
      description: "Manage multiple vehicles under one account. Perfect for families and small businesses.",
      color: "from-indigo-500 to-purple-500",
      delay: 0.5,
    },
  ];

  const stats = [
    { icon: Zap, label: "Average Response", value: "12 minutes", color: "text-yellow-500" },
    { icon: Users, label: "Happy Customers", value: "50,000+", color: "text-blue-500" },
    { icon: PhoneCall, label: "Service Requests", value: "1M+ completed", color: "text-green-500" },
    { icon: Shield, label: "Success Rate", value: "99.8%", color: "text-purple-500" },
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center space-x-2 bg-white rounded-full px-4 py-2 mb-6 border border-blue-200 shadow-sm"
          >
            <Zap className="w-4 h-4 text-orange-500" />
            <span className="text-sm font-medium text-gray-700">Why Choose RoadGuard</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Advanced Features
            </span>
            <br />
            for Modern Drivers
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the future of roadside assistance with cutting-edge technology 
            and human expertise combined to keep you moving.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`w-16 h-16 mx-auto mb-4 rounded-full bg-white shadow-lg flex items-center justify-center`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </motion.div>
              <div className="text-2xl md:text-3xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: feature.delay }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg`}
                    >
                      <feature.icon className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {feature.description}
                    </p>

                    {/* Hover Effect Arrow */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="mt-4 flex items-center text-blue-600 font-medium"
                    >
                      <span className="mr-2">Learn more</span>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-xl"
            />
            
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Experience the Future of Roadside Assistance?
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of drivers who trust RoadGuard for their emergency roadside needs.
            </p>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 font-bold px-8 py-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Get Started Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}