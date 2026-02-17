import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import PublicLayout from './layout/PublicLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import GalleryPage from './pages/GalleryPage';
import ContactPage from './pages/ContactPage';
import AdminRoutes from './admin/AdminRoutes';
import AdminDashboard from './admin/pages/AdminDashboard';
import SiteSettingsEditor from './admin/pages/SiteSettingsEditor';
import SectionsEditor from './admin/pages/SectionsEditor';
import ProductsEditor from './admin/pages/ProductsEditor';
import GalleryEditor from './admin/pages/GalleryEditor';
import ContactInfoEditor from './admin/pages/ContactInfoEditor';
import MessagesInbox from './admin/pages/MessagesInbox';
import AdminNotFound from './admin/pages/AdminNotFound';

const rootRoute = createRootRoute({
  component: () => <PublicLayout />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/about',
  component: AboutPage,
});

const productsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/products',
  component: ProductsPage,
});

const galleryRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/gallery',
  component: GalleryPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

// Admin parent route - handles auth gate
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminRoutes,
});

// Admin child routes - all pass through AdminRoutes auth gate
const adminIndexRoute = createRoute({
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

// Admin catch-all for unknown admin paths
const adminNotFoundRoute = createRoute({
  getParentRoute: () => adminRoute,
  path: '*',
  component: AdminNotFound,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  aboutRoute,
  productsRoute,
  galleryRoute,
  contactRoute,
  adminRoute.addChildren([
    adminIndexRoute,
    adminSettingsRoute,
    adminSectionsRoute,
    adminProductsRoute,
    adminGalleryRoute,
    adminContactRoute,
    adminMessagesRoute,
    adminNotFoundRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
