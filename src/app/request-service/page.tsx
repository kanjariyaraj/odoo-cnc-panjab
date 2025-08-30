"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Car, 
  MapPin, 
  AlertCircle, 
  CheckCircle,
  Battery,
  Wrench,
  Truck,
  Key,
  Cog,
  Disc,
  Zap,
  HelpCircle
} from "lucide-react";

interface FormData {
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
    latitude: number;
    longitude: number;
    address: string;
    landmark: string;
  };
  notes: string;
}

const SERVICE_TYPES = [
  { id: 'battery', name: 'Battery Jump/Replacement', icon: Battery, description: 'Dead battery assistance', price: 45 },
  { id: 'tires', name: 'Tire Change/Repair', icon: Car, description: 'Flat tire assistance', price: 85 },
  { id: 'towing', name: 'Towing Service', icon: Truck, description: 'Vehicle towing', price: 120 },
  { id: 'lockout', name: 'Lockout Service', icon: Key, description: 'Locked out assistance', price: 60 },
  { id: 'engine', name: 'Engine Issues', icon: Cog, description: 'Engine diagnostic & repair', price: 150 },
  { id: 'brakes', name: 'Brake Problems', icon: Disc, description: 'Brake system issues', price: 200 },
  { id: 'electrical', name: 'Electrical Issues', icon: Zap, description: 'Electrical system problems', price: 100 },
  { id: 'other', name: 'Other Services', icon: HelpCircle, description: 'Other roadside assistance', price: 75 }
];

const URGENCY_LEVELS = [
  { id: 'low', name: 'Low', description: 'Can wait 2-4 hours', color: 'bg-green-100 text-green-800' },
  { id: 'medium', name: 'Medium', description: 'Need help within 1-2 hours', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'high', name: 'High', description: 'Need help within 30 minutes', color: 'bg-orange-100 text-orange-800' },
  { id: 'emergency', name: 'Emergency', description: 'Immediate assistance required', color: 'bg-red-100 text-red-800' }
];

