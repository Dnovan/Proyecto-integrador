/**
 * @fileoverview Página de Registro Premium - EventSpace
 * @description Diseño split-screen con hero image y formulario elegante
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, User, Phone, UserPlus, Check, ArrowRight, Shield, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const { register, isLoading, error, clearError, pendingVerificationEmail, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const passwordStrength = {
        hasLength: formData.password.length >= 6,
        hasUpper: /[A-Z]/.test(formData.password),
        hasNumber: /[0-9]/.test(formData.password),
    };
    const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

    const updateField = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (validationErrors[field]) {
            setValidationErrors((prev) => ({ ...prev, [field]: '' }));
        }
    };

    const validateForm = (): boolean => {
        const errors: Record<string, string> = {};
        if (!formData.name.trim()) {
            errors.name = 'El nombre es requerido';
        } else if (formData.name.trim().length < 3) {
            errors.name = 'Mínimo 3 caracteres';
        }
        if (!formData.email) {
            errors.email = 'El email es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = 'Email inválido';
        }
        if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
            errors.phone = 'Número inválido';
        }
        if (!formData.password) {
            errors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            errors.password = 'Mínimo 6 caracteres';
        }
        if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = 'Las contraseñas no coinciden';
        }
        if (!agreedToTerms) {
            errors.terms = 'Debes aceptar los términos';
        }
        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        clearError();
        if (!validateForm()) return;
        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone || undefined,
            });
            navigate(pendingVerificationEmail ? '/verify-email' : '/', {
                state: { email: formData.email }
            });
        } catch {
            // Error manejado por AuthContext
        }
    };

    return (
        <div className="min-h-screen flex flex-row-reverse">
            {/* ==================== PANEL DERECHO - FORMULARIO (FONDO CLARO) ==================== */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-white relative overflow-y-auto">
                <div className="w-full max-w-md relative z-10 py-8">
                    {/* Logo */}
                    <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
                        <div className="w-10 h-10 bg-gradient-to-br from-neon to-accent rounded-xl flex items-center justify-center shadow-lg shadow-neon/20 group-hover:shadow-neon/40 transition-shadow">
                            <span className="text-black font-black text-lg">ES</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                            EventSpace
                        </span>
                    </Link>

                    {/* Título */}
                    <div className="mb-8">
                        <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                            Crea tu cuenta
                        </h1>
                        <p className="text-gray-700">
                            Únete y descubre espacios increíbles
                        </p>
                    </div>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Nombre */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider">
                                Nombre completo
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Tu nombre"
                                    autoComplete="name"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all text-sm ${validationErrors.name ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>
                            {validationErrors.name && <p className="text-red-500 text-xs">{validationErrors.name}</p>}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider">
                                Correo electrónico
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-4 h-4" />
                                </div>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateField('email', e.target.value)}
                                    placeholder="tu@email.com"
                                    autoComplete="email"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all text-sm ${validationErrors.email ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>
                            {validationErrors.email && <p className="text-red-500 text-xs">{validationErrors.email}</p>}
                        </div>

                        {/* Teléfono */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider">
                                Teléfono <span className="text-gray-400 font-normal">(opcional)</span>
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    placeholder="+52 55 1234 5678"
                                    autoComplete="tel"
                                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all text-sm ${validationErrors.phone ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                            </div>
                            {validationErrors.phone && <p className="text-red-500 text-xs">{validationErrors.phone}</p>}
                        </div>

                        {/* Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider">
                                Contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={(e) => updateField('password', e.target.value)}
                                    placeholder="Mínimo 6 caracteres"
                                    autoComplete="new-password"
                                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all text-sm ${validationErrors.password ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                            {formData.password && (
                                <div className="flex gap-1 mt-2">
                                    {[1, 2, 3].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${strengthScore >= level
                                                ? strengthScore === 3 ? 'bg-green-500' : strengthScore === 2 ? 'bg-yellow-500' : 'bg-orange-500'
                                                : 'bg-gray-200'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                            {validationErrors.password && <p className="text-red-500 text-xs">{validationErrors.password}</p>}
                        </div>

                        {/* Confirm Password */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-semibold text-gray-800 uppercase tracking-wider">
                                Confirmar contraseña
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-4 h-4" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={(e) => updateField('confirmPassword', e.target.value)}
                                    placeholder="Repite tu contraseña"
                                    autoComplete="new-password"
                                    className={`w-full pl-10 pr-10 py-3 bg-gray-50 border-2 rounded-xl text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-neon/30 focus:border-neon focus:bg-white transition-all text-sm ${validationErrors.confirmPassword ? 'border-red-400' : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                />
                                {formData.confirmPassword && formData.password === formData.confirmPassword && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <Check className="w-4 h-4 text-green-500" />
                                    </div>
                                )}
                            </div>
                            {validationErrors.confirmPassword && <p className="text-red-500 text-xs">{validationErrors.confirmPassword}</p>}
                        </div>

                        {/* Términos */}
                        <div className="flex items-start gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setAgreedToTerms(!agreedToTerms)}
                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${agreedToTerms
                                    ? 'bg-neon border-neon'
                                    : validationErrors.terms
                                        ? 'border-red-400'
                                        : 'border-gray-300 hover:border-neon'
                                    }`}
                            >
                                {agreedToTerms && <Check className="w-3 h-3 text-black" />}
                            </button>
                            <p className="text-xs text-gray-600">
                                Acepto los{' '}
                                <Link to="/terminos" className="text-neon hover:underline">Términos de Servicio</Link>{' '}
                                y la{' '}
                                <Link to="/privacidad" className="text-neon hover:underline">Política de Privacidad</Link>
                            </p>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-neon to-accent text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-neon/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group mt-6"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    <span>Creando cuenta...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    <span>Crear Cuenta</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Login link */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="text-neon hover:underline font-semibold">
                                Inicia sesión
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* ==================== PANEL IZQUIERDO - HERO IMAGE ==================== */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: "url('/images/register-hero.png')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                <div className="absolute inset-0 flex flex-col justify-between p-12">
                    <div className="flex justify-end">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/20">
                            <Shield className="w-4 h-4 text-green-400" />
                            <span className="text-white text-sm font-medium">100% Seguro</span>
                        </div>
                    </div>

                    <div className="max-w-md">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-neon/20 backdrop-blur-sm rounded-full border border-neon/40 mb-6">
                            <Sparkles className="w-4 h-4 text-neon" />
                            <span className="text-neon text-sm font-medium">Únete a miles de clientes</span>
                        </div>
                        <h2 className="text-4xl font-bold text-white mb-4">
                            Tu próximo evento comienza aquí
                        </h2>
                        <p className="text-white/80 text-lg mb-8">
                            Desde íntimas reuniones hasta grandes celebraciones.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <div className="text-3xl font-bold text-neon">500+</div>
                                <div className="text-white/60 text-sm">Locales</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-neon">10K+</div>
                                <div className="text-white/60 text-sm">Eventos</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-neon">4.9</div>
                                <div className="text-white/60 text-sm">Calificación</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
