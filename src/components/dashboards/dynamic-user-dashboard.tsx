"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Plus
} from "lucide-react";
import { useApi } from "@/hooks/useApi";

interface ServiceRequest {
  _id: string;
  requestId: string;
  service: {
    type: string;
    description: string;
  };
  status: string;
  location: {
    address: string;
  };
  timeline: {
    requested: string;
  };
  pricing: {
    total: number;
  };
  mechanicId?: {
    name: string;
  };
}

export function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const { data, loading, error } = useApi<{ requests: ServiceRequest[] }>('/api/service-requests');

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  const requests = data?.requests || [];
  const activeRequests = requests.filter(r => ['pending', 'assigned', 'in-progress'].includes(r.status));
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalSpent = completedRequests.reduce((sum, r) => sum + r.pricing.total, 0);

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

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than 1 hour ago';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Welcome back, <span className="text-blue-600">{session?.user?.name?.split(' ')[0]}!</span>
          </h1>
          <p className="text-gray-600">Manage your roadside assistance requests and track service progress.</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          {[
            { label: "Active Requests", value: activeRequests.length.toString(), icon: Clock, color: "text-blue-600" },
            { label: "Completed", value: completedRequests.length.toString(), icon: CheckCircle, color: "text-green-600" },
            { label: "Total Spent", value: `$${totalSpent}`, icon: CreditCard, color: "text-purple-600" },
            { label: "Avg Rating", value: "4.9", icon: Star, color: "text-yellow-600" },
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
          {/* Service Requests */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Car className="w-6 h-6 text-blue-600" />
                    <span>Service Requests</span>
                  </CardTitle>
                  <Button 
                    onClick={() => router.push('/request-service')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Request
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {error ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Failed to load requests</p>
                  </div>
                ) : requests.length === 0 ? (
                  <div className="text-center py-8">
                    <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No service requests yet</p>
                    <Button 
                      onClick={() => router.push('/request-service')}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Request
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.slice(0, 5).map((request, index) => {
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
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Car className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800 capitalize">
                                  {request.service.type.replace('-', ' ')} Service
                                </h4>
                                <p className="text-sm text-gray-600">Request #{request.requestId}</p>
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
                              <span>{request.location.address}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{formatTimeAgo(request.timeline.requested)}</span>
                            </div>
                            {request.mechanicId && (
                              <div className="flex items-center space-x-2 text-gray-600">
                                <span className="font-medium">Mechanic:</span>
                                <span>{request.mechanicId.name}</span>
                              </div>
                            )}
                            <div className="flex items-center space-x-2 text-gray-600">
                              <span className="font-medium">Cost:</span>
                              <span className="text-green-600 font-semibold">${request.pricing.total}</span>
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
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Emergency Help
                </Button>
                <Button variant="outline" className="w-full">
                  <Car className="w-4 h-4 mr-2" />
                  Request Service
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment Methods
                </Button>
              </CardContent>
            </Card>

            {/* Account Summary */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Account Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Requests</span>
                    <span className="font-medium text-gray-800">{requests.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Spent</span>
                    <span className="font-medium text-green-600">${totalSpent}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Your Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="font-medium text-gray-800">4.9</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}