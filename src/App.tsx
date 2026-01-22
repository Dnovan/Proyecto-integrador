/**
 * @fileoverview Componente principal de la aplicación EventSpace
 * @description Configuración de rutas y layout principal
 * 
 * @iso25010
 * - Usabilidad: Navegación clara y estructura lógica
 * - Seguridad: Rutas protegidas por rol
 * - Mantenibilidad: Rutas centralizadas y organizadas
 * - Eficiencia: Lazy loading para carga optimizada
 */

import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute, useAuth } from './context/AuthContext';
import { Navbar } from './components/organisms/Navbar';
import { Footer } from './components/organisms/Footer';

// ==================== LAZY LOADING DE PÁGINAS ====================
// Mejora el tiempo de carga inicial dividiendo el código por rutas

const LoginPage = React.lazy(() => import('./pages/auth/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage').then(m => ({ default: m.RegisterPage })));
const VerifyEmailPage = React.lazy(() => import('./pages/VerifyEmailPage'));
const AuthCallbackPage = React.lazy(() => import('./pages/AuthCallbackPage'));
const HomePage = React.lazy(() => import('./pages/client/HomePage').then(m => ({ default: m.HomePage })));
const VenueDetailPage = React.lazy(() => import('./pages/client/VenueDetailPage').then(m => ({ default: m.VenueDetailPage })));
const InstitutionPage = React.lazy(() => import('./pages/client/InstitutionPage').then(m => ({ default: m.InstitutionPage })));
const ServicesPage = React.lazy(() => import('./pages/client/ServicesPage').then(m => ({ default: m.ServicesPage })));
const ContactPage = React.lazy(() => import('./pages/client/ContactPage').then(m => ({ default: m.ContactPage })));
const EspaciosPage = React.lazy(() => import('./pages/client/EspaciosPage').then(m => ({ default: m.EspaciosPage })));
const DashboardPro = React.lazy(() => import('./pages/provider/DashboardPro').then(m => ({ default: m.DashboardPro })));
const AdminPanel = React.lazy(() => import('./pages/admin/AdminPanel').then(m => ({ default: m.AdminPanel })));
const HelpCenterPage = React.lazy(() => import('./pages/shared/HelpCenterPage').then(m => ({ default: m.HelpCenterPage })));

// ==================== LOADING SPINNER ====================
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-bg-primary flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin" />
  </div>
);

// ==================== LAYOUTS ====================

/**
 * Layout principal con Navbar y Footer
 */
const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-bg-primary flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

/**
 * Layout para páginas de autenticación (sin navbar/footer)
 */
const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-bg-primary">{children}</div>
);

/**
 * Layout para admin (sin footer)
 */
const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="min-h-screen bg-black flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
  </div>
);

// ==================== RUTAS ====================

/**
 * Componente de rutas con lógica de redirección basada en rol
 */
const AppRoutes: React.FC = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <PageLoader />;
  }

  // Redirigir según rol después de login
  const getHomeForRole = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'PROVEEDOR':
        return '/proveedor';
      case 'ADMIN':
        return '/admin-panel';
      default:
        return '/';
    }
  };

  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Rutas públicas - Auth */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getHomeForRole()} replace />
            ) : (
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            )
          }
        />
        <Route
          path="/registro"
          element={
            isAuthenticated ? (
              <Navigate to={getHomeForRole()} replace />
            ) : (
              <AuthLayout>
                <RegisterPage />
              </AuthLayout>
            )
          }
        />

        {/* Verify Email - página pendiente de verificación */}
        <Route
          path="/verify-email"
          element={
            <AuthLayout>
              <VerifyEmailPage />
            </AuthLayout>
          }
        />

        {/* Auth Callback - maneja redirect de Supabase */}
        <Route
          path="/auth/callback"
          element={
            <AuthLayout>
              <AuthCallbackPage />
            </AuthLayout>
          }
        />

        {/* Home - accesible para todos */}
        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        {/* Detalle de local - público */}
        <Route
          path="/local/:id"
          element={
            <MainLayout>
              <VenueDetailPage />
            </MainLayout>
          }
        />

        {/* Búsqueda - público */}
        <Route
          path="/buscar"
          element={
            <MainLayout>
              <EspaciosPage />
            </MainLayout>
          }
        />

        {/* Espacios - público */}
        <Route
          path="/espacios"
          element={
            <MainLayout>
              <EspaciosPage />
            </MainLayout>
          }
        />

        {/* Ayuda - público */}
        <Route
          path="/ayuda"
          element={
            <MainLayout>
              <HelpCenterPage />
            </MainLayout>
          }
        />

        {/* Institución - público */}
        <Route
          path="/institucion"
          element={
            <MainLayout>
              <InstitutionPage />
            </MainLayout>
          }
        />

        {/* Servicios - público */}
        <Route
          path="/servicios"
          element={
            <MainLayout>
              <ServicesPage />
            </MainLayout>
          }
        />

        {/* Contacto - público */}
        <Route
          path="/contacto"
          element={
            <MainLayout>
              <ContactPage />
            </MainLayout>
          }
        />

        {/* ==================== RUTAS PROTEGIDAS - PROVEEDOR ==================== */}
        <Route
          path="/proveedor"
          element={
            <ProtectedRoute allowedRoles={['PROVEEDOR']}>
              <MainLayout>
                <DashboardPro />
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/proveedor/*"
          element={
            <ProtectedRoute allowedRoles={['PROVEEDOR']}>
              <MainLayout>
                <DashboardPro />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* ==================== RUTAS PROTEGIDAS - ADMIN ==================== */}
        <Route
          path="/admin-panel"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <AdminLayout>
                <AdminPanel />
              </AdminLayout>
            </ProtectedRoute>
          }
        />

        {/* 404 - Redirigir a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

// ==================== APP ====================

/**
 * Componente raíz de la aplicación
 */
const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
