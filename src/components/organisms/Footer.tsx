/**
 * @fileoverview Componente Footer - Organismo
 * @description Pie de página con links y copyright
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-bg-secondary border-t border-neon/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Logo y descripción */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-neon rounded-lg flex items-center justify-center">
                                <span className="text-black font-black text-sm">ES</span>
                            </div>
                            <span className="text-neon font-bold text-xl">EventSpace</span>
                        </Link>
                        <p className="text-text-secondary text-sm">
                            La plataforma premium para encontrar el espacio perfecto para tu evento.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="text-text-muted hover:text-neon transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-text-muted hover:text-neon transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-text-muted hover:text-neon transition-colors">
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Enlaces rápidos */}
                    <div>
                        <h4 className="text-text-primary font-semibold mb-4">Explorar</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/buscar" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Buscar Locales
                                </Link>
                            </li>
                            <li>
                                <Link to="/buscar?category=HACIENDA" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Haciendas
                                </Link>
                            </li>
                            <li>
                                <Link to="/buscar?category=JARDIN" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Jardines
                                </Link>
                            </li>
                            <li>
                                <Link to="/buscar?category=TERRAZA" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Terrazas
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Soporte */}
                    <div>
                        <h4 className="text-text-primary font-semibold mb-4">Soporte</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/ayuda" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Centro de Ayuda
                                </Link>
                            </li>
                            <li>
                                <Link to="/ayuda#faq" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Preguntas Frecuentes
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Términos y Condiciones
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-text-secondary hover:text-neon transition-colors text-sm">
                                    Política de Privacidad
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="text-text-primary font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-text-secondary text-sm">
                                <Mail className="w-4 h-4 text-neon" />
                                <a href="mailto:hola@eventspace.mx" className="hover:text-neon transition-colors">
                                    hola@eventspace.mx
                                </a>
                            </li>
                            <li className="flex items-center gap-2 text-text-secondary text-sm">
                                <Phone className="w-4 h-4 text-neon" />
                                <a href="tel:+525512345678" className="hover:text-neon transition-colors">
                                    +52 55 1234 5678
                                </a>
                            </li>
                            <li className="flex items-start gap-2 text-text-secondary text-sm">
                                <MapPin className="w-4 h-4 text-neon flex-shrink-0 mt-0.5" />
                                <span>Ciudad de México, México</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-neon/10 text-center">
                    <p className="text-text-muted text-sm">
                        © {currentYear} EventSpace. Todos los derechos reservados.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
