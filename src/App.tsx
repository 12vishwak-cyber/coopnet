import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import DashboardLayout from "@/components/DashboardLayout";
import Login from "@/pages/Login";
import SellerDashboard from "@/pages/seller/SellerDashboard";
import SellerOrders from "@/pages/seller/SellerOrders";
import SellerInventory from "@/pages/seller/SellerInventory";
import SellerInsights from "@/pages/seller/SellerInsights";
import SellerEarnings from "@/pages/seller/SellerEarnings";
import SellerSupport from "@/pages/seller/SellerSupport";
import SellerAddProduct from "@/pages/seller/SellerAddProduct";
import WorkerSupport from "@/pages/worker/WorkerSupport";
import WorkerDashboard from "@/pages/worker/WorkerDashboard";
import WorkerTasks from "@/pages/worker/WorkerTasks";
import WorkerDelivery from "@/pages/worker/WorkerDelivery";
import WorkerRoute from "@/pages/worker/WorkerRoute";
import WorkerEarnings from "@/pages/worker/WorkerEarnings";
import NetworkOverview from "@/pages/network/NetworkOverview";
import NetworkRules from "@/pages/network/NetworkRules";
import NetworkFund from "@/pages/network/NetworkFund";
import NetworkLedger from "@/pages/network/NetworkLedger";
import NetworkVoting from "@/pages/network/NetworkVoting";
import NetworkActivity from "@/pages/network/NetworkActivity";
import NetworkMembers from "@/pages/network/NetworkMembers";
import NetworkRulebook from "@/pages/network/NetworkRulebook";
import NetworkComplaints from "@/pages/network/NetworkComplaints";
import Onboarding from "@/pages/Onboarding";
import About from "@/pages/About";
import Profile from "@/pages/Profile";
import SettingsPage from "@/pages/SettingsPage";
import Help from "@/pages/Help";
import CustomerLayout from "@/components/CustomerLayout";
import { CartProvider } from "@/contexts/CartContext";
import { OrdersProvider } from "@/contexts/OrdersContext";
import { MembershipProvider } from "@/contexts/MembershipContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import SellerBulkUpload from "@/pages/seller/SellerBulkUpload";
import { FlyToCartProvider } from "@/contexts/FlyToCartContext";
import SplashScreen from "@/components/SplashScreen";
import CustomerMembership from "@/pages/customer/CustomerMembership";
import CustomerWelcome from "@/pages/customer/CustomerWelcome";
import CustomerHome from "@/pages/customer/CustomerHome";
import CustomerExplore from "@/pages/customer/CustomerExplore";
import CustomerSellerProfile from "@/pages/customer/CustomerSellerProfile";
import CustomerCart from "@/pages/customer/CustomerCart";
import CustomerProductDetail from "@/pages/customer/CustomerProductDetail";
import CustomerOrders from "@/pages/customer/CustomerOrders";
import CustomerOrderTracking from "@/pages/customer/CustomerOrderTracking";
import CustomerPostOrder from "@/pages/customer/CustomerPostOrder";
import CustomerNetwork from "@/pages/customer/CustomerNetwork";
import CustomerProfile from "@/pages/customer/CustomerProfile";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <SplashScreen />
      <BrowserRouter>
        <CartProvider>
        <OrdersProvider>
        <MembershipProvider>
        <FlyToCartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/seller" element={<DashboardLayout><SellerDashboard /></DashboardLayout>} />
          <Route path="/seller/orders" element={<DashboardLayout><SellerOrders /></DashboardLayout>} />
          <Route path="/seller/inventory" element={<DashboardLayout><SellerInventory /></DashboardLayout>} />
          <Route path="/seller/insights" element={<DashboardLayout><SellerInsights /></DashboardLayout>} />
          <Route path="/seller/earnings" element={<DashboardLayout><SellerEarnings /></DashboardLayout>} />
          <Route path="/seller/support" element={<DashboardLayout><SellerSupport /></DashboardLayout>} />
          <Route path="/seller/inventory/new" element={<DashboardLayout><SellerAddProduct /></DashboardLayout>} />
          <Route path="/seller/inventory/bulk" element={<DashboardLayout><SellerBulkUpload /></DashboardLayout>} />
          <Route path="/worker" element={<DashboardLayout><WorkerDashboard /></DashboardLayout>} />
          <Route path="/worker/support" element={<DashboardLayout><WorkerSupport /></DashboardLayout>} />
          <Route path="/worker/tasks" element={<DashboardLayout><WorkerTasks /></DashboardLayout>} />
          <Route path="/worker/delivery" element={<DashboardLayout><WorkerDelivery /></DashboardLayout>} />
          <Route path="/worker/route" element={<DashboardLayout><WorkerRoute /></DashboardLayout>} />
          <Route path="/worker/earnings" element={<DashboardLayout><WorkerEarnings /></DashboardLayout>} />
          <Route path="/network" element={<DashboardLayout><NetworkOverview /></DashboardLayout>} />
          <Route path="/network/rules" element={<DashboardLayout><NetworkRules /></DashboardLayout>} />
          <Route path="/network/fund" element={<DashboardLayout><NetworkFund /></DashboardLayout>} />
          <Route path="/network/ledger" element={<DashboardLayout><NetworkLedger /></DashboardLayout>} />
          <Route path="/network/voting" element={<DashboardLayout><NetworkVoting /></DashboardLayout>} />
          <Route path="/network/activity" element={<DashboardLayout><NetworkActivity /></DashboardLayout>} />
          <Route path="/network/members" element={<DashboardLayout><NetworkMembers /></DashboardLayout>} />
          <Route path="/network/rulebook" element={<DashboardLayout><NetworkRulebook /></DashboardLayout>} />
          <Route path="/network/complaints" element={<DashboardLayout><NetworkComplaints /></DashboardLayout>} />
          <Route path="/about" element={<DashboardLayout><About /></DashboardLayout>} />
          <Route path="/profile" element={<DashboardLayout><Profile /></DashboardLayout>} />
          <Route path="/settings" element={<DashboardLayout><SettingsPage /></DashboardLayout>} />
          <Route path="/help" element={<DashboardLayout><Help /></DashboardLayout>} />
          <Route path="/customer" element={<CustomerLayout><CustomerHome /></CustomerLayout>} />
          <Route path="/customer/explore" element={<CustomerLayout><CustomerExplore /></CustomerLayout>} />
          <Route path="/customer/seller/:id" element={<CustomerLayout><CustomerSellerProfile /></CustomerLayout>} />
          <Route path="/customer/cart" element={<CustomerLayout><CustomerCart /></CustomerLayout>} />
          <Route path="/customer/product/:id" element={<CustomerLayout><CustomerProductDetail /></CustomerLayout>} />
          <Route path="/customer/orders" element={<CustomerLayout><CustomerOrders /></CustomerLayout>} />
          <Route path="/customer/order/track" element={<CustomerLayout><CustomerOrderTracking /></CustomerLayout>} />
          <Route path="/customer/order/track/:id" element={<CustomerLayout><CustomerOrderTracking /></CustomerLayout>} />
          <Route path="/customer/order/impact" element={<CustomerLayout><CustomerPostOrder /></CustomerLayout>} />
          <Route path="/customer/order/impact/:id" element={<CustomerLayout><CustomerPostOrder /></CustomerLayout>} />
          <Route path="/customer/network" element={<CustomerLayout><CustomerNetwork /></CustomerLayout>} />
          <Route path="/customer/profile" element={<CustomerLayout><CustomerProfile /></CustomerLayout>} />
          <Route path="/customer/membership" element={<CustomerMembership />} />
          <Route path="/customer/welcome" element={<CustomerWelcome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </FlyToCartProvider>
        </MembershipProvider>
        </OrdersProvider>
        </CartProvider>
      </BrowserRouter>
    </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
