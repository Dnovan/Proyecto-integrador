/**
 * @fileoverview Página de Espacios con Secciones por Categoría
 * @description Listado de espacios disponibles organizados por categoría
 */

import React, { useState, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { VenueCardSkeleton } from '../../components/atoms/Skeleton';
import * as api from '../../services/mockApi';
import type { Venue, VenueCategory } from '../../types';

const gold = '#D4AF37';

// Categorías con labels en español
const categoryLabels: Record<VenueCategory, string> = {
    SALON_EVENTOS: 'Salón de Eventos',
    JARDIN: 'Jardín',
    TERRAZA: 'Terraza',
    HACIENDA: 'Hacienda',
    BODEGA: 'Bodega Industrial',
    RESTAURANTE: 'Restaurante',
    HOTEL: 'Hotel',
};

export const EspaciosPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'ALL'>('ALL');

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const venuesRes = await api.getVenues({}, 1, 50);
                setVenues(venuesRes.data);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    // Filtrar por búsqueda
    const searchFiltered = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Filtrar por categoría seleccionada
    const filteredVenues = selectedCategory === 'ALL'
        ? searchFiltered
        : searchFiltered.filter(v => v.category === selectedCategory);

    // Agrupar por categoría para vista de secciones
    const venuesByCategory = searchFiltered.reduce((acc, venue) => {
        if (!acc[venue.category]) {
            acc[venue.category] = [];
        }
        acc[venue.category].push(venue);
        return acc;
    }, {} as Record<VenueCategory, Venue[]>);

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const categories: (VenueCategory | 'ALL')[] = ['ALL', 'SALON_EVENTOS', 'JARDIN', 'TERRAZA', 'HACIENDA', 'BODEGA', 'RESTAURANTE', 'HOTEL'];

    return (
        <div className="min-h-screen bg-white pt-20">
            {/* Header */}
            <section className="py-16 px-4" style={{ backgroundColor: `${gold}10` }}>
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4">
                            Explora Nuestros <span style={{ color: gold }}>Espacios</span>
                        </h1>
                        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
                            Encuentra el lugar perfecto para rentar. Salones, jardines, terrazas y más.
                        </p>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto mb-8"
                    >
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Buscar por nombre o ubicación..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none transition-all text-lg"
                                style={{
                                    borderColor: `${gold}40`,
                                }}
                            />
                        </div>
                    </motion.div>

                    {/* Category Tabs */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-2"
                    >
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${selectedCategory === cat
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-200'
                                    }`}
                                style={selectedCategory === cat ? { backgroundColor: gold } : {}}
                            >
                                {cat === 'ALL' ? 'Todos' : categoryLabels[cat]}
                            </button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Results */}
            <section className="py-12 px-4">
                <div className="max-w-7xl mx-auto">
                    {selectedCategory === 'ALL' ? (
                        // Vista por secciones de categoría
                        <div className="space-y-16">
                            {Object.entries(venuesByCategory).map(([category, categoryVenues]) => (
                                <motion.div
                                    key={category}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                >
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-black text-gray-900">
                                            {categoryLabels[category as VenueCategory]}
                                        </h2>
                                        <span
                                            className="text-sm font-bold px-3 py-1 rounded-full"
                                            style={{ backgroundColor: `${gold}20`, color: gold }}
                                        >
                                            {categoryVenues.length} espacios
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {categoryVenues.map((venue) => (
                                            <motion.div variants={fadeInUp} key={venue.id}>
                                                <PropertyCard venue={venue} />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        // Vista filtrada por categoría
                        <>
                            <div className="flex items-center justify-between mb-8">
                                <p className="text-gray-600 font-medium">
                                    {filteredVenues.length} espacios encontrados
                                </p>
                            </div>

                            {isLoading ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {Array.from({ length: 6 }).map((_, i) => (
                                        <VenueCardSkeleton key={i} />
                                    ))}
                                </div>
                            ) : filteredVenues.length > 0 ? (
                                <motion.div
                                    initial="hidden"
                                    animate="visible"
                                    variants={{
                                        visible: { transition: { staggerChildren: 0.05 } }
                                    }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                                >
                                    {filteredVenues.map((venue) => (
                                        <motion.div variants={fadeInUp} key={venue.id}>
                                            <PropertyCard venue={venue} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            ) : (
                                <div className="text-center py-20">
                                    <MapPin className="w-16 h-16 mx-auto mb-4" style={{ color: `${gold}50` }} />
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">No se encontraron espacios</h3>
                                    <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </section>
        </div>
    );
};

export default EspaciosPage;
