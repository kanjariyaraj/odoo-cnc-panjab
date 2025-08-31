"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserDashboard } from "@/components/dashboards/dynamic-user-dashboard";
import { DynamicMechanicDashboard } from "@/components/dashboards/dynamic-mechanic-dashboard";
import { DynamicAdminDashboard } from "@/components/dashboards/dynamic-admin-dashboard";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") return null;

  // Role-based dashboard routing
  switch (session?.user?.role) {
    case "mechanic":
      return <DynamicMechanicDashboard />;
    case "admin":
      return <DynamicAdminDashboard />;
    case "user":
    default:
      return <UserDashboard />;
  }
}