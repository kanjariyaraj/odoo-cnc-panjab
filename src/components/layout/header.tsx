"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  Menu, 
  X, 
  Wrench, 
  Shield, 
  Zap, 
  LogOut, 
  User, 
  Settings,
  Home,
  LayoutDashboard,
  Users,
  FileText,
  Phone,
  ChevronDown,
  Bell,
  Search
} from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [pathname]);

  const publicNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "#services", label: "Services", icon: Wrench },
    { href: "#about", label: "About", icon: Shield },
    { href: "#contact", label: "Contact", icon: Phone },
  ];

  const authenticatedNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/request-service", label: "Request Service", icon: Car },
  ];

  const adminNavItems = [
    { href: "/admin", label: "Admin Panel", icon: Settings },
    { href: "/admin/employees", label: "Employees", icon: Users },
  ];

  const mechanicNavItems = [
    { href: "/mechanic", label: "Mechanic Dashboard", icon: Wrench },
  ];

  const getNavItems = () => {
    if (!session) return publicNavItems;
    
    let items = [...authenticatedNavItems];
    
    if (session.user?.role === "admin") {
      items = [...items, ...adminNavItems];
    } else if (session.user?.role === "mechanic") {
      items = [...items, ...mechanicNavItems];
    }
    
    return items;
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-lg' 
          : 'bg-white/90 backdrop-blur-lg border-b border-blue-100'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Image 
                src="/logooo.png" 
                alt="RoadGuard Logo" 
                width={40} 
                height={40}
                className="rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
              />
            </motion.div>
            <div className="hidden sm:block">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                RoadGuard
              </span>
              <div className="text-xs text-gray-500 font-medium">AI-Powered</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {getNavItems().map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <motion.div key={item.href} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 group ${
                      active 
                        ? 'text-blue-600 bg-blue-50 shadow-sm' 
                        : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-colors ${
                      active ? 'text-blue-600' : 'text-gray-500 group-hover:text-blue-600'
                    }`} />
                    <span>{item.label}</span>
                    {active && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-blue-50 rounded-lg -z-10"
                        initial={false}
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {status === "loading" ? (
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            ) : session ? (
              <div className="flex items-center space-x-3">
                {/* Notifications */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                    3
                  </span>
                </motion.button>

                {/* User Profile Dropdown */}
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                      <span className="text-white text-sm font-medium">
                        {session.user?.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <div className="text-sm font-medium text-gray-800">{session.user?.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{session.user?.role}</div>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${
                      isProfileMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </motion.button>

                  {/* Profile Dropdown Menu */}
                  <AnimatePresence>
                    {isProfileMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="text-sm font-medium text-gray-800">{session.user?.name}</div>
                          <div className="text-xs text-gray-500">{session.user?.email}</div>
                          <div className="text-xs text-blue-600 capitalize font-medium">{session.user?.role}</div>
                        </div>
                        
                        <Link
                          href="/dashboard"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <LayoutDashboard className="w-4 h-4" />
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link
                          href="/profile"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4" />
                          <span>Profile</span>
                        </Link>
                        
                        <Link
                          href="/settings"
                          className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          onClick={() => setIsProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          <span>Settings</span>
                        </Link>
                        
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              handleSignOut();
                              setIsProfileMenuOpen(false);
                            }}
                            className="flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/signin">
                  <Button 
                    variant="outline" 
                    className="border-blue-300 text-blue-600 hover:bg-blue-50 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/auth/signup">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-full shadow-lg hover:shadow-xl transition-all">
                      Get Started
                    </Button>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="w-6 h-6 text-gray-700" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="w-6 h-6 text-gray-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200 bg-white/95 backdrop-blur-xl"
            >
              <div className="py-4 space-y-2">
                {/* Navigation Items */}
                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <motion.div
                      key={item.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link
                        href={item.href}
                        className={`flex items-center space-x-3 px-4 py-3 rounded-lg mx-4 font-medium transition-all ${
                          active 
                            ? 'text-blue-600 bg-blue-50 shadow-sm' 
                            : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Icon className={`w-5 h-5 ${
                          active ? 'text-blue-600' : 'text-gray-500'
                        }`} />
                        <span>{item.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
                
                {/* Auth Section for Mobile */}
                {session ? (
                  <div className="pt-4 mt-4 border-t border-gray-200 mx-4">
                    {/* User Info */}
                    <div className="flex items-center space-x-3 px-4 py-3 bg-gray-50 rounded-lg mb-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-white text-sm font-medium">
                          {session.user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{session.user?.name}</div>
                        <div className="text-xs text-gray-500 capitalize">{session.user?.role}</div>
                      </div>
                    </div>
                    
                    {/* Profile Actions */}
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        <span>Profile</span>
                      </Link>
                      
                      <Link
                        href="/settings"
                        className="flex items-center space-x-3 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Settings</span>
                      </Link>
                      
                      <button
                        onClick={() => {
                          handleSignOut();
                          setIsMenuOpen(false);
                        }}
                        className="flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 mt-4 border-t border-gray-200 mx-4 space-y-3">
                    <Link href="/auth/signin" onClick={() => setIsMenuOpen(true)}>
                      <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-medium">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" onClick={() => setIsMenuOpen(true)}>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-2 rounded-full shadow-lg">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}