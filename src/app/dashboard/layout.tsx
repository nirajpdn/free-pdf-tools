import Sidebar from "@/components/sidebar";
import React from "react";

const DashboardLayout = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6 h-screen flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
