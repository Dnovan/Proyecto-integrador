/**
 * @fileoverview Componente Navbar - Organismo
 * @description Barra de navegación con tema blanco/dorado
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../atoms/Avatar';

// Color dorado real
const goldColor = '#D4AF37';

export const Navbar: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    // Links con sus rutas correctas
    const navLinks = [
        { label: 'Inicio', to: '/' },
        { label: 'Espacios', to: '/espacios' },
        { label: 'Contacto', to: '/contacto' },
    ];

    const isActive = (path: string) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#D4AF37]/30 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2 font-bold text-xl">
                        <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
                            style={{ backgroundColor: goldColor, boxShadow: `0 10px 25px ${goldColor}40` }}
                        >
                            <span className="text-white font-black text-sm">LS</span>
                        </div>
                        <span className="hidden sm:block text-gray-900 font-black">LocalSpace</span>
                    </Link>

                    {/* Navegación desktop */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                className="px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
                                style={{
                                    color: isActive(item.to) ? goldColor : '#374151',
                                    backgroundColor: isActive(item.to) ? `${goldColor}15` : 'transparent',
                                }}
                                onMouseEnter={(e) => {
                                    if (!isActive(item.to)) {
                                        e.currentTarget.style.color = goldColor;
                                        e.currentTarget.style.backgroundColor = `${goldColor}10`;
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive(item.to)) {
                                        e.currentTarget.style.color = '#374151';
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                    }
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Acciones de usuario */}
                    <div className="hidden md:flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div
                                    className="flex items-center gap-3 px-3 py-1.5 rounded-xl border"
                                    style={{ backgroundColor: `${goldColor}10`, borderColor: `${goldColor}30` }}
                                >
                                    <Avatar src={user?.avatar} name={user?.name} size="sm" />
                                    <span className="text-gray-900 font-bold text-sm">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button
                                        className="px-4 py-2 font-bold text-sm rounded-xl transition-colors"
                                        style={{ color: '#374151' }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.color = goldColor;
                                            e.currentTarget.style.backgroundColor = `${goldColor}10`;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.color = '#374151';
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                        }}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link to="/registro">
                                    <button
                                        className="px-5 py-2.5 text-white font-bold text-sm rounded-xl transition-all hover:opacity-90"
                                        style={{ backgroundColor: goldColor, boxShadow: `0 10px 25px ${goldColor}40` }}
                                    >
                                        Renta
                                    </button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Botón menú móvil */}
                    <button
                        className="md:hidden text-gray-700 p-2 rounded-xl transition-colors"
                        style={{ backgroundColor: isMobileMenuOpen ? `${goldColor}10` : 'transparent' }}
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Menú"
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Menú móvil */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t shadow-lg" style={{ borderColor: `${goldColor}30` }}>
                    <div className="px-4 py-4 space-y-1">
                        {navLinks.map((item) => (
                            <Link
                                key={item.label}
                                to={item.to}
                                onClick={closeMobileMenu}
                                className="block px-4 py-3 rounded-xl text-sm font-bold transition-colors"
                                style={{
                                    color: isActive(item.to) ? goldColor : '#374151',
                                    backgroundColor: isActive(item.to) ? `${goldColor}15` : 'transparent',
                                }}
                            >
                                {item.label}
                            </Link>
                        ))}

                        <div className="h-px my-4" style={{ backgroundColor: `${goldColor}30` }} />

                        {isAuthenticated ? (
                            <>
                                <div
                                    className="flex items-center gap-3 p-4 rounded-2xl mb-4 border"
                                    style={{ backgroundColor: `${goldColor}10`, borderColor: `${goldColor}30` }}
                                >
                                    <Avatar src={user?.avatar} name={user?.name} size="md" />
                                    <div>
                                        <p className="text-gray-900 font-bold">{user?.name}</p>
                                        <p className="text-gray-600 text-sm capitalize font-medium">
                                            {user?.role.toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 w-full px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <div className="pt-2 space-y-2">
                                <Link to="/login" onClick={closeMobileMenu} className="block">
                                    <button
                                        className="w-full px-4 py-3 text-gray-700 font-bold rounded-xl border-2 transition-colors"
                                        style={{ borderColor: `${goldColor}50` }}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </Link>
                                <Link to="/registro" onClick={closeMobileMenu} className="block">
                                    <button
                                        className="w-full px-4 py-3 text-white font-bold rounded-xl"
                                        style={{ backgroundColor: goldColor }}
                                    >
                                        Renta
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
