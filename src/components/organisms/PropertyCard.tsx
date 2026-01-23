/**
 * @fileoverview Componente PropertyCard - Organismo
 * @description Tarjeta de presentación de un local/venue con diseño premium
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Star, Sparkles, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Venue } from '../../types';
import { categoryLabels } from '../../services/mockApi';

const gold = '#D4AF37';

interface PropertyCardProps {
    venue: Venue;
    isFavorite?: boolean;
    onFavoriteToggle?: (venueId: string) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
    venue,
    isFavorite = false,
    onFavoriteToggle,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onFavoriteToggle?.(venue.id);
    };

    const handleImageHover = () => {
        if (venue.images.length > 1) {
            setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <Link to={`/local/${venue.id}`}>
            <motion.div
                className="group relative bg-white rounded-3xl overflow-hidden cursor-pointer"
                style={{
                    boxShadow: isHovered
                        ? `0 25px 50px -12px ${gold}30, 0 0 0 1px ${gold}40`
                        : '0 10px 40px -15px rgba(0,0,0,0.1), 0 0 0 1px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* Imagen Container */}
                <div
                    className="relative aspect-[4/3] overflow-hidden"
                    onMouseEnter={handleImageHover}
                >
                    {/* Skeleton mientras carga */}
                    {!imageLoaded && (
                        <div
                            className="absolute inset-0 animate-pulse"
                            style={{ backgroundColor: `${gold}15` }}
                        />
                    )}

                    <img
                        src={venue.images[currentImageIndex]}
                        alt={venue.name}
                        className={`
                            w-full h-full object-cover
                            transition-all duration-700 ease-out
                            ${isHovered ? 'scale-110' : 'scale-100'}
                            ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                        `}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Overlay gradient mejorado */}
                    <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                            background: `linear-gradient(
                                to top,
                                rgba(0,0,0,0.7) 0%,
                                rgba(0,0,0,0.3) 30%,
                                transparent 60%,
                                rgba(0,0,0,0.2) 100%
                            )`
                        }}
                    />

                    {/* Badges superiores */}
                    <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {venue.status === 'FEATURED' && (
                            <motion.span
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-bold rounded-full shadow-lg"
                                style={{
                                    backgroundColor: gold,
                                    boxShadow: `0 4px 15px ${gold}50`
                                }}
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Destacado
                            </motion.span>
                        )}
                        <span
                            className="px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-md"
                            style={{
                                backgroundColor: 'rgba(255,255,255,0.9)',
                                color: '#374151'
                            }}
                        >
                            {categoryLabels[venue.category]}
                        </span>
                    </div>

                    {/* Botón favorito con animación */}
                    <motion.button
                        onClick={handleFavoriteClick}
                        className="absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300"
                        style={{
                            backgroundColor: isFavorite ? gold : 'rgba(255,255,255,0.9)',
                            boxShadow: isFavorite ? `0 4px 15px ${gold}50` : '0 4px 15px rgba(0,0,0,0.1)'
                        }}
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <Heart
                            className="w-5 h-5 transition-colors"
                            style={{ color: isFavorite ? 'white' : '#9CA3AF' }}
                            fill={isFavorite ? 'currentColor' : 'none'}
                        />
                    </motion.button>

                    {/* Info overlay en hover */}
                    <motion.div
                        className="absolute bottom-4 left-4 right-4 flex items-center justify-between"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="flex items-center gap-2 text-white/90 text-sm">
                            <Eye className="w-4 h-4" />
                            <span>{venue.views.toLocaleString()} vistas</span>
                        </div>
                        <div className="flex items-center gap-1 text-white/90 text-sm">
                            <Heart className="w-4 h-4" />
                            <span>{venue.favorites}</span>
                        </div>
                    </motion.div>

                    {/* Indicadores de imagen */}
                    {venue.images.length > 1 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                            {venue.images.slice(0, 5).map((_, idx) => (
                                <motion.div
                                    key={idx}
                                    className="h-1.5 rounded-full transition-all duration-300"
                                    style={{
                                        width: idx === currentImageIndex ? 20 : 6,
                                        backgroundColor: idx === currentImageIndex ? gold : 'rgba(255,255,255,0.5)'
                                    }}
                                    animate={{
                                        scale: idx === currentImageIndex ? 1 : 0.8
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Contenido de la tarjeta */}
                <div className="p-5 space-y-4">
                    {/* Título y rating */}
                    <div className="flex items-start justify-between gap-3">
                        <h3
                            className="font-bold text-gray-900 text-lg leading-tight line-clamp-1 transition-colors duration-300"
                            style={{ color: isHovered ? gold : '#111827' }}
                        >
                            {venue.name}
                        </h3>
                        <div
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: `${gold}15` }}
                        >
                            <Star className="w-4 h-4" style={{ color: gold, fill: gold }} />
                            <span className="font-bold text-sm" style={{ color: gold }}>
                                {venue.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    {/* Ubicación con icono mejorado */}
                    <div className="flex items-center gap-2 text-gray-500">
                        <div
                            className="p-1.5 rounded-lg"
                            style={{ backgroundColor: `${gold}10` }}
                        >
                            <MapPin className="w-4 h-4" style={{ color: gold }} />
                        </div>
                        <span className="text-sm font-medium line-clamp-1">{venue.zone} • {venue.address.split(',')[0]}</span>
                    </div>

                    {/* Separador elegante */}
                    <div
                        className="h-px w-full"
                        style={{ background: `linear-gradient(to right, transparent, ${gold}30, transparent)` }}
                    />

                    {/* Capacidad y precio */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-gray-500">
                            <div
                                className="p-1.5 rounded-lg"
                                style={{ backgroundColor: `${gold}10` }}
                            >
                                <Users className="w-4 h-4" style={{ color: gold }} />
                            </div>
                            <span className="text-sm font-medium">Hasta {venue.capacity} personas</span>
                        </div>
                        <div className="text-right">
                            <p className="font-black text-xl" style={{ color: gold }}>
                                {formatPrice(venue.price)}
                            </p>
                            <p className="text-gray-400 text-xs font-medium">por evento</p>
                        </div>
                    </div>

                    {/* Amenidades preview (solo en hover) */}
                    <motion.div
                        className="flex flex-wrap gap-1.5 pt-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{
                            opacity: isHovered ? 1 : 0,
                            height: isHovered ? 'auto' : 0
                        }}
                        transition={{ duration: 0.3 }}
                    >
                        {venue.amenities.slice(0, 4).map((amenity, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-1 text-xs font-medium rounded-md"
                                style={{
                                    backgroundColor: `${gold}10`,
                                    color: '#6B7280'
                                }}
                            >
                                {amenity}
                            </span>
                        ))}
                        {venue.amenities.length > 4 && (
                            <span
                                className="px-2 py-1 text-xs font-bold rounded-md"
                                style={{
                                    backgroundColor: gold,
                                    color: 'white'
                                }}
                            >
                                +{venue.amenities.length - 4}
                            </span>
                        )}
                    </motion.div>
                </div>

                {/* Brillo decorativo en esquina */}
                <div
                    className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-20 pointer-events-none"
                    style={{
                        background: `radial-gradient(circle, ${gold} 0%, transparent 70%)`,
                        opacity: isHovered ? 0.3 : 0.1
                    }}
                />
            </motion.div>
        </Link>
    );
};

export default PropertyCard;
