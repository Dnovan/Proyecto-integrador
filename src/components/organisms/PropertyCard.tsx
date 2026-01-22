/**
 * @fileoverview Componente PropertyCard - Organismo
 * @description Tarjeta de presentación de un local/venue
 * 
 * @iso25010
 * - Usabilidad: Información esencial visible de un vistazo
 * - Eficiencia: Lazy loading de imágenes
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Heart, Star, Sparkles } from 'lucide-react';
import { Card } from '../atoms/Card';
import { Badge } from '../atoms/Badge';
import type { Venue } from '../../types';
import { categoryLabels } from '../../services/mockApi';

interface PropertyCardProps {
    /** Datos del local */
    venue: Venue;
    /** Mostrar como favorito */
    isFavorite?: boolean;
    /** Callback al marcar favorito */
    onFavoriteToggle?: (venueId: string) => void;
}

/**
 * Tarjeta de local con imagen, info y acciones
 * 
 * @example
 * ```tsx
 * <PropertyCard
 *   venue={venue}
 *   isFavorite={favorites.includes(venue.id)}
 *   onFavoriteToggle={handleFavoriteToggle}
 * />
 * ```
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({
    venue,
    isFavorite = false,
    onFavoriteToggle,
}) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
            <Card
                variant="default"
                padding="none"
                hoverable
                glowOnHover
                className="overflow-hidden group"
            >
                {/* Imagen */}
                <div
                    className="relative aspect-[4/3] overflow-hidden"
                    onMouseEnter={handleImageHover}
                >
                    {/* Skeleton mientras carga */}
                    {!imageLoaded && (
                        <div className="absolute inset-0 bg-bg-card animate-pulse" />
                    )}

                    <img
                        src={venue.images[currentImageIndex]}
                        alt={venue.name}
                        className={`
              w-full h-full object-cover
              transition-all duration-500
              group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
                        onLoad={() => setImageLoaded(true)}
                        loading="lazy"
                    />

                    {/* Overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {venue.status === 'FEATURED' && (
                            <Badge variant="neon" icon={<Sparkles className="w-3 h-3" />}>
                                Destacado
                            </Badge>
                        )}
                        <Badge variant="default">
                            {categoryLabels[venue.category]}
                        </Badge>
                    </div>

                    {/* Botón favorito */}
                    <button
                        onClick={handleFavoriteClick}
                        className={`
              absolute top-3 right-3 p-2 rounded-full
              transition-all duration-300
              ${isFavorite
                                ? 'bg-neon text-black'
                                : 'bg-black/50 text-white hover:bg-neon hover:text-black'
                            }
            `}
                        aria-label={isFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos'}
                    >
                        <Heart
                            className="w-5 h-5"
                            fill={isFavorite ? 'currentColor' : 'none'}
                        />
                    </button>

                    {/* Indicadores de imagen */}
                    {venue.images.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
                            {venue.images.slice(0, 5).map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`
                    w-1.5 h-1.5 rounded-full transition-all
                    ${idx === currentImageIndex ? 'bg-neon w-3' : 'bg-white/50'}
                  `}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Contenido */}
                <div className="p-4 space-y-3">
                    {/* Título y rating */}
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-text-primary text-lg line-clamp-1 group-hover:text-neon transition-colors">
                            {venue.name}
                        </h3>
                        <div className="flex items-center gap-1 text-neon flex-shrink-0">
                            <Star className="w-4 h-4 fill-current" />
                            <span className="font-medium">{venue.rating.toFixed(1)}</span>
                        </div>
                    </div>

                    {/* Ubicación */}
                    <div className="flex items-center gap-1 text-text-secondary text-sm">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{venue.zone}</span>
                    </div>

                    {/* Capacidad y precio */}
                    <div className="flex items-center justify-between pt-2 border-t border-neon/10">
                        <div className="flex items-center gap-1 text-text-muted text-sm">
                            <Users className="w-4 h-4" />
                            <span>Hasta {venue.capacity}</span>
                        </div>
                        <div className="text-right">
                            <p className="text-neon font-bold text-lg">
                                {formatPrice(venue.price)}
                            </p>
                            <p className="text-text-muted text-xs">por evento</p>
                        </div>
                    </div>
                </div>
            </Card>
        </Link>
    );
};

export default PropertyCard;
