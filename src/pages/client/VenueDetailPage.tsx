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

                        {/* Servicios y Amenidades - Two Column Layout with Booking */}
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                            {/* Header con gradiente dorado */}
                            <div className="px-6 py-5" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #B8941F 100%)' }}>
                                <h2 className="text-xl font-bold text-white">Servicios y Amenidades</h2>
                                <p className="text-white/80 text-sm mt-1">Selecciona los servicios adicionales para tu evento</p>
                            </div>

                            <div className="bg-white p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-8">
                                        {/* Amenidades Básicas */}
                                        <div>
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#D4AF37' }} />
                                                <h3 className="text-lg font-bold text-gray-900">Amenidades Básicas</h3>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                {venue.amenities.map((amenity, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-gray-700">
                                                        <Check className="w-5 h-5" style={{ color: '#D4AF37' }} />
                                                        <span className="font-medium">{amenity}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Servicios Adicionales */}
                                        {venue.services && venue.services.length > 0 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-4">
                                                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#D4AF37' }} />
                                                    <h3 className="text-lg font-bold text-gray-900">Servicios Adicionales (Configurables)</h3>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {venue.services.map((service) => {
                                                        const isSelected = (service.isOptional && selectedServices.has(service.id)) || !service.isOptional;
                                                        const isIncluded = !service.isOptional || service.price === 0;
                                                        return (
                                                            <div
                                                                key={service.id}
                                                                className={`flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer ${isSelected ? 'shadow-md' : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'}`}
                                                                style={isSelected ? { backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '2px solid rgba(212, 175, 55, 0.4)' } : {}}
                                                                onClick={() => service.isOptional && handleServiceToggle(service.id)}
                                                            >
                                                                <div className="flex-1 pr-3">
                                                                    <div className="flex items-center gap-2 flex-wrap">
                                                                        <p className="font-bold text-gray-900 leading-tight">{service.name}</p>
                                                                        {isIncluded && <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">Incluido</span>}
                                                                    </div>
                                                                    {service.description && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{service.description}</p>}

                                                                    <div className="mt-2">
                                                                        {isIncluded ? (
                                                                            <span className="text-xs font-bold text-[#D4AF37]">INCLUIDO</span>
                                                                        ) : (
                                                                            <span className="text-xs font-bold text-gray-700">+{formatPrice(service.price)}</span>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className={`w-6 h-6 flex-shrink-0 rounded-full flex items-center justify-center border-2 ${isSelected ? 'border-transparent' : 'border-gray-300 bg-white'}`} style={isSelected ? { backgroundColor: '#D4AF37' } : {}}>
                                                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* RIGHT - Booking Panel + Calendar */}
                                    <div className="space-y-6">
                                        {/* Booking Card */}
                                        <div className="p-5 rounded-2xl border-2" style={{ borderColor: 'rgba(212, 175, 55, 0.3)', backgroundColor: 'rgba(212, 175, 55, 0.05)' }}>
                                            <div className="text-center mb-5">
                                                <p className="text-sm text-gray-500 mb-1">Precio Total Estimado</p>
                                                <p className="text-3xl font-bold" style={{ color: '#D4AF37' }}>{formatPrice(totalPrice)}</p>
                                                <p className="text-gray-500 text-sm mt-1">por evento</p>
                                            </div>

                                            <div className="mb-5">
                                                <div className="flex justify-between items-center mb-2">
                                                    <label className="text-sm font-medium text-gray-700">Invitados</label>
                                                    <span className="font-bold" style={{ color: '#D4AF37' }}>{guestCount}</span>
                                                </div>
                                                <input type="range" min={1} max={venue.capacity} value={guestCount} onChange={(e) => setGuestCount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg cursor-pointer" style={{ accentColor: '#D4AF37' }} />
                                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                                    <span>1</span>
                                                    <span>Max: {venue.capacity}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 mb-5 text-sm">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Renta Base ({guestCount} pers.)</span>
                                                    <span>{formatPrice(totalPrice - [...selectedServices].reduce((sum, id) => sum + (venue.services?.find(s => s.id === id)?.price || 0), 0))}</span>
                                                </div>
                                                {selectedServices.size > 0 && (
                                                    <div className="flex justify-between text-gray-600">
                                                        <span>Servicios Extra</span>
                                                        <span>+{formatPrice([...selectedServices].reduce((sum, id) => sum + (venue.services?.find(s => s.id === id)?.price || 0), 0))}</span>
                                                    </div>
                                                )}
                                                <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold text-gray-900">
                                                    <span>Total</span>
                                                    <span>{formatPrice(totalPrice)}</span>
                                                </div>
                                            </div>

                                            <Button fullWidth size="lg" disabled={!selectedDate} className="mb-3" onClick={() => { if (!isAuthenticated) { setShowLoginModal(true); } else { console.log('Booking:', selectedDate); } }}>
                                                Solicitar Reservación
                                            </Button>

                                            <Button variant="outline" fullWidth leftIcon={<MessageSquare className="w-5 h-5" />}>
                                                Contactar Proveedor
                                            </Button>

                                            <div className="mt-5 pt-5 border-t border-gray-200">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={venue.providerName} size="md" />
                                                    <div>
                                                        <p className="font-semibold text-gray-900">{venue.providerName}</p>
                                                        <p className="text-sm text-gray-500">Proveedor verificado</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mini Calendar */}
                                        <div className="p-4 rounded-2xl border border-gray-200 bg-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="font-bold text-gray-900 text-sm">Disponibilidad - {currentMonth.toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}</h4>
                                                <div className="flex gap-1">
                                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))} className="p-1 hover:bg-gray-100 rounded">
                                                        <ChevronLeft className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))} className="p-1 hover:bg-gray-100 rounded">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                                {['Lu', 'Ma', 'Ma', 'Ju', 'Ve', 'Sa', 'So'].map((d, i) => (
                                                    <div key={i} className="text-gray-400 font-medium py-1">{d}</div>
                                                ))}
                                                {getDaysInMonth(currentMonth).map((day, idx) => (
                                                    <div key={idx}>
                                                        {day !== null ? (
                                                            <button
                                                                className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${isDateAvailable(day)
                                                                    ? selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                                                                        ? 'text-white'
                                                                        : 'text-gray-700 hover:bg-gray-100'
                                                                    : 'text-gray-300 cursor-not-allowed'
                                                                    }`}
                                                                style={selectedDate === `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ? { backgroundColor: '#D4AF37' } : {}}
                                                                disabled={!isDateAvailable(day)}
                                                                onClick={() => isDateAvailable(day) && setSelectedDate(`${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                                                            >
                                                                {day}
                                                            </button>
                                                        ) : <div className="w-7 h-7" />}
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: '#D4AF37' }} />
                                                    <span className="text-gray-500">Disponible</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <div className="w-3 h-3 bg-gray-200 rounded-full" />
                                                    <span className="text-gray-500">No disponible</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

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
