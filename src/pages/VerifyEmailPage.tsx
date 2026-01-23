/**
 * @fileoverview Página de Verificación de Email para EventSpace
 * @description Muestra instrucciones al usuario para verificar su email después del registro
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, RefreshCw, CheckCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const VerifyEmailPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, pendingVerificationEmail, resendVerification, emailVerified } = useAuth();

    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [error, setError] = useState<string | null>(null);

    // Si ya está autenticado y verificado, redirigir
    useEffect(() => {
        if (isAuthenticated && emailVerified) {
            navigate('/');
        }
    }, [isAuthenticated, emailVerified, navigate]);

    // Cooldown para reenvío
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const email = pendingVerificationEmail || (location.state as { email?: string })?.email || '';

    const handleResend = async () => {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);
        setError(null);

        try {
            await resendVerification();
            setResendSuccess(true);
            setResendCooldown(60); // 60 segundos de cooldown
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al reenviar email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Card principal */}
                <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border-primary shadow-2xl p-8 text-center">
                    {/* Icono animado */}
                    <div className="mb-6 relative">
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-neon/20 to-accent/20 flex items-center justify-center animate-pulse-neon">
                            <Mail className="w-12 h-12 text-neon" />
                        </div>
                        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full border-2 border-neon/30 animate-ping" style={{ animationDuration: '2s' }} />
                    </div>

                    {/* Título */}
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Verifica tu Email
                    </h1>

                    {/* Subtítulo */}
                    <p className="text-text-secondary mb-6">
                        Hemos enviado un enlace de verificación a:
                    </p>

                    {/* Email */}
                    <div className="bg-bg-primary/50 rounded-lg p-3 mb-6 border border-border-primary">
                        <p className="text-neon font-medium break-all">
                            {email || 'tu email registrado'}
                        </p>
                    </div>

                    {/* Instrucciones */}
                    <div className="space-y-3 text-sm text-text-secondary mb-8">
                        <div className="flex items-start gap-3 text-left">
                            <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-neon font-bold text-xs">1</span>
                            </div>
                            <p>Revisa tu bandeja de entrada (y spam)</p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-neon font-bold text-xs">2</span>
                            </div>
                            <p>Haz clic en el enlace de verificación</p>
                        </div>
                        <div className="flex items-start gap-3 text-left">
                            <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-neon font-bold text-xs">3</span>
                            </div>
                            <p>Serás redirigido automáticamente</p>
                        </div>
                    </div>

                    {/* Mensaje de éxito */}
                    {resendSuccess && (
                        <div className="flex items-center gap-2 justify-center text-green-400 mb-4 bg-green-500/10 rounded-lg p-3">
                            <CheckCircle className="w-5 h-5" />
                            <span className="text-sm">¡Email reenviado exitosamente!</span>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <div className="text-red-400 text-sm mb-4 bg-red-500/10 rounded-lg p-3">
                            {error}
                        </div>
                    )}

                    {/* Botón de reenvío */}
                    <button
                        onClick={handleResend}
                        disabled={resendCooldown > 0 || isResending}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-neon/20 text-neon hover:bg-neon/30 border border-neon/30"
                    >
                        <RefreshCw className={`w-5 h-5 ${isResending ? 'animate-spin' : ''}`} />
                        {resendCooldown > 0
                            ? `Reenviar en ${resendCooldown}s`
                            : isResending
                                ? 'Reenviando...'
                                : '¿No recibiste el email? Reenviar'
                        }
                    </button>

                    {/* Divider */}
                    <div className="my-6 border-t border-border-primary" />

                    {/* Link para volver */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-text-secondary hover:text-neon transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio de sesión
                    </Link>
                </div>

                {/* Nota de ayuda */}
                <p className="text-center text-text-secondary text-xs mt-6">
                    Si tienes problemas, contacta a{' '}
                    <a href="mailto:soporte@eventspace.mx" className="text-neon hover:underline">
                        soporte@eventspace.mx
                    </a>
                </p>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