export default function RequestServicePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    service: {
      type: '',
      description: '',
      urgency: 'medium'
    },
    vehicle: {
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      licensePlate: ''
    },
    location: {
      latitude: 0,
      longitude: 0,
      address: '',
      landmark: ''
    },
    notes: ''
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser");
      }

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocoding to get address
      const response = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
      );
      const data = await response.json();
      
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          latitude,
          longitude,
          address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        }
      }));
    } catch (error) {
      console.error("Error getting location:", error);
      alert("Unable to get your location. Please enter your address manually.");
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Ensure location has coordinates
      const submitData = {
        ...formData,
        location: {
          ...formData.location,
          // If no coordinates are set (manual address entry), use default coordinates
          latitude: formData.location.latitude || 0,
          longitude: formData.location.longitude || 0
        }
      };

      const response = await fetch('/api/service-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create service request');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error creating service request:', error);
      alert(error instanceof Error ? error.message : 'Failed to create service request');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <CheckCircle className="w-24 h-24 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Request Submitted!</h1>
          <p className="text-gray-600">Your service request has been created successfully. Redirecting to dashboard...</p>
        </motion.div>
      </div>
    );
  }

  const selectedServiceType = SERVICE_TYPES.find(type => type.id === formData.service.type);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {step > 1 ? 'Previous Step' : 'Back to Dashboard'}
          </Button>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Request Roadside Assistance
          </h1>
          <p className="text-gray-600">Get professional help when you need it most.</p>
          
          {/* Progress Bar */}
          <div className="flex items-center mt-6 space-x-4">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 4 && (
                  <div className={`w-12 h-1 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-8">
            {/* Step 1: Service Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">What service do you need?</h2>
                  <p className="text-gray-600">Select the type of assistance you require.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {SERVICE_TYPES.map((service) => (
                    <motion.div
                      key={service.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setFormData(prev => ({ ...prev, service: { ...prev.service, type: service.id } }))}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        formData.service.type === service.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          formData.service.type === service.id ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                        }`}>
                          <service.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">{service.name}</h3>
                          <p className="text-sm text-gray-600">{service.description}</p>
                          <p className="text-sm font-medium text-blue-600">Starting at ${service.price}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {formData.service.type && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe the problem in detail
                      </label>
                      <textarea
                        value={formData.service.description}
                        onChange={(e) => setFormData(prev => ({
                          ...prev,
                          service: { ...prev.service, description: e.target.value }
                        }))}
                        placeholder="Please provide details about your situation..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        rows={4}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Urgency Level
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {URGENCY_LEVELS.map((urgency) => (
                          <div
                            key={urgency.id}
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              service: { ...prev.service, urgency: urgency.id }
                            }))}
                            className={`p-3 rounded-lg border cursor-pointer transition-all ${
                              formData.service.urgency === urgency.id
                                ? 'border-blue-600 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className={`text-xs px-2 py-1 rounded-full inline-block mb-1 ${urgency.color}`}>
                              {urgency.name}
                            </div>
                            <p className="text-sm text-gray-600">{urgency.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep(2)}
                      disabled={!formData.service.description.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Continue to Vehicle Information
                    </Button>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 2: Vehicle Information */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Vehicle Information</h2>
                  <p className="text-gray-600">Tell us about your vehicle so we can send the right equipment.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Make</label>
                    <input
                      type="text"
                      value={formData.vehicle.make}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, make: e.target.value }
                      }))}
                      placeholder="e.g., Toyota"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Model</label>
                    <input
                      type="text"
                      value={formData.vehicle.model}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, model: e.target.value }
                      }))}
                      placeholder="e.g., Camry"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <input
                      type="number"
                      value={formData.vehicle.year}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, year: parseInt(e.target.value) || 2024 }
                      }))}
                      min="1900"
                      max={new Date().getFullYear() + 1}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <input
                      type="text"
                      value={formData.vehicle.color}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, color: e.target.value }
                      }))}
                      placeholder="e.g., Blue"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                    <input
                      type="text"
                      value={formData.vehicle.licensePlate}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        vehicle: { ...prev.vehicle, licensePlate: e.target.value.toUpperCase() }
                      }))}
                      placeholder="e.g., ABC123"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(3)}
                  disabled={!formData.vehicle.make || !formData.vehicle.model || !formData.vehicle.color || !formData.vehicle.licensePlate}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Location
                </Button>
              </motion.div>
            )}

            {/* Step 3: Location */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Location Information</h2>
                  <p className="text-gray-600">Where are you located? This helps us find you quickly.</p>
                </div>

                <div className="space-y-4">
                  <Button
                    onClick={getCurrentLocation}
                    disabled={locationLoading}
                    variant="outline"
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {locationLoading ? 'Getting Location...' : 'Use Current Location'}
                  </Button>

                  <div className="text-center text-gray-500">or</div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <textarea
                      value={formData.location.address}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, address: e.target.value }
                      }))}
                      placeholder="Enter your full address..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                    <input
                      type="text"
                      value={formData.location.landmark}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        location: { ...prev.location, landmark: e.target.value }
                      }))}
                      placeholder="e.g., Near Starbucks, Red building"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(4)}
                  disabled={!formData.location.address.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Continue to Review
                </Button>
              </motion.div>
            )}

            {/* Step 4: Review & Submit */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Review Your Request</h2>
                  <p className="text-gray-600">Please review your information before submitting.</p>
                </div>

                <div className="space-y-6">
                  {/* Service Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Service Details</h3>
                    <div className="flex items-center space-x-3 mb-2">
                      {selectedServiceType && <selectedServiceType.icon className="w-5 h-5 text-blue-600" />}
                      <span className="font-medium">{selectedServiceType?.name}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{formData.service.description}</p>
                    <div className={`inline-block text-xs px-2 py-1 rounded-full ${
                      URGENCY_LEVELS.find(u => u.id === formData.service.urgency)?.color
                    }`}>
                      {URGENCY_LEVELS.find(u => u.id === formData.service.urgency)?.name} Priority
                    </div>
                  </div>

                  {/* Vehicle Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Vehicle Information</h3>
                    <p className="text-gray-700">
                      {formData.vehicle.year} {formData.vehicle.make} {formData.vehicle.model}
                    </p>
                    <p className="text-sm text-gray-600">
                      Color: {formData.vehicle.color} • License: {formData.vehicle.licensePlate}
                    </p>
                  </div>

                  {/* Location Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800 mb-2">Location</h3>
                    <p className="text-gray-700">{formData.location.address}</p>
                    {formData.location.landmark && (
                      <p className="text-sm text-gray-600">Landmark: {formData.location.landmark}</p>
                    )}
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Any additional information that might help our mechanic..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  {/* Estimated Cost */}
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-800 mb-2">Estimated Cost</h3>
                    <div className="flex justify-between text-sm text-blue-700 mb-1">
                      <span>Base Service Fee:</span>
                      <span>${selectedServiceType?.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-blue-700 mb-2">
                      <span>Platform Fee (10%):</span>
                      <span>${Math.round((selectedServiceType?.price || 0) * 0.1)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-blue-800 border-t border-blue-200 pt-2">
                      <span>Total:</span>
                      <span>${(selectedServiceType?.price || 0) + Math.round((selectedServiceType?.price || 0) * 0.1)}</span>
                    </div>
                    <p className="text-xs text-blue-600 mt-2">
                      *Final cost may vary based on actual work required
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-3"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting Request...</span>
                    </div>
                  ) : (
                    'Submit Service Request'
                  )}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}