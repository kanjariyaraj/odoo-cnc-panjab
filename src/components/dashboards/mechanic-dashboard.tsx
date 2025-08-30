"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Wrench, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  DollarSign,
  CheckCircle,
  Timer,
  AlertCircle,
  Calendar,
  Navigation,
  User
} from "lucide-react";
import { mockMechanicTasks } from "@/lib/mock-data";

export function MechanicDashboard() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-600 bg-red-100 border-red-200";
      case "medium": return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "low": return "text-green-600 bg-green-100 border-green-200";
      default: return "text-gray-600 bg-gray-100 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "assigned": return "text-blue-600 bg-blue-100";
      case "in-progress": return "text-purple-600 bg-purple-100";
      case "completed": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "assigned": return Clock;
      case "in-progress": return Timer;
      case "completed": return CheckCircle;
      default: return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Good morning, <span className="text-green-600">John!</span>
              </h1>
              <p className="text-gray-600">You have 3 active assignments today.</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-green-100 px-4 py-2 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-medium text-sm">Online</span>
              </div>
              <Button className="bg-green-600 hover:bg-green-700">
                <Navigation className="w-4 h-4 mr-2" />
                Go Offline
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          {[
            { label: "Today's Tasks", value: "3", icon: Wrench, color: "text-blue-600" },
            { label: "Completed", value: "8", icon: CheckCircle, color: "text-green-600" },
            { label: "Earnings", value: "$425", icon: DollarSign, color: "text-purple-600" },
            { label: "Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
            { label: "Response Time", value: "8 min", icon: Timer, color: "text-orange-600" },
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
          {/* Active Tasks */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-6 h-6 text-green-600" />
                  <span>Active Tasks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockMechanicTasks.map((task, index) => {
                    const StatusIcon = getStatusIcon(task.status);
                    return (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Wrench className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800">{task.service}</h4>
                              <p className="text-sm text-gray-600">Task #{task.id}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {task.priority.toUpperCase()}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                              <div className="flex items-center space-x-1">
                                <StatusIcon className="w-3 h-3" />
                                <span className="capitalize">{task.status.replace('-', ' ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{task.customer}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Est. {task.estimatedTime}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{task.location}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-gray-600">
                            <DollarSign className="w-4 h-4" />
                            <span className="text-green-600 font-semibold">{task.payment}</span>
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          {task.status === "assigned" && (
                            <>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Accept Task
                              </Button>
                              <Button size="sm" variant="outline">
                                <Navigation className="w-4 h-4 mr-2" />
                                Get Directions
                              </Button>
                            </>
                          )}
                          {task.status === "in-progress" && (
                            <>
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Phone className="w-4 h-4 mr-2" />
                                Call Customer
                              </Button>
                              <Button size="sm" variant="outline">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Complete
                              </Button>
                            </>
                          )}
                          {task.status === "completed" && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">Task Completed</span>
                            </div>
                          )}
                        </div>
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
            {/* Today's Schedule */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar className="w-5 h-5 text-purple-600" />
                  <span>Today's Schedule</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { time: "09:00", task: "Battery Jump Start", location: "Downtown" },
                    { time: "11:30", task: "Tire Replacement", location: "Highway 101" },
                    { time: "14:00", task: "Lockout Assistance", location: "Mall Parking" },
                    { time: "16:30", task: "Available", location: "Standby" },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="text-sm font-mono text-gray-600 w-12">{item.time}</div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">{item.task}</div>
                        <div className="text-xs text-gray-500">{item.location}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Weekly Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Tasks Completed</span>
                    <span className="font-bold text-gray-800">47</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Customer Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-bold text-gray-800">4.9</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-bold text-green-600">8 min avg</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Weekly Earnings</span>
                    <span className="font-bold text-purple-600">$1,240</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Alert */}
            <Card className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="font-bold">Emergency Request</h3>
                </div>
                <p className="text-sm text-red-100 mb-4">
                  High priority request 2.1 km away. Vehicle stranded on highway.
                </p>
                <Button className="w-full bg-white text-red-600 hover:bg-red-50">
                  Accept Emergency
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}