"use client";

import * as React from "react";
import RentalHistory from "@/components/RentalHistory";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <RentalHistory />
    </div>
  );
}
