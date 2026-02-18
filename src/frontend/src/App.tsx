import { StrictMode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import DiagnosticsPage from './pages/DiagnosticsPage';
import PublicNotFound from './pages/PublicNotFound';
import AdminRoutes from './admin/AdminRoutes';
import AdminDashboard from './admin/pages/AdminDashboard';
import SiteSettingsEditor from './admin/pages/SiteSettingsEditor';
import SectionsEditor from './admin/pages/SectionsEditor';
import ProductsEditor from './admin/pages/ProductsEditor';
import GalleryEditor from './admin/pages/GalleryEditor';
import ContactInfoEditor from './admin/pages/ContactInfoEditor';
import MessagesInbox from './admin/pages/MessagesInbox';
import ChangePasswordPage from './admin/pages/ChangePasswordPage';
import AdminAccountsPage from './admin/pages/AdminAccountsPage';
import AdminNotFound from './admin/pages/AdminNotFound';
import HeaderNav from './components/HeaderNav';
import PublicAppErrorBoundary from './components/PublicAppErrorBoundary';
import StartupHealthGate from './components/StartupHealthGate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Layout component for public routes
function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

// Root route
const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// Public layout route
const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: () => (
    <PublicAppErrorBoundary>
      <PublicLayout />
    </PublicAppErrorBoundary>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/about',
  component: AboutPage,
});

const productsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/products',
  component: ProductsPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/gallery',
  component: GalleryPage,
});

const contactRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/contact',
  component: ContactPage,
});

const diagnosticsRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/diagnostics',
  component: DiagnosticsPage,
});

// Catch-all for unknown public routes
const notFoundRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '*',
  component: PublicNotFound,
});

// Admin parent route - wraps all admin routes with authentication
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRoutes,
});

// Admin child routes - nested under /admin
const adminDashboardRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/',
  component: AdminDashboard,
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/settings',
  component: SiteSettingsEditor,
});

const adminSectionsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/sections',
  component: SectionsEditor,
});

const adminProductsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/products',
  component: ProductsEditor,
});

const adminGalleryRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/gallery',
  component: GalleryEditor,
});

const adminContactRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/contact',
  component: ContactInfoEditor,
});

const adminMessagesRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/messages',
  component: MessagesInbox,
});

const adminPasswordRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/password',
  component: ChangePasswordPage,
});

const adminAccountsRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '/admins',
  component: AdminAccountsPage,
});

// Admin catch-all for unknown admin routes
const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '*',
  component: AdminNotFound,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    indexRoute,
    aboutRoute,
    productsRoute,
    galleryRoute,
    contactRoute,
    diagnosticsRoute,
    notFoundRoute,
  ]),
  adminRoute.addChildren([
    adminDashboardRoute,
    adminSettingsRoute,
    adminSectionsRoute,
    adminProductsRoute,
    adminGalleryRoute,
    adminContactRoute,
    adminMessagesRoute,
    adminPasswordRoute,
    adminAccountsRoute,
    adminNotFoundRoute,
  ]),
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <StartupHealthGate>
          <RouterProvider router={router} />
        </StartupHealthGate>
      </QueryClientProvider>
    </StrictMode>
  );
}
