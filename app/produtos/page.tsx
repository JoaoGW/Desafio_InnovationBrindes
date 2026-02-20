"use client";

import { useAuthStore } from "@/store/auth.store";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Produtos() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      redirect("/");
    }
  }, [isAuthenticated]);

  return <div></div>;
}
