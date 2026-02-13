"use client";

import useTool from "@/hooks/useTool";

const Dashboard = () => {
  const { ActiveComponent } = useTool();

  return <ActiveComponent />;
};

export default Dashboard;
