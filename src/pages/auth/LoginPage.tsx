/**
 * @fileoverview Página de Login Premium - EventSpace
 * @description Diseño split-screen con formulario elegante y hero image
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ArrowRight, CheckCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, isLoading, error, clearError, isAuthenticated, user } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        email?: string;
        password?: string;
    }>({});

    const verificationSuccess = (location.state as { verified?: boolean; message?: string })?.verified;
    const successMessage = (location.state as { message?: string })?.message;

    useEffect(() => {
        if (isAuthenticated && user) {
            const getHomeForRole = () => {
                switch (user.role) {
                    case 'PROVEEDOR': return '/proveedor';
                    case 'ADMIN': return '/admin-panel';
                    default: return '/';
                }
            };
            navigate(getHomeForRole(), { replace: true });
        }
    }, [isAuthenticated, user, navigate]);

    const validateForm = (): boolean => {
        const errors: { email?: string; password?: string } = {};
        if (!email) {
            errors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.email = 'Email inválido';
        }
        if (!password) {
            errors.password = 'La contraseña es requerida';
        } else if (password.length < 6) {
            errors.password = 'Mínimo 6 caracteres';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (!validateForm()) return;
        try {
            await login(email, password);
            navigate('/');
        } catch {
            // Error manejado por AuthContext
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* ==================== PANEL IZQUIERDO - FORMULARIO (FONDO CLARO) ==================== */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                <div className="w-full max-w-md relative z-10">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-12 group">
                        <div className="w-12 h-12 bg-gradient-to-br from-neon to-accent rounded-2xl flex items-center justify-center shadow-lg shadow-neon/20 group-hover:shadow-neon/40 transition-shadow">
                            <span className="text-black font-black text-xl">ES</span>
                        </div>
                        <span className="text-2xl font-bold text-gray-900">
                            EventSpace
                        </span>
                    </Link>

                    {/* Título */}
                    <div className="mb-10">
                        <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
                            Bienvenido
                        </h1>
                        <p className="text-gray-700 text-lg">
                            Ingresa a tu cuenta para continuar
                        </p>
                    </div>

                    {/* Mensaje de verificación */}
                    {verificationSuccess && (
                        <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                            <p className="text-green-700 text-sm">{successMessage}</p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                    className={`w-full pl-12 pr-4 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all ${validationErrors.email ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>
                            {validationErrors.email && (
                                <p className="text-red-500 text-xs">{validationErrors.email}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-800 uppercase tracking-wider">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all ${validationErrors.password ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {validationErrors.password && (
                                <p className="text-red-500 text-xs">{validationErrors.password}</p>
                            )}
                        </div>

                        {/* Olvidé contraseña */}
                        <div className="text-right">
                            <button type="button" className="text-sm text-gray-500 hover:text-neon transition-colors">
                                ¿Olvidaste tu contraseña?
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-4 px-6 bg-gradient-to-r from-neon to-accent text-black font-bold rounded-xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-neon/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    <span>Iniciando sesión...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-5 h-5" />
                                    <span>Iniciar Sesión</span>
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Registro */}
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            ¿No tienes cuenta?{' '}
                            <Link to="/registro" className="text-neon hover:underline font-semibold inline-flex items-center gap-1">
                                Regístrate gratis
                                <Sparkles className="w-4 h-4" />
                            </Link>
                        </p>
                    </div>

                    {/* Demo credentials */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <p className="text-gray-400 text-xs text-center mb-3">
                            Credenciales de demostración
                        </p>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Cliente:</span>
                                <code className="text-neon font-mono">cliente@eventspace.com / cliente123</code>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-gray-500">Proveedor:</span>
                                <code className="text-neon font-mono">proveedor@eventspace.com / proveedor123</code>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== PANEL DERECHO - HERO IMAGE ==================== */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/login-hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute inset-0 flex flex-col justify-end p-12">
                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon/20 backdrop-blur-sm rounded-full border border-neon/40 mb-6">
                            <Sparkles className="w-4 h-4 text-neon" />
                            <span className="text-neon text-sm font-medium">La plataforma #1 en México</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Encuentra el espacio perfecto para tu evento
                        </h2>
                        <p className="text-white/80 text-lg">
                            Más de 500 locales exclusivos para bodas, corporativos, fiestas y más.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
