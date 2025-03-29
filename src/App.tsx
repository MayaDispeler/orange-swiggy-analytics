
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Orders from "./pages/Orders";
import Favorites from "./pages/Favorites";
import AnalyticsOverview from "./pages/analytics/Overview";
import AnalyticsTime from "./pages/analytics/Time";
import AnalyticsGeography from "./pages/analytics/Geography";
import AnalyticsCustomer from "./pages/analytics/Customer";
import AnalyticsDelivery from "./pages/analytics/Delivery";
import AnalyticsRestaurants from "./pages/analytics/Restaurants";
import AnalyticsFinancials from "./pages/analytics/Financials";
import AnalyticsPayments from "./pages/analytics/Payments";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/favorites" element={<Favorites />} />
          
          {/* Analytics Routes */}
          <Route path="/analytics/overview" element={<AnalyticsOverview />} />
          <Route path="/analytics/time" element={<AnalyticsTime />} />
          <Route path="/analytics/geography" element={<AnalyticsGeography />} />
          <Route path="/analytics/customer" element={<AnalyticsCustomer />} />
          <Route path="/analytics/delivery" element={<AnalyticsDelivery />} />
          <Route path="/analytics/restaurants" element={<AnalyticsRestaurants />} />
          <Route path="/analytics/financials" element={<AnalyticsFinancials />} />
          <Route path="/analytics/payments" element={<AnalyticsPayments />} />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
