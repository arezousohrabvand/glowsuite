import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import ScrollToTop from "../components/common/ScrollToTop";
import PaymentSuccess from "../pages/PaymentSuccess";
import PaymentCancel from "../pages/PaymentCancel";
import AdminBilling from "../pages/admin/AdminBilling";
import EnrollmentPayment from "../pages/EnrollmentPayment";
import BillingHistory from "../pages/BillingHistory";
import AdminRevenue from "../pages/admin/AdminRevenue";
import AdminDashboard from "../pages/admin/AdminDashboard";

// Lazy pages
const Landing = lazy(() => import("../pages/Landing"));
const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Services = lazy(() => import("../pages/Services"));
const ServiceDetails = lazy(() => import("../pages/ServiceDetails"));
const Stylists = lazy(() => import("../pages/Stylists"));
const StylistDetails = lazy(() => import("../pages/StylistDetails"));
const Booking = lazy(() => import("../pages/Booking"));
const MyBookings = lazy(() => import("../pages/MyBookings"));
const Classes = lazy(() => import("../pages/Classes"));
const ClassDetails = lazy(() => import("../pages/ClassDetails"));
const MyClasses = lazy(() => import("../pages/MyClasses"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Settings = lazy(() => import("../pages/Settings"));
const AdminServices = lazy(() => import("../pages/AdminServices"));
const AdminBookings = lazy(() => import("../pages/AdminBookings"));
const AdminClasses = lazy(() => import("../pages/AdminClasses"));
const AdminCustomers = lazy(() => import("../pages/AdminCustomers"));
const Billing = lazy(() => import("../pages/Billing"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminCalendar = lazy(() => import("../pages/admin/AdminCalendar"));

function PageLoader() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-white px-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-rose-200 border-t-rose-500" />
        <p className="mt-4 text-sm font-medium text-zinc-600">
          Loading page...
        </p>
      </div>
    </div>
  );
}

export default function AppRoutes() {
  return (
    <>
      <Navbar />
      <ScrollToTop />

      <div className="pt-24">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetails />} />
            <Route path="/stylists" element={<Stylists />} />
            <Route path="/stylists/:id" element={<StylistDetails />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-cancel" element={<PaymentCancel />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/admin/billing" element={<AdminBilling />} />
            <Route path="/admin/revenue" element={<AdminRevenue />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/billing" element={<BillingHistory />} />
            <Route
              path="/enrollment-payment/:enrollmentId"
              element={<EnrollmentPayment />}
            />
            <Route
              path="/payment-cancel"
              element={<div>Payment cancelled</div>}
            />
            {/* User routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-bookings"
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-classes"
              element={
                <ProtectedRoute>
                  <MyClasses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/billing"
              element={
                <ProtectedRoute>
                  <Billing />
                </ProtectedRoute>
              }
            />
            {/* Admin routes */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/classes"
              element={
                <AdminRoute>
                  <AdminClasses />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/customers"
              element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              }
            />{" "}
            {/* admin */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/bookings"
              element={
                <AdminRoute>
                  <AdminBookings />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/services"
              element={
                <AdminRoute>
                  <AdminServices />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <AdminRoute>
                  <AdminUsers />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/calendar"
              element={
                <AdminRoute>
                  <AdminCalendar />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/billing"
              element={
                <AdminRoute>
                  <AdminBilling />
                </AdminRoute>
              }
            />
            <Route
              path="/admin/revenue"
              element={
                <AdminRoute>
                  <AdminRevenue />
                </AdminRoute>
              }
            />
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Footer />
      </div>
    </>
  );
}
