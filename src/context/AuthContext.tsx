/**
 * @fileoverview Contexto de Autenticación Real con Supabase para EventSpace
 * @description Gestiona autenticación con Supabase Auth, verificación de email y roles
 * 
 * @iso25010
 * - Seguridad: Autenticación real con Supabase, verificación de email obligatoria
 * - Usabilidad: Estado persistente, feedback claro, soporte para guests
 * - Mantenibilidad: Lógica centralizada de autenticación
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from 'react';
import type { User, UserRole } from '../types';
import {
    isSupabaseConfigured,
    signUp as supabaseSignUp,
    signIn as supabaseSignIn,
    signOut as supabaseSignOut,
    resendVerificationEmail,
    getCurrentAuthUser,
    getUserProfile,
    onAuthStateChange,
    isEmailVerified,
} from '../services/supabaseClient';
import * as mockApi from '../services/mockApi';

// ==================== TIPOS DEL CONTEXTO ====================

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    emailVerified: boolean;
    pendingVerificationEmail: string | null;
}

interface AuthContextType extends AuthState {
    /** Inicia sesión con credenciales */
    login: (email: string, password: string) => Promise<void>;
    /** Registra un nuevo cliente */
    register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
    /** Cierra sesión */
    logout: () => Promise<void>;
    /** Verifica si el usuario tiene un rol específico */
    hasRole: (role: UserRole) => boolean;
    /** Verifica si el usuario tiene alguno de los roles especificados */
    hasAnyRole: (roles: UserRole[]) => boolean;
    /** Limpia errores de autenticación */
    clearError: () => void;
    /** Reenvía el email de verificación */
    resendVerification: () => Promise<void>;
}

// ==================== CONTEXTO ====================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Clave para localStorage (solo para mock)
const STORAGE_KEY = 'eventspace_user';

