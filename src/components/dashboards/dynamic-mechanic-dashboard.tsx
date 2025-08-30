"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  User,
  Play,
  Pause
} from "lucide-react";
import { useApi, useApiMutation } from "@/hooks/useApi";

interface ServiceRequest {
  _id: string;
  requestId: string;
  userId: {
    name: string;
    email: string;
    phone?: string;
  };
  service: {
    type: string;
    description: string;
    urgency: string;
  };
  vehicle: {
    make: string;
    model: string;
    year: number;
    color: string;
    licensePlate: string;
  };
  location: {
    address: string;
    landmark?: string;
  };
  status: string;
  timeline: {
    requested: string;
    assigned?: string;
    started?: string;
    completed?: string;
  };
  pricing: {
    total: number;
  };
}

export function DynamicMechanicDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isOnline, setIsOnline] = useState(true);
  
  const { data, loading, error, refetch } = useApi<{ requests: ServiceRequest[] }>('/api/service-requests');
  const { mutate } = useApiMutation();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user?.role !== "mechanic") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "mechanic") return null;

  const requests = data?.requests || [];
  const assignedRequests = requests.filter(r => r.status === 'assigned');
  const inProgressRequests = requests.filter(r => r.status === 'in-progress');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalEarnings = completedRequests.reduce((sum, r) => sum + r.pricing.total, 0);

  const handleAcceptTask = async (requestId: string) => {
    try {
      const result = await mutate(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        body: { action: 'accept' }
      });
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error('Error accepting task:', error);
      alert(`Failed to accept task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleStartTask = async (requestId: string) => {
    try {
      const result = await mutate(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        body: { action: 'start' }
      });
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error('Error starting task:', error);
      alert(`Failed to start task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCompleteTask = async (requestId: string) => {
    try {
      const result = await mutate(`/api/service-requests/${requestId}`, {
        method: 'PATCH',
        body: { action: 'complete' }
      });
      if (result) {
        refetch();
      }
    } catch (error) {
      console.error('Error completing task:', error);
      alert(`Failed to complete task: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case "battery": return "⚡";
      case "tires": return "🛞";
      case "towing": return "🚛";
      case "lockout": return "🔑";
      case "engine": return "⚙️";
      case "brakes": return "🛑";
      case "electrical": return "🔌";
      default: return "🔧";
    }
  };

  const getPriorityColor = (urgency: string) => {
    switch (urgency) {
      case "emergency": return "text-red-600 bg-red-100 border-red-200";
      case "high": return "text-orange-600 bg-orange-100 border-orange-200";
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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Welcome back, <span className="text-green-600">{session?.user?.name?.split(' ')[0]}!</span>
              </h1>
              <p className="text-gray-600">
                {assignedRequests.length + inProgressRequests.length > 0 
                  ? `You have ${assignedRequests.length + inProgressRequests.length} active assignments.`
                  : "No active assignments at the moment."
                }
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                isOnline ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <div className={`w-3 h-3 rounded-full ${
                  isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`}></div>
                <span className={`font-medium text-sm ${
                  isOnline ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
              <Button 
                onClick={() => setIsOnline(!isOnline)}
                variant={isOnline ? "default" : "outline"}
                className={isOnline ? "bg-green-600 hover:bg-green-700" : "border-green-600 text-green-600 hover:bg-green-50"}
              >
                {isOnline ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8"
        >
          {[
            { label: "Assigned Tasks", value: assignedRequests.length.toString(), icon: Clock, color: "text-blue-600" },
            { label: "In Progress", value: inProgressRequests.length.toString(), icon: Timer, color: "text-purple-600" },
            { label: "Completed Today", value: completedRequests.length.toString(), icon: CheckCircle, color: "text-green-600" },
            { label: "Total Earnings", value: `$${totalEarnings}`, icon: DollarSign, color: "text-yellow-600" },
            { label: "Active Status", value: isOnline ? "Online" : "Offline", icon: Navigation, color: isOnline ? "text-green-600" : "text-gray-600" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all">
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
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Wrench className="w-6 h-6 text-green-600" />
                  <span>Service Requests</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load requests</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No service requests available</p>
                    <p className="text-sm text-gray-500">New requests will appear here when customers need assistance</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.slice(0, 10).map((request, index) => {
                      const StatusIcon = getStatusIcon(request.status);
                      return (
                        <motion.div
                          key={request._id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
                                {getServiceIcon(request.service.type)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 capitalize">
                                  {request.service.type.replace('-', ' ')} Service
                                </h4>
                                <p className="text-sm text-gray-600">#{request.requestId}</p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(request.service.urgency)}`}>
                                {request.service.urgency.toUpperCase()}
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                                <div className="flex items-center space-x-1">
                                  <StatusIcon className="w-3 h-3" />
                                  <span className="capitalize">{request.status.replace('-', ' ')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                            <div className="flex items-center space-x-2 text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{request.userId.name}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(request.timeline.requested)}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <MapPin className="w-4 h-4" />
                              <span className="truncate">{request.location.address}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <DollarSign className="w-4 h-4" />
                              <span className="text-green-600 font-semibold">${request.pricing.total}</span>
                            </div>
                          </div>

                          <div className="text-sm text-gray-600 mb-4">
                            <p><strong>Issue:</strong> {request.service.description}</p>
                            <p><strong>Vehicle:</strong> {request.vehicle.year} {request.vehicle.make} {request.vehicle.model} ({request.vehicle.color})</p>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleAcceptTask(request._id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Accept Task
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Get Directions
                                </Button>
                              </>
                            )}
                            {request.status === "assigned" && (
                              <>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleStartTask(request._id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Start Task
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Navigation className="w-4 h-4 mr-2" />
                                  Get Directions
                                </Button>
                              </>
                            )}
                            {request.status === "in-progress" && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Phone className="w-4 h-4 mr-2" />
                                  Call Customer
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={() => handleCompleteTask(request._id)}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Mark Complete
                                </Button>
                              </>
                            )}
                            {request.status === "completed" && (
                              <div className="flex items-center space-x-2 text-green-600">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">Completed</span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Today's Performance */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Today's Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Completed Tasks</span>
                    <span className="font-bold text-gray-800">{completedRequests.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Tasks</span>
                    <span className="font-bold text-blue-600">{inProgressRequests.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Pending Tasks</span>
                    <span className="font-bold text-orange-600">{assignedRequests.length}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Today's Earnings</span>
                    <span className="font-bold text-green-600">${totalEarnings}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Controls */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Availability Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className={`p-4 rounded-lg border-2 ${
                    isOnline ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">Current Status</span>
                      <div className={`flex items-center space-x-2`}>
                        <div className={`w-3 h-3 rounded-full ${
                          isOnline ? 'bg-green-500' : 'bg-gray-400'
                        }`}></div>
                        <span className={`text-sm font-medium ${
                          isOnline ? 'text-green-700' : 'text-gray-600'
                        }`}>
                          {isOnline ? 'Online & Available' : 'Offline'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      onClick={() => setIsOnline(!isOnline)}
                      className={`w-full ${
                        isOnline 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isOnline ? 'Go Offline' : 'Go Online'}
                    </Button>
                  </div>
                  
                  {isOnline && (
                    <p className="text-xs text-gray-500">
                      While online, you'll receive new service requests in your area.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}