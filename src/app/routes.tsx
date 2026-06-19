import { lazy, Suspense } from "react";
import { createBrowserRouter, useRouteError } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Auto-reload if a lazy chunk fails to load (stale deployment)
const lazyWithRetry = (factory: () => Promise<any>) =>
  lazy(() =>
    factory().catch(() => {
      window.location.reload();
      return new Promise(() => {});
    })
  );

const Landing = lazyWithRetry(() => import("./pages/Landing"));
const Login = lazyWithRetry(() => import("./pages/Login"));
const PhoneVerification = lazyWithRetry(() => import("./pages/PhoneVerification"));
const IdentityVerification = lazyWithRetry(() => import("./pages/IdentityVerification"));
const Dashboard = lazyWithRetry(() => import("./pages/Dashboard"));
const Settings = lazyWithRetry(() => import("./pages/Settings"));
const Admin = lazyWithRetry(() => import("./pages/Admin"));
const Contact = lazyWithRetry(() => import("./pages/Contact"));
const NotFound = lazyWithRetry(() => import("./pages/NotFound"));

const Fallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
  </div>
);

function RouteError() {
  const error: any = useRouteError();
  // Chunk load failure — reload to get fresh assets
  if (error?.message?.includes("MIME") || error?.message?.includes("Failed to fetch dynamically")) {
    window.location.reload();
    return <Fallback />;
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <p className="text-xl font-bold text-gray-900 mb-2">Something went wrong</p>
        <p className="text-gray-500 mb-4">Please refresh the page.</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Refresh
        </button>
      </div>
    </div>
  );
}

const wrap = (element: React.ReactNode) => (
  <Suspense fallback={<Fallback />}>{element}</Suspense>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: wrap(<Landing />),
    errorElement: <RouteError />,
  },
  {
    path: "/login",
    element: wrap(<Login />),
    errorElement: <RouteError />,
  },
  {
    path: "/signup",
    element: wrap(<PhoneVerification />),
    errorElement: <RouteError />,
  },
  {
    path: "/verify-identity",
    element: wrap(
      <ProtectedRoute>
        <IdentityVerification />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/dashboard",
    element: wrap(
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/settings",
    element: wrap(
      <ProtectedRoute>
        <Settings />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/admin",
    element: wrap(
      <AdminRoute>
        <Admin />
      </AdminRoute>
    ),
    errorElement: <RouteError />,
  },
  {
    path: "/contact",
    element: wrap(<Contact />),
    errorElement: <RouteError />,
  },
  {
    path: "*",
    element: wrap(<NotFound />),
    errorElement: <RouteError />,
  },
]);
