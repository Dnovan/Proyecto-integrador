/**
 * @fileoverview Servicio API para EventSpace con soporte Supabase
 * @description API que puede usar datos mock o Supabase según configuración
 * 
 * @iso25010
 * - Mantenibilidad: Abstracción que permite cambiar entre mock y producción
 * - Seguridad: Autenticación integrada con Supabase
 */

import { supabase, isSupabaseConfigured, handleSupabaseError } from './supabaseClient';
import type {
    User,
    Venue,
    Booking,
    Review,
    FAQItem,
    ProviderMetrics,
    AdminMetrics,
    LoginCredentials,
    RegisterData,
    SearchFilters,
} from '../types';

// ==================== MOCK DATA (fallback) ====================
import * as mockApi from './mockApi';

// ==================== HELPERS ====================

/**
 * Determina si usar Supabase o datos mock
 */
const useSupabase = (): boolean => isSupabaseConfigured();

// ==================== AUTH API ====================

/**
 * Inicia sesión con email y contraseña
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
    if (!useSupabase()) {
        return mockApi.login(credentials);
    }

    // Buscar usuario por email
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', credentials.email)
        .single();

    if (error || !data) {
        throw new Error('Credenciales inválidas');
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = data as any;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: new Date(user.created_at),
        verificationStatus: user.verification_status,
    };
};

/**
 * Registra un nuevo cliente
 */
export const register = async (data: RegisterData): Promise<User> => {
    if (!useSupabase()) {
        return mockApi.register(data);
    }

    const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();

    if (existingUser) {
        throw new Error('El email ya está registrado');
    }

    // Crear usuario (en producción usar Supabase Auth y bcrypt)
    const { data: newUser, error } = await supabase
        .from('users')
        .insert([{
            email: data.email,
            password_hash: data.password, // TODO: Hash con bcrypt en producción
            name: data.name,
            phone: data.phone || null,
            role: 'CLIENTE',
        }])
        .select()
        .single();

    if (error) {
        throw new Error(handleSupabaseError(error));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const user = newUser as any;

    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatar: user.avatar,
        phone: user.phone,
        createdAt: new Date(user.created_at),
        verificationStatus: user.verification_status,
    };
};

/**
 * Cierra sesión
 */
export const logout = async (): Promise<void> => {
    if (!useSupabase()) {
        return mockApi.logout();
    }
    // Limpiar sesión local
};

// ==================== VENUES API ====================

/**
 * Obtiene lista de locales con filtros opcionales
 */
export const getVenues = async (filters?: SearchFilters): Promise<Venue[]> => {
    if (!useSupabase()) {
        const result = await mockApi.getVenues(filters);
        // mockApi.getVenues returns PaginatedResponse, we need just the data array
        return Array.isArray(result) ? result : result.data;
    }

    let query = supabase
        .from('venues')
        .select('*')
        .in('status', ['ACTIVE', 'FEATURED'])
        .order('created_at', { ascending: false });

    if (filters?.zone) {
        query = query.eq('zone', filters.zone);
    }
    if (filters?.category) {
        query = query.eq('category', filters.category);
    }
    if (filters?.priceMin) {
        query = query.gte('price', filters.priceMin);
    }
    if (filters?.priceMax) {
        query = query.lte('price', filters.priceMax);
    }
    if (filters?.capacity) {
        query = query.gte('capacity', filters.capacity);
    }
    if (filters?.query) {
        query = query.or(`name.ilike.%${filters.query}%,description.ilike.%${filters.query}%`);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(handleSupabaseError(error));
    }

    // Map venues from database format
    return Promise.all((data || []).map(async (v) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const venue = v as any;

        // Get related data
        const [imagesRes, amenitiesRes, paymentRes, providerRes] = await Promise.all([
            supabase.from('venue_images').select('url').eq('venue_id', venue.id).order('display_order'),
            supabase.from('venue_amenities').select('name').eq('venue_id', venue.id),
            supabase.from('venue_payment_methods').select('method').eq('venue_id', venue.id),
            supabase.from('users').select('name').eq('id', venue.provider_id).single(),
        ]);

        return {
            id: venue.id,
            providerId: venue.provider_id,
            providerName: (providerRes.data as { name: string } | null)?.name || 'Proveedor',
            name: venue.name,
            description: venue.description,
            address: venue.address,
            zone: venue.zone,
            category: venue.category,
            price: Number(venue.price),
            capacity: venue.capacity,
            images: (imagesRes.data || []).map((img: { url: string }) => img.url),
            paymentMethods: (paymentRes.data || []).map((pm: { method: string }) => pm.method as 'TRANSFERENCIA' | 'EFECTIVO'),
            amenities: (amenitiesRes.data || []).map((a: { name: string }) => a.name),
            status: venue.status,
            rating: Number(venue.rating),
            reviewCount: venue.review_count,
            views: venue.views,
            favorites: venue.favorites,
            createdAt: new Date(venue.created_at),
            updatedAt: new Date(venue.updated_at),
        } as Venue;
    }));
};