// ==================== PROVIDER ====================

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Proveedor del contexto de autenticación con Supabase
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
        emailVerified: false,
        pendingVerificationEmail: null,
    });

    // Usar Supabase o mock
    const useRealAuth = isSupabaseConfigured();

    // Inicializar autenticación
    useEffect(() => {
        const initAuth = async () => {
            if (useRealAuth) {
                // Supabase Auth
                try {
                    const authUser = await getCurrentAuthUser();
                    if (authUser && isEmailVerified(authUser)) {
                        const profile = await getUserProfile(authUser.id);
                        if (profile) {
                            setState({
                                user: {
                                    id: profile.id,
                                    email: profile.email,
                                    name: profile.name,
                                    role: profile.role as UserRole,
                                    avatar: profile.avatar,
                                    phone: profile.phone,
                                    createdAt: new Date(profile.created_at),
                                    verificationStatus: profile.verification_status,
                                },
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                                emailVerified: true,
                                pendingVerificationEmail: null,
                            });
                            return;
                        }
                    }
                } catch (error) {
                    console.error('Error initializing auth:', error);
                }
                setState(prev => ({ ...prev, isLoading: false }));
            } else {
                // Mock: restaurar de localStorage
                const storedUser = localStorage.getItem(STORAGE_KEY);
                if (storedUser) {
                    try {
                        const user = JSON.parse(storedUser) as User;
                        setState({
                            user,
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                            emailVerified: true,
                            pendingVerificationEmail: null,
                        });
                        return;
                    } catch {
                        localStorage.removeItem(STORAGE_KEY);
                    }
                }
                setState(prev => ({ ...prev, isLoading: false }));
            }
        };

        initAuth();

        // Listener para cambios de auth (solo Supabase)
        if (useRealAuth) {
            const { data: { subscription } } = onAuthStateChange(async (event, session) => {
                if (event === 'SIGNED_IN' && session?.user) {
                    const authUser = session.user;
                    if (isEmailVerified(authUser)) {
                        const profile = await getUserProfile(authUser.id);
                        if (profile) {
                            setState({
                                user: {
                                    id: profile.id,
                                    email: profile.email,
                                    name: profile.name,
                                    role: profile.role as UserRole,
                                    avatar: profile.avatar,
                                    phone: profile.phone,
                                    createdAt: new Date(profile.created_at),
                                    verificationStatus: profile.verification_status,
                                },
                                isAuthenticated: true,
                                isLoading: false,
                                error: null,
                                emailVerified: true,
                                pendingVerificationEmail: null,
                            });
                        }
                    }
                } else if (event === 'SIGNED_OUT') {
                    setState({
                        user: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                        emailVerified: false,
                        pendingVerificationEmail: null,
                    });
                }
            });

            return () => {
                subscription.unsubscribe();
            };
        }
    }, [useRealAuth]);

    /**
     * Inicia sesión
     */
    const login = useCallback(async (email: string, password: string) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            if (useRealAuth) {
                // Supabase Auth
                const { user: authUser } = await supabaseSignIn(email, password);
                if (authUser) {
                    const profile = await getUserProfile(authUser.id);
                    if (profile) {
                        setState({
                            user: {
                                id: profile.id,
                                email: profile.email,
                                name: profile.name,
                                role: profile.role as UserRole,
                                avatar: profile.avatar,
                                phone: profile.phone,
                                createdAt: new Date(profile.created_at),
                                verificationStatus: profile.verification_status,
                            },
                            isAuthenticated: true,
                            isLoading: false,
                            error: null,
                            emailVerified: true,
                            pendingVerificationEmail: null,
                        });
                        return;
                    }
                }
            } else {
                // Mock
                const user = await mockApi.login({ email, password });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    emailVerified: true,
                    pendingVerificationEmail: null,
                });
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al iniciar sesión',
            }));
            throw error;
        }
    }, [useRealAuth]);

    /**
     * Registra un nuevo cliente
     */
    const register = useCallback(async (data: { name: string; email: string; password: string; phone?: string }) => {
        setState(prev => ({ ...prev, isLoading: true, error: null }));

        try {
            if (useRealAuth) {
                // Supabase Auth - envía email de verificación
                await supabaseSignUp(data.email, data.password, { name: data.name, phone: data.phone });
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    error: null,
                    pendingVerificationEmail: data.email,
                }));
                // No autenticamos hasta que verifique el email
            } else {
                // Mock
                const user = await mockApi.register({
                    name: data.name,
                    email: data.email,
                    password: data.password,
                    phone: data.phone,
                });
                localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
                setState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                    emailVerified: true,
                    pendingVerificationEmail: null,
                });
            }
        } catch (error) {
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Error al registrarse',
            }));
            throw error;
        }
    }, [useRealAuth]);

    /**
     * Cierra sesión
     */
    const logout = useCallback(async () => {
        setState(prev => ({ ...prev, isLoading: true }));

        try {
            if (useRealAuth) {
                await supabaseSignOut();
            } else {
                await mockApi.logout();
                localStorage.removeItem(STORAGE_KEY);
            }
        } finally {
            setState({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
                emailVerified: false,
                pendingVerificationEmail: null,
            });
        }
    }, [useRealAuth]);

    /**
     * Reenvía email de verificación
     */
    const resendVerification = useCallback(async () => {
        if (!state.pendingVerificationEmail) return;

        try {
            await resendVerificationEmail(state.pendingVerificationEmail);
        } catch (error) {
            setState(prev => ({
                ...prev,
                error: error instanceof Error ? error.message : 'Error al reenviar email',
            }));
            throw error;
        }
    }, [state.pendingVerificationEmail]);

    /**
     * Verifica si el usuario actual tiene un rol específico
     */
    const hasRole = useCallback((role: UserRole): boolean => {
        return state.user?.role === role;
    }, [state.user]);

    /**
     * Verifica si el usuario actual tiene alguno de los roles especificados
     */
    const hasAnyRole = useCallback((roles: UserRole[]): boolean => {
        return state.user ? roles.includes(state.user.role) : false;
    }, [state.user]);

    /**
     * Limpia el error de autenticación actual
     */
    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    // Memoizar el valor del contexto para evitar re-renders innecesarios
    const value = useMemo<AuthContextType>(() => ({
        ...state,
        login,
        register,
        logout,
        hasRole,
        hasAnyRole,
        clearError,
        resendVerification,
    }), [state, login, register, logout, hasRole, hasAnyRole, clearError, resendVerification]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// ==================== HOOKS ====================

/**
 * Hook para acceder al contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};

// ==================== COMPONENTES PROTEGIDOS ====================

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: UserRole[];
    fallback?: ReactNode;
}

/**
 * Componente para proteger rutas basado en autenticación y roles
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles,
    fallback,
}) => {
    const { isAuthenticated, isLoading, user } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="animate-pulse-neon">
                    <div className="w-16 h-16 border-4 border-neon border-t-transparent rounded-full animate-spin" />
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return fallback ? <>{fallback}</> : null;
    }

    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        return fallback ? (
            <>{fallback}</>
        ) : (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-neon mb-4">403</h1>
                    <p className="text-text-secondary">No tienes permisos para acceder a esta página</p>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AuthContext;
