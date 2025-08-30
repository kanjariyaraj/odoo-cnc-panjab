# RoadGuard - AI-Powered Roadside Assistance Platform

🚗 **RoadGuard** is a modern, responsive, and animated frontend application built with Next.js 15, featuring AI-powered roadside assistance services with real-time tracking and professional mechanic dispatch.

## ✨ Features

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Smooth Animations**: Framer Motion for engaging user interactions
- **Glass Morphism**: Modern design with backdrop blur effects
- **Gradient Backgrounds**: Vibrant color palette with animated gradients
- **Interactive Components**: Hover effects, transitions, and micro-interactions

### 📱 Core Pages
1. **Landing Page**
   - Hero section with animated car illustration
   - Features showcase with hover animations
   - Customer testimonials slider
   - Call-to-action section with emergency contact

2. **User Dashboard**
   - Service request management
   - Real-time tracking interface
   - Payment history
   - Nearby mechanics display

3. **Mechanic Dashboard**
   - Task assignment interface
   - Schedule calendar
   - Performance metrics
   - Emergency alert system

4. **Admin Dashboard**
   - Analytics with Recharts integration
   - Revenue and request tracking
   - System status monitoring
   - Recent requests table

### 🛠 Tech Stack
- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Components**: Shadcn UI
- **Icons**: Lucide React
- **Charts**: Recharts
- **TypeScript**: Full type safety

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd roadguard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
src/
├── app/                    # Next.js 15 App Router
│   ├── admin/             # Admin dashboard page
│   ├── dashboard/         # User dashboard page
│   ├── mechanic/          # Mechanic dashboard page
│   ├── globals.css        # Global styles with Tailwind
│   ├── layout.tsx         # Root layout with header/footer
│   └── page.tsx           # Landing page
├── components/
│   ├── common/            # Reusable components
│   ├── dashboards/        # Dashboard components
│   ├── layout/            # Header and Footer
│   ├── sections/          # Landing page sections
│   └── ui/                # Shadcn UI components
└── lib/
    ├── mock-data.ts       # Sample data for development
    └── utils.ts           # Utility functions
```

## 🎨 Design Features

### Color Palette
- **Primary**: Blue gradients (#3B82F6 to #8B5CF6)
- **Secondary**: Orange/Red accents (#F59E0B to #EF4444)
- **Success**: Green tones (#10B981)
- **Backgrounds**: Gradient overlays with glass morphism

### Animations
- **Page Transitions**: Smooth fade and slide effects
- **Hover Effects**: Scale and glow transformations
- **Loading States**: Skeleton screens and pulse animations
- **Background Elements**: Floating geometric shapes

### Responsive Design
- **Mobile**: Optimized touch interfaces
- **Tablet**: Adaptive grid layouts
- **Desktop**: Full-featured experience
- **Large Screens**: Enhanced visualizations

## 🔧 Available Scripts

```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type checking
npx tsc --noEmit
```

## 📊 Mock Data

The application includes comprehensive mock data for:
- Service requests and history
- Mechanic profiles and availability
- Customer testimonials
- Analytics and metrics
- Payment information

## 🌐 Future Enhancements

### Planned Features
- **Real-time WebSocket integration**
- **Google Maps API integration**
- **Push notifications**
- **Progressive Web App (PWA)**
- **MongoDB database integration**
- **Stripe payment processing**
- **SMS/Email notifications**

### Backend Integration
- **Authentication system**
- **API endpoints for CRUD operations**
- **Real-time location tracking**
- **Payment processing**
- **Admin management system**

## 🎯 Key Components

### Landing Page
- **HeroSection**: Animated hero with car illustration
- **FeaturesSection**: Service highlights with icons
- **TestimonialsSection**: Customer reviews carousel
- **CTASection**: Emergency contact and app download

### Dashboards
- **UserDashboard**: Customer service management
- **MechanicDashboard**: Task and schedule management
- **AdminDashboard**: System analytics and monitoring

### UI Components
- **Header**: Navigation with animated logo
- **Footer**: Comprehensive links and social media
- **Cards**: Glass morphism design with hover effects
- **Buttons**: Gradient backgrounds with animations

## 📱 Mobile Experience

- **Touch-friendly interfaces**
- **Swipe gestures for testimonials**
- **Responsive navigation menu**
- **Optimized form inputs**
- **Fast loading times**

## 🔒 Security Considerations

- **Environment variables for sensitive data**
- **Input validation and sanitization**
- **Secure API endpoint design**
- **Authentication and authorization**
- **HTTPS enforcement**

## 📈 Performance

- **Next.js optimizations**
- **Image optimization with next/image**
- **Lazy loading for components**
- **Code splitting**
- **SEO optimization**

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

**RoadGuard Development Team**
- Frontend Architecture
- UI/UX Design
- Animation Engineering
- Performance Optimization

---

🚗 **RoadGuard** - *Emergency help when you need it most!*
