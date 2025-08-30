"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { 
  Users, 
  DollarSign, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity,
  Filter,
  Download,
  Settings
} from "lucide-react";
import { mockAnalytics } from "@/lib/mock-data";

export function AdminDashboard() {
  const revenueData = [
    { month: 'Jan', revenue: 12000, requests: 450 },
    { month: 'Feb', revenue: 15000, requests: 520 },
    { month: 'Mar', revenue: 18000, requests: 630 },
    { month: 'Apr', revenue: 16000, requests: 580 },
    { month: 'May', revenue: 22000, requests: 720 },
    { month: 'Jun', revenue: 25000, requests: 850 },
  ];

  const requestTypeData = [
    { name: 'Battery Jump', value: 35, color: '#3B82F6' },
    { name: 'Tire Change', value: 25, color: '#10B981' },
    { name: 'Towing', value: 20, color: '#F59E0B' },
    { name: 'Lockout', value: 15, color: '#EF4444' },
    { name: 'Other', value: 5, color: '#8B5CF6' },
  ];

  const recentRequests = [
    { id: "REQ-1247", customer: "John Doe", service: "Battery Jump", status: "completed", time: "2 min ago" },
    { id: "REQ-1246", customer: "Jane Smith", service: "Tire Change", status: "in-progress", time: "5 min ago" },
    { id: "REQ-1245", customer: "Mike Johnson", service: "Towing", status: "assigned", time: "8 min ago" },
    { id: "REQ-1244", customer: "Sarah Wilson", service: "Lockout", status: "completed", time: "12 min ago" },
    { id: "REQ-1243", customer: "David Brown", service: "Battery Jump", status: "pending", time: "15 min ago" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600 bg-green-100";
      case "in-progress": return "text-blue-600 bg-blue-100";
      case "assigned": return "text-purple-600 bg-purple-100";
      case "pending": return "text-orange-600 bg-orange-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
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
                Admin <span className="text-purple-600">Dashboard</span>
              </h1>
              <p className="text-gray-600">Monitor system performance and analytics</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Button variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              label: "Total Requests", 
              value: mockAnalytics.totalRequests.toLocaleString(), 
              icon: Activity, 
              color: "text-blue-600",
              change: "+12.5%"
            },
            { 
              label: "Active Now", 
              value: mockAnalytics.activeRequests, 
              icon: Clock, 
              color: "text-orange-600",
              change: "+5.2%"
            },
            { 
              label: "Revenue", 
              value: `$${mockAnalytics.revenue.toLocaleString()}`, 
              icon: DollarSign, 
              color: "text-green-600",
              change: "+18.3%"
            },
            { 
              label: "Success Rate", 
              value: `${mockAnalytics.customerSatisfaction}/5.0`, 
              icon: CheckCircle, 
              color: "text-purple-600",
              change: "+0.2"
            },
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
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-sm font-medium text-green-600 bg-green-100 px-2 py-1 rounded-full">
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Revenue Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                  <span>Revenue & Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis yAxisId="left" stroke="#666" />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" />
                    <Tooltip />
                    <Bar yAxisId="left" dataKey="revenue" fill="url(#revenueGradient)" radius={[4, 4, 0, 0]} />
                    <Bar yAxisId="right" dataKey="requests" fill="url(#requestGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#1E40AF" />
                      </linearGradient>
                      <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#047857" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Service Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={requestTypeData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {requestTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Recent Requests Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Activity className="w-6 h-6 text-purple-600" />
                <span>Recent Service Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Request ID</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Customer</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Time</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentRequests.map((request, index) => (
                      <motion.tr
                        key={request.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-3 px-4 font-mono text-sm text-blue-600">{request.id}</td>
                        <td className="py-3 px-4">{request.customer}</td>
                        <td className="py-3 px-4">{request.service}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{request.time}</td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" className="mr-2">
                            View
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* System Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6 mt-8"
        >
          <Card className="bg-gradient-to-r from-green-500 to-blue-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">System Status</h3>
                  <p className="text-green-100">All systems operational</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">Active Mechanics</h3>
                  <p className="text-purple-100">147 online now</p>
                </div>
                <Users className="w-12 h-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-2">Avg Response</h3>
                  <p className="text-orange-100">{mockAnalytics.avgResponseTime}</p>
                </div>
                <Clock className="w-12 h-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}