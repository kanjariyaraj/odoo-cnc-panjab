import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "user" | "mechanic" | "admin";
      phone?: string;
      profile?: {
        avatar?: string;
        address?: string;
        city?: string;
        state?: string;
        zipCode?: string;
      };
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "user" | "mechanic" | "admin";
    phone?: string;
    profile?: {
      avatar?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "user" | "mechanic" | "admin";
    phone?: string;
    profile?: {
      avatar?: string;
      address?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  }
}