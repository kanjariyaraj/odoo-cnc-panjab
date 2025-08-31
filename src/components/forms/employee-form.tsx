"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  X, 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Wrench, 
  Calendar, 
  Plus,
  Trash2
} from "lucide-react";
import { useApiMutation } from "@/hooks/useApi";
import { toast } from "@/components/ui/toast";

interface Employee {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  profile: {
    specialties: string[];
    yearsExperience: number;
  };
}

interface EmployeeFormProps {
  employee?: Employee | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EmployeeForm({ employee, onClose, onSuccess }: EmployeeFormProps) {
  const isEditing = !!employee;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    specialties: [''],
    yearsExperience: 0
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { mutate, loading } = useApiMutation();

  // Initialize form data when editing
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        email: employee.email,
        phone: employee.phone || '',
        password: '',
        confirmPassword: '',
        specialties: employee.profile.specialties.length > 0 ? employee.profile.specialties : [''],
        yearsExperience: employee.profile.yearsExperience
      });
    }
  }, [employee]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear specific field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    // Clear submit error when user starts making changes
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...formData.specialties];
    newSpecialties[index] = value;
    setFormData(prev => ({ ...prev, specialties: newSpecialties }));
  };

  const addSpecialty = () => {
    setFormData(prev => ({ 
      ...prev, 
      specialties: [...prev.specialties, ''] 
    }));
  };

  const removeSpecialty = (index: number) => {
    if (formData.specialties.length > 1) {
      const newSpecialties = formData.specialties.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, specialties: newSpecialties }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    
    // Password validation only for new employees
    if (!isEditing) {
      if (!formData.password) newErrors.password = 'Password is required';
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    } else if (formData.password) {
      // If editing and password is provided, validate it
      if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    const validSpecialties = formData.specialties.filter(s => s.trim());
    if (validSpecialties.length === 0) {
      newErrors.specialties = 'At least one specialty is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Clear any previous errors
    setErrors({});

    try {
      const requestBody: any = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
        specialties: formData.specialties.filter(s => s.trim()),
        yearsExperience: formData.yearsExperience
      };

      // Include password only if provided (for new employees or when updating password)
      if (!isEditing) {
        // For new employees, password is always required
        if (!formData.password) {
          setErrors({ password: 'Password is required for new employees', submit: 'Please provide a password for the new employee.' });
          return;
        }
        requestBody.password = formData.password;
      } else if (formData.password) {
        // For editing, password is optional
        requestBody.password = formData.password;
      }

      let result;
      if (isEditing) {
        requestBody.employeeId = employee!._id;
        result = await mutate('/api/admin/employees', {
          method: 'PUT',
          body: requestBody
        });
      } else {
        result = await mutate('/api/admin/employees', {
          method: 'POST',
          body: requestBody
        });
      }

      if (result) {
        // Show success toast
        toast.success(
          isEditing ? 'Employee Updated!' : 'Employee Added!',
          isEditing 
            ? `${formData.name}'s information has been updated successfully.`
            : `${formData.name} has been added to your team successfully.`
        );
        
        onSuccess();
        onClose();
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : `Failed to ${isEditing ? 'update' : 'add'} employee`;
      
      // Handle specific error cases
      if (errorMessage.toLowerCase().includes('email already exists')) {
        setErrors({ 
          email: 'This email address is already registered. Please use a different email.',
          submit: 'Please correct the errors above and try again.'
        });
      } else if (errorMessage.toLowerCase().includes('email')) {
        setErrors({ 
          email: 'There was an issue with the email address. Please check and try again.',
          submit: errorMessage
        });
      } else {
        setErrors({ submit: errorMessage });
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md"
      >
        <Card className="bg-white shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{isEditing ? 'Edit Employee' : 'Add New Employee'}</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter full name"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Enter phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password {isEditing ? '(leave blank to keep current)' : '*'}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
                  />
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
              </div>

              {/* Confirm Password - Only show if password is provided */}
              {formData.password && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                    />
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              )}

              {/* Years of Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsExperience}
                    onChange={(e) => handleInputChange('yearsExperience', parseInt(e.target.value) || 0)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Specialties */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialties *
                </label>
                <div className="space-y-2">
                  {formData.specialties.map((specialty, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <Wrench className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          value={specialty}
                          onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="e.g., Engine repair, Brake systems"
                        />
                      </div>
                      {formData.specialties.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSpecialty(index)}
                          className="text-red-600 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addSpecialty}
                    className="text-purple-600 border-purple-300 hover:bg-purple-50"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Specialty
                  </Button>
                </div>
                {errors.specialties && <p className="text-red-500 text-xs mt-1">{errors.specialties}</p>}
              </div>

              {/* Submit Button */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    isEditing ? 'Update Employee' : 'Add Employee'
                  )}
                </Button>
              </div>

              {errors.submit && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4"
                >
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <X className="w-2 h-2 text-white" />
                    </div>
                    <p className="text-red-600 text-sm font-medium">Error</p>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{errors.submit}</p>
                </motion.div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}