"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  Clock, 
  MapPin, 
  Phone, 
  Star, 
  DollarSign,
  CheckCircle,
  Timer,
  AlertCircle,
  Plus,
  Settings,
  UserPlus,
  Shield,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  User
} from "lucide-react";
import { useApi, useApiMutation } from "@/hooks/useApi";
import { EmployeeForm } from "@/components/forms/employee-form";
import { toast } from "@/components/ui/toast";

interface ServiceRequest {
  _id: string;
  requestId: string;
  userId: {
    name: string;
    email: string;
    phone?: string;
  };
  adminId?: {
    name: string;
    shopName: string;
  };
  mechanicId?: {
    name: string;
    email: string;
    profile: {
      specialties: string[];
    };
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

interface Employee {
  _id: string;
  name: string;
  email: string;
  profile: {
    specialties: string[];
    rating: number;
    completedJobs: number;
    yearsExperience: number;
  };
}

export function DynamicAdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState('requests');
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState<string | null>(null);
  
  const { data: requestsData, loading: requestsLoading, error: requestsError, refetch: refetchRequests } = useApi<{ 
    requests: ServiceRequest[], 
    employees: Employee[] 
  }>('/api/admin/service-requests');
  
  const { data: employeesData, loading: employeesLoading, refetch: refetchEmployees } = useApi<{ 
    employees: Employee[], 
    totalEmployees: number 
  }>('/api/admin/employees');
  
  const { mutate } = useApiMutation();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
    if (session?.user?.role !== "admin") {
      router.push("/dashboard");
    }
  }, [status, session, router]);

  // Close employee menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setEmployeeMenuOpen(null);
    if (employeeMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [employeeMenuOpen]);

  // Debug logging - MOVED BEFORE EARLY RETURNS
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      console.log('Admin Dashboard Debug:', {
        adminId: session.user.id,
        requestsDataLoaded: !!requestsData,
        employeesDataLoaded: !!employeesData,
        requestsCount: requestsData?.requests?.length || 0,
        employeesFromRequests: requestsData?.employees?.length || 0,
        allEmployeesCount: employeesData?.employees?.length || 0,
        employeesLoading,
        requestsLoading,
        requestsError,
        employeesError: employeesData === null ? 'Failed to load' : null
      });
    }
  }, [requestsData, employeesData, session, employeesLoading, requestsLoading, requestsError]);

  // Show loading if either API call is still loading
  if (status === "loading" || requestsLoading || employeesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated" || session?.user?.role !== "admin") return null;

  const requests = requestsData?.requests || [];
  const employees = requestsData?.employees || [];
  const allEmployees = employeesData?.employees || [];
  
  const pendingRequests = requests.filter(r => r.status === 'pending');
  const claimedRequests = requests.filter(r => r.status === 'admin-review');
  const assignedRequests = requests.filter(r => r.status === 'assigned');
  const completedRequests = requests.filter(r => r.status === 'completed');
  const totalRevenue = completedRequests.reduce((sum, r) => sum + r.pricing.total, 0);

  const handleClaimRequest = async (requestId: string) => {
    try {
      const result = await mutate('/api/admin/service-requests', {
        method: 'POST',
        body: { requestId, action: 'claim' }
      });
      if (result) {
        toast.success(
          'Request Claimed',
          'Service request has been claimed and moved to your review queue.'
        );
        refetchRequests();
      }
    } catch (error) {
      toast.error(
        'Failed to Claim Request',
        error instanceof Error ? error.message : 'Unable to claim the service request. Please try again.'
      );
    }
  };

  const handleAssignToEmployee = async (requestId: string, mechanicId: string) => {
    const employee = allEmployees.find(emp => emp._id === mechanicId);
    const employeeName = employee?.name || 'employee';
    
    try {
      const result = await mutate('/api/admin/service-requests', {
        method: 'PUT',
        body: { requestId, mechanicId }
      });
      if (result) {
        toast.success(
          'Request Assigned',
          `Service request has been assigned to ${employeeName}.`
        );
        refetchRequests();
      }
    } catch (error) {
      toast.error(
        'Assignment Failed',
        error instanceof Error ? error.message : 'Failed to assign the request. Please try again.'
      );
    }
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowEmployeeForm(true);
  };

  const handleDeleteEmployee = async (employeeId: string) => {
    const employee = allEmployees.find(emp => emp._id === employeeId);
    const employeeName = employee?.name || 'Employee';
    
    if (!confirm(`Are you sure you want to deactivate ${employeeName}? They will no longer be able to access the system.`)) {
      return;
    }

    try {
      await mutate(`/api/admin/employees?employeeId=${employeeId}`, {
        method: 'DELETE'
      });
      
      // Show success toast
      toast.success(
        'Employee Deactivated',
        `${employeeName} has been deactivated and can no longer access the system.`
      );
      
      refetchEmployees();
    } catch (error) {
      // Show error toast
      toast.error(
        'Deactivation Failed',
        error instanceof Error ? error.message : 'Failed to deactivate employee. Please try again.'
      );
    }
  };

  const handleUpdateEmployee = async (employeeId: string, updateData: Partial<Employee>) => {
    try {
      await mutate('/api/admin/employees', {
        method: 'PUT',
        body: { employeeId, ...updateData }
      });
      refetchEmployees();
      alert('Employee updated successfully');
    } catch (error) {
      alert(`Failed to update employee: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDebugEmployees = async () => {
    try {
      const response = await fetch('/api/debug/employees', {
        credentials: 'include'
      });
      const debugData = await response.json();
      console.log('Debug Employee Data:', debugData);
      alert(`Debug data logged to console. Found ${debugData.employees?.length || 0} employees.`);
    } catch (error) {
      console.error('Debug error:', error);
      alert('Debug failed - check console');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "text-yellow-600 bg-yellow-100";
      case "admin-review": return "text-blue-600 bg-blue-100";
      case "assigned": return "text-purple-600 bg-purple-100";
      case "in-progress": return "text-orange-600 bg-orange-100";
      case "completed": return "text-green-600 bg-green-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock;
      case "admin-review": return Eye;
      case "assigned": return Users;
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-6">
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
                Shop Owner Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back, <span className="font-semibold text-purple-600">{session?.user?.name}</span>! 
                Manage your service requests and employees.
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center space-x-2 bg-purple-100 px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 font-medium text-sm">Shop Owner</span>
              </div>
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
            { label: "Pending Requests", value: pendingRequests.length.toString(), icon: Clock, color: "text-yellow-600" },
            { label: "Under Review", value: claimedRequests.length.toString(), icon: Eye, color: "text-blue-600" },
            { label: "Assigned", value: assignedRequests.length.toString(), icon: Users, color: "text-purple-600" },
            { label: "Employees", value: allEmployees.length.toString(), icon: UserPlus, color: "text-green-600" },
            { label: "Revenue", value: `$${totalRevenue}`, icon: DollarSign, color: "text-indigo-600" },
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

        {/* Employee Status Banner */}
        {session?.user?.role === 'admin' && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
          >
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-4">
                <span className="text-blue-700">
                  📄 <strong>Data Status:</strong>
                </span>
                <span className="text-gray-600">
                  Requests: {requestsLoading ? 'Loading...' : `${requests.length} loaded`}
                </span>
                <span className="text-gray-600">
                  Employees: {employeesLoading ? 'Loading...' : `${allEmployees.length} loaded`}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={() => {
                    refetchRequests();
                    refetchEmployees();
                  }}
                  variant="outline"
                  size="sm"
                >
                  🔄 Refresh
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/50 p-1 rounded-lg w-fit">
            {[
              { id: 'requests', label: 'Service Requests', icon: Clock },
              { id: 'employees', label: 'Manage Employees', icon: Users }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  selectedTab === tab.id 
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'text-gray-600 hover:bg-white/70'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Service Requests Tab */}
        {selectedTab === 'requests' && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-6 h-6 text-purple-600" />
                <span>Service Requests</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {requestsError ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600">Failed to load requests</p>
                </div>
              ) : requests.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
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
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-lg">
                              🔧
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-800 capitalize">
                                {request.service.type.replace('-', ' ')} Service
                              </h4>
                              <p className="text-sm text-gray-600">#{request.requestId}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                            <div className="flex items-center space-x-1">
                              <StatusIcon className="w-3 h-3" />
                              <span className="capitalize">{request.status.replace('-', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 text-sm mb-4">
                          <div className="flex items-center space-x-2 text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{request.userId?.name || 'Unknown User'}</span>
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
                          <p><strong>Vehicle:</strong> {request.vehicle.year} {request.vehicle.make} {request.vehicle.model}</p>
                          {request.mechanicId && (
                            <p><strong>Assigned to:</strong> {request.mechanicId.name}</p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {request.status === "pending" && (
                            <Button 
                              size="sm" 
                              onClick={() => handleClaimRequest(request._id)}
                              className="bg-purple-600 hover:bg-purple-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Claim Request
                            </Button>
                          )}
                          
                          {request.status === "admin-review" && employees.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <select 
                                className="px-3 py-1 border border-gray-300 rounded text-sm"
                                onChange={(e) => {
                                  if (e.target.value) {
                                    handleAssignToEmployee(request._id, e.target.value);
                                  }
                                }}
                                defaultValue=""
                              >
                                <option value="">Assign to employee...</option>
                                {employees.map((employee) => (
                                  <option key={employee._id} value={employee._id}>
                                    {employee.name} ({employee.profile.specialties.join(', ')})
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          
                          {(request.status === "assigned" || request.status === "in-progress" || request.status === "completed") && (
                            <div className="flex items-center space-x-2 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span className="text-sm font-medium">
                                {request.status === "completed" ? "Completed" : `Assigned to ${request.mechanicId?.name}`}
                              </span>
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
        )}

        {/* Employees Tab */}
        {selectedTab === 'employees' && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-6 h-6 text-purple-600" />
                  <span>Manage Employees</span>
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button 
                    onClick={handleDebugEmployees}
                    variant="outline"
                    size="sm"
                  >
                    🐛 Debug
                  </Button>
                  <Button 
                    onClick={() => setShowEmployeeForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Employee
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {employeesLoading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading employees...</p>
                </div>
              ) : employeesData === null ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                  <p className="text-red-600 mb-4">Failed to load employees</p>
                  <Button 
                    onClick={() => refetchEmployees()}
                    variant="outline"
                    size="sm"
                  >
                    Try Again
                  </Button>
                </div>
              ) : allEmployees.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No employees added yet</p>
                  <p className="text-sm text-gray-500 mb-4">Add mechanics to your team to handle service requests</p>
                  <Button 
                    onClick={() => setShowEmployeeForm(true)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Your First Employee
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {allEmployees.map((employee) => (
                    <motion.div
                      key={employee._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all bg-white"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {employee.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{employee.name}</h4>
                            <p className="text-sm text-gray-600">{employee.email}</p>
                          </div>
                        </div>
                        
                        {/* Employee Actions Menu */}
                        <div className="relative">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => setEmployeeMenuOpen(employeeMenuOpen === employee._id ? null : employee._id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                          
                          {employeeMenuOpen === employee._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute right-0 top-8 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                            >
                              <div className="py-1">
                                <button
                                  onClick={() => {
                                    handleEditEmployee(employee);
                                    setEmployeeMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center space-x-2"
                                >
                                  <Edit className="w-4 h-4" />
                                  <span>Edit Employee</span>
                                </button>
                                <button
                                  onClick={() => {
                                    handleDeleteEmployee(employee._id);
                                    setEmployeeMenuOpen(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  <span>Deactivate</span>
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Experience:</span>
                          <span className="font-medium">{employee.profile.yearsExperience} years</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Completed Jobs:</span>
                          <span className="font-medium">{employee.profile.completedJobs}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Rating:</span>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            <span className="font-medium">{employee.profile.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        {employee.profile.specialties.length > 0 && (
                          <div>
                            <span className="text-gray-600">Specialties:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {employee.profile.specialties.map((specialty, index) => (
                                <span 
                                  key={index}
                                  className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Employee Performance Badge */}
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Performance</span>
                          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                            employee.profile.rating >= 4.5 ? 'bg-green-100 text-green-700' :
                            employee.profile.rating >= 4.0 ? 'bg-blue-100 text-blue-700' :
                            employee.profile.rating >= 3.5 ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {employee.profile.rating >= 4.5 ? 'Excellent' :
                             employee.profile.rating >= 4.0 ? 'Good' :
                             employee.profile.rating >= 3.5 ? 'Average' : 'Needs Improvement'}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Employee Form Modal */}
        {showEmployeeForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={() => {
              setShowEmployeeForm(false);
              setEditingEmployee(null);
            }}
            onSuccess={() => {
              refetchEmployees();
              refetchRequests();
              setEditingEmployee(null);
            }}
          />
        )}
      </div>
    </div>
  );
}