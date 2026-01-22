/**
 * @fileoverview Home del Cliente - Blanco con Dorado
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, ArrowRight, Search, CheckCircle, Shield, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { VenueCardSkeleton } from '../../components/atoms/Skeleton';
import * as api from '../../services/mockApi';
import type { Venue } from '../../types';

// Color dorado real
const gold = '#D4AF37';
const goldLight = '#F5E6B3';
const goldDark = '#B8941F';

export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const venuesRes = await api.getVenues({}, 1, 6);
                setVenues(venuesRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Blanco con Dorado */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
                {/* Decorative background */}
                <div className="absolute inset-0">
                    <div
                        className="absolute inset-0"
                        style={{ background: `linear-gradient(135deg, ${goldLight}40 0%, white 50%, ${goldLight}30 100%)` }}
                    />
                    <div
                        className="absolute top-20 left-20 w-80 h-80 rounded-full blur-3xl"
                        style={{ backgroundColor: `${gold}25` }}
                    />
                    <div
                        className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full blur-3xl"
                        style={{ backgroundColor: `${gold}30` }}
                    />
                    <div
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-3xl"
                        style={{ backgroundColor: `${gold}15` }}
                    />
                </div>

                {/* Gold accent line */}
                <div
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ background: `linear-gradient(to right, transparent, ${gold}, transparent)` }}
                />

                {/* Content */}
                <div className="relative max-w-6xl mx-auto text-center z-10 px-4 pt-24 pb-16">
                    {/* Badge */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-white rounded-full mb-8 shadow-lg"
                        style={{ backgroundColor: gold, boxShadow: `0 10px 30px ${gold}50` }}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-sm font-bold">Plataforma de Espacios para Eventos en México</span>
                    </motion.div>

                    {/* Título principal */}
                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-gray-900 mb-6 tracking-tight leading-tight"
                    >
                        Encuentra el{' '}
                        <span style={{ color: gold }}>espacio perfecto</span>
                        <br />
                        para tu evento
                    </motion.h1>

                    {/* Subtítulo */}
                    <motion.p
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
                    >
                        Conectamos anfitriones con los espacios más exclusivos.
                        Salones, jardines, terrazas y más en todo México.
                    </motion.p>

                    {/* CTAs */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
                    >
                        <button
                            onClick={() => navigate('/espacios')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 text-white font-bold rounded-2xl hover:opacity-90 transition-all duration-300 text-lg"
                            style={{ backgroundColor: gold, boxShadow: `0 15px 35px ${gold}50` }}
                        >
                            <Search className="w-5 h-5" />
                            Explorar Espacios
                        </button>
                        <button
                            onClick={() => navigate('/registro?role=PROVEEDOR')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl border-2 transition-all duration-300 text-lg hover:bg-gray-50"
                            style={{ borderColor: gold }}
                        >
                            Renta tu Local
                        </button>
                    </motion.div>

                    {/* Benefits */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex flex-wrap justify-center gap-6 md:gap-10"
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-6 h-6" style={{ color: gold }} />
                            <span className="text-gray-800 font-semibold">Locales Verificados</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-6 h-6" style={{ color: gold }} />
                            <span className="text-gray-800 font-semibold">Reservas Seguras</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <HeartHandshake className="w-6 h-6" style={{ color: gold }} />
                            <span className="text-gray-800 font-semibold">Atención Personalizada</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Servicios Section */}
            <section className="py-20 px-4" style={{ backgroundColor: `${goldLight}30` }} id="servicios">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center mb-16"
                    >
                        <span
                            className="inline-block px-4 py-1 text-white text-sm font-bold rounded-full mb-4"
                            style={{ backgroundColor: gold }}
                        >
                            NUESTROS SERVICIOS
                        </span>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">¿Qué Ofrecemos?</h2>
                        <p className="text-gray-700 max-w-2xl mx-auto font-medium">Soluciones integrales para facilitarte la búsqueda y gestión de espacios.</p>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        {[
                            { title: 'Búsqueda Inteligente', icon: <Search className="w-8 h-8" />, desc: 'Filtra por ubicación, capacidad y precio para encontrar el lugar ideal.' },
                            { title: 'Gestión de Reservas', icon: <Clock className="w-8 h-8" />, desc: 'Sistema simplificado para agendar visitas y confirmar fechas fácilmente.' },
                            { title: 'Soporte Premium', icon: <Sparkles className="w-8 h-8" />, desc: 'Asistencia dedicada para asegurar el éxito de tu evento.' }
                        ].map((service, index) => (
                            <motion.div
                                variants={fadeInUp}
                                key={index}
                                className="p-8 rounded-3xl bg-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                                style={{ border: `2px solid ${gold}30` }}
                            >
                                <div
                                    className="w-16 h-16 mb-6 rounded-2xl flex items-center justify-center text-white shadow-lg"
                                    style={{ backgroundColor: gold, boxShadow: `0 10px 25px ${gold}40` }}
                                >
                                    {service.icon}
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-3">{service.title}</h3>
                                <p className="text-gray-700 font-medium">{service.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Espacios Destacados */}
            <section className="py-20 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4"
                    >
                        <div>
                            <span
                                className="inline-block px-4 py-1 text-white text-sm font-bold rounded-full mb-3"
                                style={{ backgroundColor: gold }}
                            >
                                ESPACIOS DESTACADOS
                            </span>
                            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                                Los Mejores Lugares
                            </h2>
                        </div>
                        <button
                            onClick={() => navigate('/espacios')}
                            className="inline-flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all hover:opacity-90"
                            style={{ backgroundColor: gold, boxShadow: `0 10px 25px ${gold}40` }}
                        >
                            Ver todos
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {isLoading
                            ? Array.from({ length: 3 }).map((_, i) => (
                                <VenueCardSkeleton key={i} />
                            ))
                            : venues.slice(0, 3).map((venue) => (
                                <motion.div variants={fadeInUp} key={venue.id}>
                                    <PropertyCard venue={venue} />
                                </motion.div>
                            ))}
                    </motion.div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="py-24 px-4" style={{ backgroundColor: gold }}>
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                        className="text-center"
                    >
                        <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
                            ¿Tienes un espacio para eventos?
                        </h2>
                        <p className="text-white/90 text-lg mb-10 max-w-2xl mx-auto font-medium">
                            Únete a nuestra red de promotores. Aumenta tu visibilidad y gestiona tus rentas de forma profesional.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => navigate('/registro?role=PROVEEDOR')}
                                className="px-8 py-4 bg-white font-black rounded-2xl hover:bg-gray-100 transition-colors shadow-xl text-lg"
                                style={{ color: goldDark }}
                            >
                                Registrar mi Espacio
                            </button>
                            <button
                                onClick={() => navigate('/contacto')}
                                className="px-8 py-4 bg-transparent text-white font-bold rounded-2xl border-2 border-white hover:bg-white/10 transition-colors text-lg"
                            >
                                Más Información
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