/**
 * Obtiene un local por ID
 */
export const getVenueById = async (id: string): Promise<Venue | null> => {
    if (!useSupabase()) {
        return mockApi.getVenueById(id);
    }

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('id', id)
        .single();

    if (error || !data) {
        return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const venue = data as any;

    // Incrementar vistas
    await supabase
        .from('venues')
        .update({ views: (venue.views || 0) + 1 })
        .eq('id', id);

    // Get related data
    const [imagesRes, amenitiesRes, paymentRes, providerRes] = await Promise.all([
        supabase.from('venue_images').select('url').eq('venue_id', venue.id).order('display_order'),
        supabase.from('venue_amenities').select('name').eq('venue_id', venue.id),
        supabase.from('venue_payment_methods').select('method').eq('venue_id', venue.id),
        supabase.from('users').select('name').eq('id', venue.provider_id).single(),
    ]);

    return {
        id: venue.id,
        providerId: venue.provider_id,
        providerName: (providerRes.data as { name: string } | null)?.name || 'Proveedor',
        name: venue.name,
        description: venue.description,
        address: venue.address,
        zone: venue.zone,
        category: venue.category,
        price: Number(venue.price),
        capacity: venue.capacity,
        images: (imagesRes.data || []).map((img: { url: string }) => img.url),
        paymentMethods: (paymentRes.data || []).map((pm: { method: string }) => pm.method as 'TRANSFERENCIA' | 'EFECTIVO'),
        amenities: (amenitiesRes.data || []).map((a: { name: string }) => a.name),
        status: venue.status,
        rating: Number(venue.rating),
        reviewCount: venue.review_count,
        views: venue.views,
        favorites: venue.favorites,
        createdAt: new Date(venue.created_at),
        updatedAt: new Date(venue.updated_at),
    };
};

/**
 * Obtiene locales recomendados (destacados)
 */
export const getRecommendedVenues = async (): Promise<Venue[]> => {
    if (!useSupabase()) {
        return mockApi.getRecommendedVenues();
    }

    const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('status', 'FEATURED')
        .order('rating', { ascending: false })
        .limit(6);

    if (error) {
        return [];
    }

    return Promise.all((data || []).map(async (v) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const venue = v as any;

        const [imagesRes, amenitiesRes, paymentRes, providerRes] = await Promise.all([
            supabase.from('venue_images').select('url').eq('venue_id', venue.id).order('display_order'),
            supabase.from('venue_amenities').select('name').eq('venue_id', venue.id),
            supabase.from('venue_payment_methods').select('method').eq('venue_id', venue.id),
            supabase.from('users').select('name').eq('id', venue.provider_id).single(),
        ]);

        return {
            id: venue.id,
            providerId: venue.provider_id,
            providerName: (providerRes.data as { name: string } | null)?.name || 'Proveedor',
            name: venue.name,
            description: venue.description,
            address: venue.address,
            zone: venue.zone,
            category: venue.category,
            price: Number(venue.price),
            capacity: venue.capacity,
            images: (imagesRes.data || []).map((img: { url: string }) => img.url),
            paymentMethods: (paymentRes.data || []).map((pm: { method: string }) => pm.method as 'TRANSFERENCIA' | 'EFECTIVO'),
            amenities: (amenitiesRes.data || []).map((a: { name: string }) => a.name),
            status: venue.status,
            rating: Number(venue.rating),
            reviewCount: venue.review_count,
            views: venue.views,
            favorites: venue.favorites,
            createdAt: new Date(venue.created_at),
            updatedAt: new Date(venue.updated_at),
        } as Venue;
    }));
};

