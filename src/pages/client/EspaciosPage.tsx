/**
 * @fileoverview Página de Espacios Premium
 * @description Listado de espacios con diseño moderno y filtrado por categorías
 */

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Sparkles, Filter, Grid3X3, LayoutGrid } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyCard } from '../../components/organisms/PropertyCard';
import { VenueCardSkeleton } from '../../components/atoms/Skeleton';
import * as api from '../../services/mockApi';
import type { Venue, VenueCategory } from '../../types';

const gold = '#D4AF37';
const goldLight = '#F5E6B3';

// Categorías con labels
const categoryConfig: Record<VenueCategory | 'ALL', { label: string }> = {
    ALL: { label: 'Todos' },
    SALON_EVENTOS: { label: 'Salón de Eventos' },
    JARDIN: { label: 'Jardín' },
    TERRAZA: { label: 'Terraza' },
    HACIENDA: { label: 'Hacienda' },
    BODEGA: { label: 'Bodega' },
    RESTAURANTE: { label: 'Restaurante' },
    HOTEL: { label: 'Hotel' },
};

export const EspaciosPage: React.FC = () => {
    const [venues, setVenues] = useState<Venue[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<VenueCategory | 'ALL'>('ALL');
    const [viewMode, setViewMode] = useState<'grid' | 'sections'>('sections');

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
        venue.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        venue.zone.toLowerCase().includes(searchTerm.toLowerCase())
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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 }
        }
    };

    const categories: (VenueCategory | 'ALL')[] = ['ALL', 'SALON_EVENTOS', 'JARDIN', 'TERRAZA', 'HACIENDA', 'BODEGA', 'RESTAURANTE', 'HOTEL'];

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-white to-gray-50 pt-20">
            {/* Hero Header */}
            <section
                className="relative py-20 px-4 overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${goldLight}30 0%, white 50%, ${goldLight}20 100%)`
                }}
            >
                {/* Decoraciones flotantes */}
                <motion.div
                    className="absolute top-10 left-10 w-64 h-64 rounded-full blur-3xl opacity-30"
                    style={{ backgroundColor: gold }}
                    animate={{
                        y: [0, -20, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 6, repeat: Infinity }}
                />
                <motion.div
                    className="absolute bottom-0 right-10 w-96 h-96 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: gold }}
                    animate={{
                        y: [0, 20, 0],
                        x: [0, -10, 0]
                    }}
                    transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                />

                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-center mb-12"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                            style={{
                                backgroundColor: gold,
                                boxShadow: `0 10px 30px ${gold}40`
                            }}
                        >
                            <Sparkles className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-bold">
                                {venues.length} Espacios Disponibles
                            </span>
                        </motion.div>

                        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                            Explora Nuestros{' '}
                            <span
                                className="relative inline-block"
                                style={{ color: gold }}
                            >
                                Espacios
                                <motion.div
                                    className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                                    style={{ backgroundColor: gold }}
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 0.5, duration: 0.6 }}
                                />
                            </span>
                        </h1>
                        <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
                            Encuentra el lugar perfecto para tu evento. Salones elegantes, jardines mágicos, terrazas con vista y mucho más.
                        </p>
                    </motion.div>

                    {/* Search Bar Premium */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.2 }}
                        className="max-w-3xl mx-auto mb-10"
                    >
                        <div
                            className="relative bg-white rounded-2xl overflow-hidden"
                            style={{
                                boxShadow: `0 20px 60px -15px ${gold}30, 0 0 0 1px ${gold}20`
                            }}
                        >
                            <Search
                                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6"
                                style={{ color: gold }}
                            />
                            <input
                                type="text"
                                placeholder="Buscar por nombre, ubicación o zona..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-14 pr-6 py-5 text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg font-medium"
                            />
                            <div
                                className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 cursor-pointer transition-all hover:opacity-80"
                                style={{ backgroundColor: `${gold}15`, color: gold }}
                            >
                                <Filter className="w-4 h-4" />
                                Filtros
                            </div>
                        </div>
                    </motion.div>

                    {/* Category Pills */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        transition={{ delay: 0.3 }}
                        className="flex flex-wrap justify-center gap-3"
                    >
                        {categories.map((cat) => (
                            <motion.button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className="px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2"
                                style={{
                                    backgroundColor: selectedCategory === cat ? gold : 'white',
                                    color: selectedCategory === cat ? 'white' : '#374151',
                                    boxShadow: selectedCategory === cat
                                        ? `0 10px 30px ${gold}40`
                                        : '0 4px 15px rgba(0,0,0,0.05)'
                                }}
                                whileHover={{ scale: 1.05, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {categoryConfig[cat].label}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Results Section */}
            <section className="py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header de resultados */}
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <p className="text-gray-500 font-medium">
                                {filteredVenues.length} espacios encontrados
                                {selectedCategory !== 'ALL' && (
                                    <span style={{ color: gold }}> en {categoryConfig[selectedCategory].label}</span>
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2 bg-white rounded-xl p-1" style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                            <button
                                onClick={() => setViewMode('sections')}
                                className="p-2 rounded-lg transition-all"
                                style={{
                                    backgroundColor: viewMode === 'sections' ? gold : 'transparent',
                                    color: viewMode === 'sections' ? 'white' : '#9CA3AF'
                                }}
                            >
                                <LayoutGrid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className="p-2 rounded-lg transition-all"
                                style={{
                                    backgroundColor: viewMode === 'grid' ? gold : 'transparent',
                                    color: viewMode === 'grid' ? 'white' : '#9CA3AF'
                                }}
                            >
                                <Grid3X3 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {selectedCategory === 'ALL' && viewMode === 'sections' ? (
                            // Vista por secciones de categoría
                            <motion.div
                                key="sections"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="space-y-20"
                            >
                                {Object.entries(venuesByCategory).map(([category, categoryVenues]) => (
                                    <motion.div
                                        key={category}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={{ once: true, margin: "-100px" }}
                                        variants={fadeInUp}
                                    >
                                        {/* Header de categoría */}
                                        <div className="flex items-center justify-between mb-8">
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                                                    style={{
                                                        backgroundColor: `${gold}15`,
                                                        boxShadow: `0 8px 25px ${gold}20`
                                                    }}
                                                >
                                                    <Sparkles className="w-6 h-6" style={{ color: gold }} />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-gray-900">
                                                        {categoryConfig[category as VenueCategory].label}
                                                    </h2>
                                                    <p className="text-gray-500 text-sm">
                                                        {categoryVenues.length} espacios disponibles
                                                    </p>
                                                </div>
                                            </div>
                                            <motion.button
                                                onClick={() => setSelectedCategory(category as VenueCategory)}
                                                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                                style={{
                                                    backgroundColor: `${gold}10`,
                                                    color: gold
                                                }}
                                                whileHover={{ backgroundColor: gold, color: 'white' }}
                                            >
                                                Ver todos →
                                            </motion.button>
                                        </div>

                                        {/* Grid de venues */}
                                        <motion.div
                                            variants={staggerContainer}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                        >
                                            {categoryVenues.slice(0, 3).map((venue) => (
                                                <motion.div variants={fadeInUp} key={venue.id}>
                                                    <PropertyCard venue={venue} />
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        ) : (
                            // Vista filtrada por categoría o grid completo
                            <motion.div
                                key="grid"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                {isLoading ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                        {Array.from({ length: 6 }).map((_, i) => (
                                            <VenueCardSkeleton key={i} />
                                        ))}
                                    </div>
                                ) : filteredVenues.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                    >
                                        {filteredVenues.map((venue) => (
                                            <motion.div variants={fadeInUp} key={venue.id}>
                                                <PropertyCard venue={venue} />
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-center py-24"
                                    >
                                        <div
                                            className="w-24 h-24 mx-auto mb-6 rounded-3xl flex items-center justify-center"
                                            style={{ backgroundColor: `${gold}15` }}
                                        >
                                            <MapPin className="w-12 h-12" style={{ color: gold }} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            No se encontraron espacios
                                        </h3>
                                        <p className="text-gray-500 mb-6">
                                            Intenta con otros términos de búsqueda o explora otras categorías
                                        </p>
                                        <button
                                            onClick={() => { setSearchTerm(''); setSelectedCategory('ALL'); }}
                                            className="px-6 py-3 rounded-xl font-bold text-white transition-all"
                                            style={{
                                                backgroundColor: gold,
                                                boxShadow: `0 10px 30px ${gold}40`
                                            }}
                                        >
                                            Ver todos los espacios
                                        </button>
                                    </motion.div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            {/* Decoración inferior */}
            <div
                className="h-1 w-full"
                style={{ background: `linear-gradient(to right, transparent, ${gold}, transparent)` }}
            />
        </div>
    );
};

export default EspaciosPage;
