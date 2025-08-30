// Mock data for different sections of the application

export const mockServices = [
  {
    id: 1,
    title: "Battery Jump Start",
    description: "Quick battery boost service",
    price: "$45",
    icon: "⚡",
    status: "active"
  },
  {
    id: 2,
    title: "Tire Replacement",
    description: "Flat tire assistance",
    price: "$85",
    icon: "🛞",
    status: "active"
  },
  {
    id: 3,
    title: "Towing Service",
    description: "Emergency vehicle towing",
    price: "$120",
    icon: "🚛",
    status: "completed"
  },
  {
    id: 4,
    title: "Lockout Assistance",
    description: "Vehicle unlock service",
    price: "$60",
    icon: "🔑",
    status: "pending"
  }
];

export const mockMechanics = [
  {
    id: 1,
    name: "John Martinez",
    rating: 4.9,
    services: ["Battery", "Tires", "Lockout"],
    distance: "2.3 km",
    eta: "15 min",
    image: "/api/placeholder/100/100"
  },
  {
    id: 2,
    name: "Sarah Chen",
    rating: 4.8,
    services: ["Towing", "Engine", "Battery"],
    distance: "3.1 km",
    eta: "22 min",
    image: "/api/placeholder/100/100"
  },
  {
    id: 3,
    name: "Mike Thompson",
    rating: 4.7,
    services: ["Tires", "Brakes", "Towing"],
    distance: "4.2 km",
    eta: "28 min",
    image: "/api/placeholder/100/100"
  }
];

export const mockTestimonials = [
  {
    id: 1,
    name: "Emily Rodriguez",
    role: "Business Owner",
    content: "RoadGuard saved me when my car broke down at midnight. The mechanic arrived in 15 minutes and got me back on the road quickly!",
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 2,
    name: "David Kim",
    role: "Software Engineer",
    content: "The AI diagnostics feature is incredible. It identified my car's issue before the mechanic even arrived. Highly recommended!",
    rating: 5,
    image: "/api/placeholder/80/80"
  },
  {
    id: 3,
    name: "Jessica Chen",
    role: "Marketing Manager",
    content: "Professional, fast, and reliable. RoadGuard's transparent pricing and real-time tracking made the whole experience stress-free.",
    rating: 5,
    image: "/api/placeholder/80/80"
  }
];

export const mockAnalytics = {
  totalRequests: 1247,
  activeRequests: 23,
  completedToday: 89,
  revenue: 15600,
  avgResponseTime: "12 min",
  customerSatisfaction: 4.8
};

export const mockUserRequests = [
  {
    id: "REQ-001",
    service: "Battery Jump Start",
    mechanic: "John Martinez",
    status: "in-progress",
    location: "Downtown Plaza",
    requestTime: "2 hours ago",
    eta: "5 min",
    price: "$45"
  },
  {
    id: "REQ-002",
    service: "Tire Replacement",
    mechanic: "Sarah Chen",
    status: "completed",
    location: "Highway 101",
    requestTime: "1 day ago",
    eta: "Completed",
    price: "$85"
  },
  {
    id: "REQ-003",
    service: "Towing Service",
    mechanic: "Mike Thompson",
    status: "pending",
    location: "Mall Parking",
    requestTime: "30 min ago",
    eta: "15 min",
    price: "$120"
  }
];

export const mockMechanicTasks = [
  {
    id: "TASK-001",
    customer: "Emily Rodriguez",
    service: "Battery Jump Start",
    location: "123 Oak Street",
    priority: "high",
    status: "assigned",
    estimatedTime: "20 min",
    payment: "$45"
  },
  {
    id: "TASK-002",
    customer: "David Kim",
    service: "Tire Change",
    location: "456 Pine Avenue",
    priority: "medium",
    status: "in-progress",
    estimatedTime: "35 min",
    payment: "$85"
  },
  {
    id: "TASK-003",
    customer: "Jessica Chen",
    service: "Lockout Assistance",
    location: "789 Elm Drive",
    priority: "low",
    status: "completed",
    estimatedTime: "15 min",
    payment: "$60"
  }
];