/**
 * Obtiene locales vistos recientemente
 */
export const getRecentlyViewed = async (userId?: string): Promise<Venue[]> => {
    if (!useSupabase() || !userId) {
        return mockApi.getRecentlyViewed();
    }

    const { data: recentlyViewed, error } = await supabase
        .from('user_recently_viewed')
        .select('venue_id')
        .eq('user_id', userId)
        .order('viewed_at', { ascending: false })
        .limit(5);

    if (error || !recentlyViewed?.length) {
        return [];
    }

    const venueIds = recentlyViewed.map((rv: { venue_id: string }) => rv.venue_id);
    const venues = await Promise.all(venueIds.map(id => getVenueById(id)));
    return venues.filter((v): v is Venue => v !== null);
};

// ==================== REVIEWS API ====================

/**
 * Obtiene reseñas de un local
 */
export const getVenueReviews = async (venueId: string): Promise<Review[]> => {
    if (!useSupabase()) {
        return mockApi.getVenueReviews(venueId);
    }

    const { data, error } = await supabase
        .from('reviews')
        .select(`*, users:user_id (name, avatar)`)
        .eq('venue_id', venueId)
        .order('created_at', { ascending: false });

    if (error) {
        return [];
    }

    return (data || []).map((review) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = review as any;
        return {
            id: r.id,
            venueId: r.venue_id,
            userId: r.user_id,
            userName: r.users?.name || 'Usuario',
            userAvatar: r.users?.avatar,
            rating: r.rating,
            comment: r.comment,
            createdAt: new Date(r.created_at),
        };
    });
};

// ==================== BOOKINGS API ====================

/**
 * Obtiene reservaciones del usuario
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    if (!useSupabase()) {
        return mockApi.getUserBookings(userId);
    }

    const { data, error } = await supabase
        .from('bookings')
        .select(`*, venues:venue_id (name)`)
        .eq('client_id', userId)
        .order('date', { ascending: false });

    if (error) {
        return [];
    }

    return Promise.all((data || []).map(async (booking) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b = booking as any;

        const { data: images } = await supabase
            .from('venue_images')
            .select('url')
            .eq('venue_id', b.venue_id)
            .order('display_order')
            .limit(1);

        return {
            id: b.id,
            venueId: b.venue_id,
            venueName: b.venues?.name || 'Local',
            venueImage: (images as { url: string }[] | null)?.[0]?.url || '',
            clientId: b.client_id,
            clientName: '',
            providerId: b.provider_id,
            date: b.date,
            status: b.status,
            totalPrice: Number(b.total_price),
            paymentMethod: b.payment_method,
            createdAt: new Date(b.created_at),
            notes: b.notes,
        };
    }));
};

/**
 * Obtiene reservaciones del proveedor
 */
