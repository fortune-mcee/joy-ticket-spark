import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import Events from "./pages/Events.tsx";
import MyTickets from "./pages/MyTickets.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/Dashboard.tsx";
import AdminEvents from "./pages/admin/AdminEvents.tsx";
import AdminEventDetail from "./pages/admin/AdminEventDetail.tsx";
import AdminHalls from "./pages/admin/AdminHalls.tsx";
import AdminHallDetail from "./pages/admin/AdminHallDetail.tsx";
import AdminEventSeats from "./pages/admin/AdminEventSeats.tsx";
import AdminCategories from "./pages/admin/AdminCategories.tsx";
import AdminBookings from "./pages/admin/AdminBookings.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/events" element={<Events />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="events/:id" element={<AdminEventDetail />} />
            <Route path="events/:id/seats" element={<AdminEventSeats />} />
            <Route path="halls" element={<AdminHalls />} />
            <Route path="halls/:hall" element={<AdminHallDetail />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="bookings" element={<AdminBookings />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
