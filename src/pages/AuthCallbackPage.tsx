/**
 * @fileoverview Página de Callback de Autenticación para EventSpace
 * @description Maneja las redirecciones después de la verificación de email de Supabase
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

type CallbackStatus = 'loading' | 'success' | 'error';

const AuthCallbackPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<CallbackStatus>('loading');
    const [message, setMessage] = useState('Verificando tu cuenta...');

    useEffect(() => {
        const handleCallback = async () => {
            if (!isSupabaseConfigured() || !supabase) {
                // Modo mock - simplemente redirigir
                setStatus('success');
                setMessage('¡Cuenta verificada!');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            try {
                // Supabase maneja automáticamente el token en la URL
                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('Auth callback error:', error);
                    setStatus('error');
                    setMessage(error.message || 'Error al verificar tu cuenta');
                    return;
                }

                if (session?.user?.email_confirmed_at) {
                    setStatus('success');
                    setMessage('¡Email verificado exitosamente!');

                    // Redirigir al login después de 2 segundos
                    setTimeout(() => {
                        navigate('/login', {
                            state: {
                                verified: true,
                                message: '¡Tu cuenta ha sido verificada! Ahora puedes iniciar sesión.'
                            }
                        });
                    }, 2000);
                } else {
                    // El usuario llegó aquí pero no está verificado
                    setStatus('error');
                    setMessage('No pudimos verificar tu email. Por favor intenta de nuevo.');
                }
            } catch (err) {
                console.error('Callback error:', err);
                setStatus('error');
                setMessage('Ocurrió un error inesperado');
            }
        };

        handleCallback();
    }, [navigate, searchParams]);

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="w-16 h-16 text-neon animate-spin" />;
            case 'success':
                return <CheckCircle className="w-16 h-16 text-green-400" />;
            case 'error':
                return <XCircle className="w-16 h-16 text-red-400" />;
        }
    };

    const getBackgroundClass = () => {
        switch (status) {
            case 'loading':
                return 'from-neon/20 to-accent/20';
            case 'success':
                return 'from-green-500/20 to-emerald-500/20';
            case 'error':
                return 'from-red-500/20 to-rose-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg-primary via-bg-secondary to-bg-primary flex items-center justify-center p-4">
            <div className="max-w-md w-full text-center">
                {/* Card */}
                <div className="bg-bg-secondary/80 backdrop-blur-xl rounded-2xl border border-border-primary shadow-2xl p-8">
                    {/* Icono con animación */}
                    <div className={`w-24 h-24 mx-auto rounded-full bg-gradient-to-br ${getBackgroundClass()} flex items-center justify-center mb-6 ${status === 'loading' ? 'animate-pulse' : ''}`}>
                        {getIcon()}
                    </div>

                    {/* Mensaje */}
                    <h1 className={`text-xl font-bold mb-2 ${status === 'success' ? 'text-green-400' :
                            status === 'error' ? 'text-red-400' :
                                'text-text-primary'
                        }`}>
                        {status === 'loading' ? 'Procesando...' :
                            status === 'success' ? '¡Verificación Exitosa!' :
                                'Error de Verificación'}
                    </h1>

                    <p className="text-text-secondary mb-6">
                        {message}
                    </p>

                    {/* Acciones según estado */}
                    {status === 'success' && (
                        <div className="text-sm text-text-secondary">
                            Serás redirigido en unos segundos...
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-3">
                            <button
                                onClick={() => navigate('/register')}
                                className="w-full px-4 py-3 bg-neon text-bg-primary font-medium rounded-lg hover:bg-neon-dark transition-colors"
                            >
                                Intentar de nuevo
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="w-full px-4 py-3 bg-bg-primary text-text-secondary border border-border-primary rounded-lg hover:border-neon hover:text-neon transition-colors"
                            >
                                Ir al inicio de sesión
                            </button>
                        </div>
                    )}

                    {status === 'loading' && (
                        <div className="flex justify-center gap-1">
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthCallbackPage;
