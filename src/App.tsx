import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import SellerOrders from "@/pages/seller/SellerOrders";
import SellerInventory from "@/pages/seller/SellerInventory";
import SellerInsights from "@/pages/seller/SellerInsights";
import SellerEarnings from "@/pages/seller/SellerEarnings";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import WorkerTasks from "@/pages/worker/WorkerTasks";
import WorkerDelivery from "@/pages/worker/WorkerDelivery";
import WorkerRoute from "@/pages/worker/WorkerRoute";
import WorkerEarnings from "@/pages/worker/WorkerEarnings";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/seller" replace />} />
          <Route path="/seller" element={<DashboardLayout><SellerDashboard /></DashboardLayout>} />
          <Route path="/seller/orders" element={<DashboardLayout><SellerOrders /></DashboardLayout>} />
          <Route path="/seller/inventory" element={<DashboardLayout><SellerInventory /></DashboardLayout>} />
          <Route path="/seller/insights" element={<DashboardLayout><SellerInsights /></DashboardLayout>} />
          <Route path="/seller/earnings" element={<DashboardLayout><SellerEarnings /></DashboardLayout>} />
          <Route path="/worker" element={<DashboardLayout><WorkerDashboard /></DashboardLayout>} />
          <Route path="/worker/tasks" element={<DashboardLayout><WorkerTasks /></DashboardLayout>} />
          <Route path="/worker/delivery" element={<DashboardLayout><WorkerDelivery /></DashboardLayout>} />
          <Route path="/worker/route" element={<DashboardLayout><WorkerRoute /></DashboardLayout>} />
          <Route path="/worker/earnings" element={<DashboardLayout><WorkerEarnings /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