export const getProviderBookings = async (providerId: string): Promise<Booking[]> => {
    if (!useSupabase()) {
        return mockApi.getProviderBookings(providerId);
    }

    const { data, error } = await supabase
        .from('bookings')
        .select(`*, venues:venue_id (name), users:client_id (name)`)
        .eq('provider_id', providerId)
        .order('date', { ascending: false });

    if (error) {
        return [];
    }

    return Promise.all((data || []).map(async (booking) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const b = booking as any;

        const { data: images } = await supabase
            .from('venue_images')
            .select('url')
            .eq('venue_id', b.venue_id)
            .order('display_order')
            .limit(1);

        return {
            id: b.id,
            venueId: b.venue_id,
            venueName: b.venues?.name || 'Local',
            venueImage: (images as { url: string }[] | null)?.[0]?.url || '',
            clientId: b.client_id,
            clientName: b.users?.name || 'Cliente',
            providerId: b.provider_id,
            date: b.date,
            status: b.status,
            totalPrice: Number(b.total_price),
            paymentMethod: b.payment_method,
            createdAt: new Date(b.created_at),
            notes: b.notes,
        };
    }));
};

// ==================== FAQs API ====================

/**
 * Obtiene preguntas frecuentes
 */
export const getFAQs = async (): Promise<FAQItem[]> => {
    if (!useSupabase()) {
        return mockApi.getFAQs();
    }

    const { data, error } = await supabase
        .from('faqs')
        .select('*');

    if (error) {
        return [];
    }

    return (data || []).map((faq) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const f = faq as any;
        return {
            id: f.id,
            question: f.question,
            answer: f.answer,
            category: f.category,
        };
    });
};

// ==================== METRICS API ====================

/**
 * Obtiene métricas del proveedor
 */
export const getProviderMetrics = async (providerId: string): Promise<ProviderMetrics> => {
    if (!useSupabase()) {
        return mockApi.getProviderMetrics(providerId);
    }

    const { data: venues } = await supabase
        .from('venues')
        .select('views, favorites')
        .eq('provider_id', providerId);

    const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('provider_id', providerId);

    const venueList = (venues || []) as { views: number; favorites: number }[];
    const totalViews = venueList.reduce((sum, v) => sum + (v.views || 0), 0);
    const totalFavorites = venueList.reduce((sum, v) => sum + (v.favorites || 0), 0);

    return {
        totalViews,
        totalReservations: (bookings || []).length,
        totalFavorites,
        totalMessages: 0,
        viewsChange: 12.5,
        reservationsChange: 8.3,
        favoritesChange: 15.2,
        messagesChange: 5.0,
    };
};

/**
 * Obtiene métricas de administración
 */
export const getAdminMetrics = async (): Promise<AdminMetrics> => {
    if (!useSupabase()) {
        return mockApi.getAdminMetrics();
    }

    const [usersResult, venuesResult, bookingsResult] = await Promise.all([
        supabase.from('users').select('id, role'),
        supabase.from('venues').select('id'),
        supabase.from('bookings').select('id, status, total_price'),
    ]);

    const users = (usersResult.data || []) as { id: string; role: string }[];
    const venues = (venuesResult.data || []) as { id: string }[];
    const bookings = (bookingsResult.data || []) as { id: string; status: string; total_price: number }[];

    return {
        totalUsers: users.length,
        totalClients: users.filter(u => u.role === 'CLIENTE').length,
        totalProviders: users.filter(u => u.role === 'PROVEEDOR').length,
        totalVenues: venues.length,
        totalBookings: bookings.length,
        completedBookings: bookings.filter(b => b.status === 'COMPLETED').length,
        revenue: bookings
            .filter(b => b.status === 'COMPLETED')
            .reduce((sum, b) => sum + Number(b.total_price || 0), 0),
        userGrowth: [],
        bookingsByMonth: [],
    };
};

// ==================== RE-EXPORT MOCK FUNCTIONS ====================
// Para funciones que aún no tienen implementación de Supabase

export {
    getVenueAvailability,
    getConversations,
    getMessages,
    sendMessage,
    createBooking,
    getAllUsers,
    getAllVenues,
    createProvider,
    updateVenueStatus,
    getProviderVenues,
} from './mockApi';

// Re-export zones and categories
export { zones, categoryLabels } from './mockApi';
