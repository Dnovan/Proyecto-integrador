/**
 * @fileoverview Página de Detalle del Local
 * @description Vista detallada con galería, información, calendario y reseñas
 * 
 * @iso25010
 * - Usabilidad: Información completa y acciones claras
 * - Eficiencia: Carga diferida de imágenes y datos secundarios
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    MapPin,
    Users,
    Star,
    Heart,
    Share2,
    ChevronLeft,
    ChevronRight,
    X,
    Calendar,
    CreditCard,
    Banknote,
    MessageSquare,
    Check,
} from 'lucide-react';
import { Button } from '../../components/atoms/Button';
import { Card } from '../../components/atoms/Card';
import { Badge } from '../../components/atoms/Badge';
import { Avatar } from '../../components/atoms/Avatar';
import { Skeleton } from '../../components/atoms/Skeleton';
import { StarRating } from '../../components/molecules/StarRating';
import LoginRequiredModal from '../../components/molecules/LoginRequiredModal';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../services/mockApi';
import type { Venue, Review, DateAvailability } from '../../types';

export const VenueDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { isAuthenticated } = useAuth();

    const [venue, setVenue] = useState<Venue | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [availability, setAvailability] = useState<DateAvailability[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showLoginModal, setShowLoginModal] = useState(false);

    // Dynamic Pricing State
    const [guestCount, setGuestCount] = useState<number>(0);
    const [selectedServices, setSelectedServices] = useState<Set<string>>(new Set());
    const [totalPrice, setTotalPrice] = useState<number>(0);

    useEffect(() => {
        const loadData = async () => {
            if (!id) return;

            setIsLoading(true);
            try {
                const [venueData, reviewsData, availabilityData] = await Promise.all([
                    api.getVenueById(id),
                    api.getVenueReviews(id),
                    api.getVenueAvailability(id, currentMonth.getMonth(), currentMonth.getFullYear()),
                ]);
                setVenue(venueData);
                setReviews(reviewsData);
                setAvailability(availabilityData);
                setGuestCount(venueData.capacity); // Initialize with max capacity
            } catch (error) {
                console.error('Error loading venue:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [id, currentMonth]);

    // Calculate total price effect
    useEffect(() => {
        if (!venue) return;

        // Base price calculation (Linear model)
        // User requirement: Max price determines the ceiling.
        // The variation from min guests to max guests should not exceed 3000 MXN.
        // Formula: Price = MaxPrice - (3000 * (1 - occupancyRate))

        const maxDiscount = 3000;
        const occupancyRate = venue.capacity > 0 ? guestCount / venue.capacity : 0;
        const rentalPrice = venue.price - (maxDiscount * (1 - occupancyRate));

        // Add extra services
        let servicesTotal = 0;
        venue.services?.forEach(service => {
            if (selectedServices.has(service.id)) {
                servicesTotal += service.price;
            }
        });

        setTotalPrice(rentalPrice + servicesTotal);

    }, [venue, guestCount, selectedServices]);

    const handleServiceToggle = (serviceId: string) => {
        const newSelected = new Set(selectedServices);
        if (newSelected.has(serviceId)) {
            newSelected.delete(serviceId);
        } else {
            newSelected.add(serviceId);
        }
        setSelectedServices(newSelected);
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const nextImage = () => {
        if (venue) {
            setCurrentImageIndex((prev) => (prev + 1) % venue.images.length);
        }
    };

    const prevImage = () => {
        if (venue) {
            setCurrentImageIndex((prev) => (prev - 1 + venue.images.length) % venue.images.length);
        }
    };

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days = [];

        // Add empty slots for days before first day
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(i);
        }

        return days;
    };

    const isDateAvailable = (day: number): boolean => {
        const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return availability.find((a) => a.date === dateStr)?.isAvailable ?? false;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-bg-primary pt-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <Skeleton variant="rounded" height={500} className="w-full mb-8" />
                    <div className="grid lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <Skeleton variant="text" width="60%" height={40} />
                            <Skeleton variant="text" width="40%" />
                            <Skeleton variant="rounded" height={200} />
                        </div>
                        <div>
                            <Skeleton variant="rounded" height={400} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!venue) {
        return (
            <div className="min-h-screen bg-bg-primary pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-neon mb-4">404</h1>
                    <p className="text-text-secondary mb-6">Local no encontrado</p>
                    <Link to="/">
                        <Button>Volver al inicio</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary pt-16">
            {/* Galería de imágenes */}
            <section className="relative">
                <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[500px]">
                    {/* Imagen principal */}
                    <div
                        className="col-span-2 row-span-2 relative cursor-pointer group"
                        onClick={() => setIsLightboxOpen(true)}
                    >
                        <img
                            src={venue.images[0]}
                            alt={venue.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    </div>

                    {/* Imágenes secundarias */}
                    {venue.images.slice(1, 5).map((img, idx) => (
                        <div
                            key={idx}
                            className="relative cursor-pointer group"
                            onClick={() => {
                                setCurrentImageIndex(idx + 1);
                                setIsLightboxOpen(true);
                            }}
                        >
                            <img
                                src={img}
                                alt={`${venue.name} ${idx + 2}`}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                            {/* Overlay para ver más */}
                            {idx === 3 && venue.images.length > 5 && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <span className="text-white font-semibold">
                                        +{venue.images.length - 5} más
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Botones de acción */}
                <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Share2 className="w-4 h-4" />}
                    >
                        Compartir
                    </Button>
                    <Button
                        variant={isFavorite ? 'primary' : 'secondary'}
                        size="sm"
                        leftIcon={<Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        {isFavorite ? 'Guardado' : 'Guardar'}
                    </Button>
                </div>
            </section>

            {/* Contenido principal */}
            <section className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Información del local */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                {venue.status === 'FEATURED' && (
                                    <Badge variant="neon">Destacado</Badge>
                                )}
                                <Badge>{api.categoryLabels[venue.category]}</Badge>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                                {venue.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-text-secondary">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>{venue.address}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    <span>Hasta {venue.capacity} personas</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-neon fill-current" />
                                    <span className="text-neon font-semibold">{venue.rating.toFixed(1)}</span>
                                    <span>({venue.reviewCount} reseñas)</span>
                                </div>
                            </div>
                        </div>

                        {/* Descripción */}
                        <Card variant="default">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">
                                Descripción del espacio
                            </h2>
                            <p className="text-text-secondary leading-relaxed">
                                {venue.description}
                            </p>
                        </Card>

                        {/* Servicios y Amenidades */}
                        <Card variant="default">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">Servicios y Amenidades</h2>

                            {/* Amenidades Incluidas */}
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-text-muted uppercase mb-3">Amenidades Básicas</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {venue.amenities.map((amenity, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-text-secondary">
                                            <Check className="w-5 h-5 text-neon" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Servicios Extra / Configurable */}
                            {venue.services && venue.services.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-text-muted uppercase mb-3">Servicios Adicionales (Configurables)</h3>
                                    <div className="space-y-3">
                                        {venue.services.map((service) => (
                                            <div
                                                key={service.id}
                                                className={`flex items-center justify-between p-3 rounded-xl border transition-colors cursor-pointer ${(service.isOptional && selectedServices.has(service.id)) || !service.isOptional
                                                    ? 'bg-neon/10 border-neon/30'
                                                    : 'bg-bg-secondary border-transparent hover:border-neon/30'
                                                    }`}
                                                onClick={() => service.isOptional && handleServiceToggle(service.id)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${(service.isOptional && selectedServices.has(service.id)) || !service.isOptional
                                                        ? 'bg-neon border-neon'
                                                        : 'border-text-muted'
                                                        }`}>
                                                        {((service.isOptional && selectedServices.has(service.id)) || !service.isOptional) &&
                                                            <Check className="w-3 h-3 text-bg-primary" />
                                                        }
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-text-primary">{service.name}</p>
                                                        {service.description && (
                                                            <p className="text-xs text-text-muted">{service.description}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    {service.price === 0 ? (
                                                        <span className="text-xs font-bold text-neon bg-neon/10 px-2 py-1 rounded">INCLUIDO</span>
                                                    ) : (
                                                        <p className="font-semibold text-text-primary">+{formatPrice(service.price)}</p>
                                                    )}
                                                    {service.isOptional && (
                                                        <p className="text-xs text-text-muted">Opcional</p>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Métodos de pago */}
                        <Card variant="default">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">
                                Métodos de pago aceptados
                            </h2>
                            <div className="flex gap-4">
                                {venue.paymentMethods.includes('TRANSFERENCIA') && (
                                    <div className="flex items-center gap-2 p-4 bg-bg-secondary rounded-2xl">
                                        <CreditCard className="w-6 h-6 text-neon" />
                                        <span className="text-text-primary">Transferencia bancaria</span>
                                    </div>
                                )}
                                {venue.paymentMethods.includes('EFECTIVO') && (
                                    <div className="flex items-center gap-2 p-4 bg-bg-secondary rounded-2xl">
                                        <Banknote className="w-6 h-6 text-neon" />
                                        <span className="text-text-primary">Efectivo</span>
                                    </div>
                                )}
                            </div>
                        </Card>

                        {/* Calendario */}
                        <Card variant="default">
                            <h2 className="text-xl font-semibold text-text-primary mb-4">
                                <Calendar className="w-5 h-5 inline mr-2" />
                                Disponibilidad
                            </h2>

                            {/* Navegación del mes */}
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                    className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                <span className="text-lg font-semibold text-text-primary">
                                    {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
                                </span>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                    className="p-2 hover:bg-bg-secondary rounded-lg transition-colors"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Días de la semana */}
                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                                    <div key={day} className="text-center text-text-muted text-sm py-2">
                                        {day}
                                    </div>
                                ))}
                            </div>

                            {/* Días del mes */}
                            <div className="grid grid-cols-7 gap-1">
                                {getDaysInMonth(currentMonth).map((day, idx) => (
                                    <div key={idx} className="aspect-square">
                                        {day !== null && (
                                            <button
                                                className={`
                          w-full h-full rounded-lg text-sm font-medium
                          transition-all duration-200
                          ${isDateAvailable(day)
                                                        ? selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                                            ? 'bg-neon text-black'
                                                            : 'bg-neon/10 text-neon hover:bg-neon/20'
                                                        : 'bg-bg-secondary text-text-muted cursor-not-allowed'
                                                    }
                        `}
                                                disabled={!isDateAvailable(day)}
                                                onClick={() => {
                                                    if (isDateAvailable(day)) {
                                                        setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
                                                    }
                                                }}
                                            >
                                                {day}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-neon/10 rounded" />
                                    <span className="text-text-secondary">Disponible</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-bg-secondary rounded" />
                                    <span className="text-text-secondary">No disponible</span>
                                </div>
                            </div>
                        </Card>

                        {/* Reseñas */}
                        <Card variant="default">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-text-primary">
                                    Reseñas ({venue.reviewCount})
                                </h2>
                                <div className="flex items-center gap-2">
                                    <StarRating value={venue.rating} readOnly size="lg" showValue />
                                </div>
                            </div>

                            <div className="space-y-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-neon/10 pb-6 last:border-0">
                                        <div className="flex items-start gap-4">
                                            <Avatar
                                                src={review.userAvatar}
                                                name={review.userName}
                                                size="md"
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div>
                                                        <p className="font-semibold text-text-primary">
                                                            {review.userName}
                                                        </p>
                                                        <p className="text-sm text-text-muted">
                                                            {new Date(review.createdAt).toLocaleDateString('es-MX', {
                                                                month: 'long',
                                                                year: 'numeric',
                                                            })}
                                                        </p>
                                                    </div>
                                                    <StarRating value={review.rating} readOnly size="sm" />
                                                </div>
                                                <p className="text-text-secondary">{review.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar - Card de reservación */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <Card variant="glass" className="border border-neon/30">
                                <div className="text-center mb-6">
                                    <p className="text-sm text-text-muted mb-1">Precio Total Estimado</p>
                                    <p className="text-4xl font-bold text-neon">{formatPrice(totalPrice)}</p>
                                    <p className="text-text-muted text-sm mt-1">por evento</p>
                                </div>

                                {/* Slider de Invitados */}
                                <div className="mb-6">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="text-sm font-medium text-text-secondary">
                                            Invitados
                                        </label>
                                        <span className="text-neon font-bold">{guestCount}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min={1}
                                        max={venue.capacity}
                                        value={guestCount}
                                        onChange={(e) => setGuestCount(Number(e.target.value))}
                                        className="w-full h-2 bg-bg-secondary rounded-lg appearance-none cursor-pointer accent-neon"
                                    />
                                    <div className="flex justify-between mt-1 text-xs text-text-muted">
                                        <span>1</span>
                                        <span>Max: {venue.capacity}</span>
                                    </div>
                                </div>

                                {selectedDate && (
                                    <div className="mb-6 p-3 bg-neon/10 rounded-2xl border border-neon/20">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Calendar className="w-4 h-4 text-neon" />
                                            <span className="text-sm font-semibold text-neon">Fecha seleccionada</span>
                                        </div>
                                        <p className="text-text-primary ml-6">
                                            {new Date(selectedDate + 'T12:00:00').toLocaleDateString('es-MX', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                )}

                                {/* Desglose Rápido */}
                                <div className="space-y-2 mb-6 text-sm">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Renta Base ({guestCount} pers.)</span>
                                        <span>{formatPrice(totalPrice - [...selectedServices].reduce((sum, id) => sum + (venue.services?.find(s => s.id === id)?.price || 0), 0))}</span>
                                    </div>
                                    {selectedServices.size > 0 && (
                                        <div className="flex justify-between text-text-secondary">
                                            <span>Servicios Extra</span>
                                            <span>+{formatPrice([...selectedServices].reduce((sum, id) => sum + (venue.services?.find(s => s.id === id)?.price || 0), 0))}</span>
                                        </div>
                                    )}
                                    <div className="border-t border-neon/10 my-2 pt-2 flex justify-between font-bold text-text-primary">
                                        <span>Total</span>
                                        <span>{formatPrice(totalPrice)}</span>
                                    </div>
                                </div>

                                <Button
                                    fullWidth
                                    size="lg"
                                    disabled={!selectedDate}
                                    className="mb-3"
                                    onClick={() => {
                                        if (!isAuthenticated) {
                                            setShowLoginModal(true);
                                        } else {
                                            // TODO: Proceed with booking
                                            console.log('Booking for date:', selectedDate);
                                        }
                                    }}
                                >
                                    Solicitar Reservación
                                </Button>

                                <Button
                                    variant="outline"
                                    fullWidth
                                    leftIcon={<MessageSquare className="w-5 h-5" />}
                                >
                                    Contactar Proveedor
                                </Button>

                                <div className="mt-6 pt-6 border-t border-neon/10">
                                    <div className="flex items-center gap-3">
                                        <Avatar name={venue.providerName} size="md" />
                                        <div>
                                            <p className="font-semibold text-text-primary">
                                                {venue.providerName}
                                            </p>
                                            <p className="text-sm text-text-muted">Proveedor verificado</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Lightbox */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
                    <button
                        className="absolute top-4 right-4 p-2 text-white hover:text-neon transition-colors"
                        onClick={() => setIsLightboxOpen(false)}
                    >
                        <X className="w-8 h-8" />
                    </button>

                    <button
                        className="absolute left-4 p-2 text-white hover:text-neon transition-colors"
                        onClick={prevImage}
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    <img
                        src={venue.images[currentImageIndex]}
                        alt={`${venue.name} ${currentImageIndex + 1}`}
                        className="max-h-[90vh] max-w-[90vw] object-contain"
                    />

                    <button
                        className="absolute right-4 p-2 text-white hover:text-neon transition-colors"
                        onClick={nextImage}
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Indicadores */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {venue.images.map((_, idx) => (
                            <button
                                key={idx}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-neon w-4' : 'bg-white/50'
                                    }`}
                                onClick={() => setCurrentImageIndex(idx)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Login Required Modal */}
            <LoginRequiredModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
                action="solicitar una reservación"
            />
        </div>
    );
};

export default VenueDetailPage;
