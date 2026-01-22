/**
 * @fileoverview Modal de Login Requerido para EventSpace
 * @description Modal que aparece cuando un guest intenta realizar una acción protegida
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, LogIn, UserPlus, Lock } from 'lucide-react';

interface LoginRequiredModalProps {
    isOpen: boolean;
    onClose: () => void;
    action?: string; // Descripción de la acción que requiere login
}

const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
    isOpen,
    onClose,
    action = 'realizar esta acción'
}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleLogin = () => {
        onClose();
        navigate('/login', { state: { returnTo: window.location.pathname } });
    };

    const handleRegister = () => {
        onClose();
        navigate('/register', { state: { returnTo: window.location.pathname } });
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative bg-bg-secondary border border-border-primary rounded-2xl shadow-2xl max-w-md w-full animate-scale-up"
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 text-text-secondary hover:text-neon hover:bg-neon/10 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-neon/20 to-accent/20 flex items-center justify-center">
                        <Lock className="w-10 h-10 text-neon" />
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Inicia Sesión
                    </h2>

                    {/* Description */}
                    <p className="text-text-secondary mb-8">
                        Necesitas una cuenta para <span className="text-neon">{action}</span>
                    </p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleLogin}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-neon to-accent text-bg-primary font-semibold rounded-xl hover:shadow-lg hover:shadow-neon/30 transition-all duration-300"
                        >
                            <LogIn className="w-5 h-5" />
                            Iniciar Sesión
                        </button>

                        <button
                            onClick={handleRegister}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-bg-primary border border-border-primary text-text-primary font-medium rounded-xl hover:border-neon hover:text-neon transition-all duration-300"
                        >
                            <UserPlus className="w-5 h-5" />
                            Crear Cuenta
                        </button>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-xs text-text-secondary">
                        Regístrate gratis y accede a todas las funciones
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginRequiredModal;
