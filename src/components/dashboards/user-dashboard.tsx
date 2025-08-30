"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Car, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  CreditCard,
  AlertCircle,
  CheckCircle,
  Timer,
  ArrowRight
} from "lucide-react";
import { mockUserRequests, mockMechanics } from "@/lib/mock-data";

export function UserDashboard() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress": return "text-blue-600 bg-blue-100";
      case "completed": return "text-green-600 bg-green-100";
      case "pending": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress": return Timer;
      case "completed": return CheckCircle;
      case "pending": return Clock;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-blue-600">Alex!</span>
          </h1>
          <p className="text-gray-600">Manage your roadside assistance requests and track service progress.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Active Requests", value: "1", icon: Clock, color: "text-blue-600" },
            { label: "Completed", value: "12", icon: CheckCircle, color: "text-green-600" },
            { label: "Total Spent", value: "$840", icon: CreditCard, color: "text-purple-600" },
            { label: "Avg Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Requests */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Car className="w-6 h-6 text-blue-600" />
                  <span>Service Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserRequests.map((request, index) => {
                    const StatusIcon = getStatusIcon(request.status);
                    return (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Car className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{request.service}</h4>
                              <p className="text-sm text-gray-600">Request #{request.id}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            <div className="flex items-center space-x-1">
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{request.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{request.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>ETA: {request.eta}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <span className="font-medium">Mechanic:</span>
                            <span>{request.mechanic}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <span className="font-medium">Price:</span>
                            <span className="text-green-600 font-semibold">{request.price}</span>
                          </div>
                        </div>

                        {request.status === "in-progress" && (
                          <div className="mt-4 flex space-x-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                              <Phone className="w-4 h-4 mr-2" />
                              Call Mechanic
                            </Button>
                            <Button size="sm" variant="outline">
                              <MapPin className="w-4 h-4 mr-2" />
                              Track Location
                            </Button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6"
          >
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    Emergency Help
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full">
                    <Car className="w-4 h-4 mr-2" />
                    Add Vehicle
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button variant="outline" className="w-full">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Payment Methods
                  </Button>
                </motion.div>
              </CardContent>
            </Card>

            {/* Nearby Mechanics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Nearby Mechanics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMechanics.slice(0, 3).map((mechanic, index) => (
                    <motion.div
                      key={mechanic.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-all duration-300 cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                          {mechanic.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-sm">{mechanic.name}</h4>
                          <div className="flex items-center space-x-1 text-xs text-gray-600">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span>{mechanic.rating}</span>
                            <span>•</span>
                            <span>{mechanic.distance}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Services: {mechanic.services.join(", ")}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Map Placeholder */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Live Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Map integration ready</p>
                    <p className="text-xs text-gray-400">Google Maps API</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}