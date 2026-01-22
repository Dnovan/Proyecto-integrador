/**
 * @fileoverview Tipos generados para la base de datos de Supabase
 * @description Define la estructura de la base de datos para TypeScript
 */

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[];

export type Database = {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string;
                    email: string;
                    password_hash: string;
                    name: string;
                    phone: string | null;
                    avatar: string | null;
                    role: 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';
                    verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
                    ine_document_id: string | null;
                    created_at: string;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    email: string;
                    password_hash: string;
                    name: string;
                    phone?: string | null;
                    avatar?: string | null;
                    role?: 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';
                    verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
                    ine_document_id?: string | null;
                    created_at?: string;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    email?: string;
                    password_hash?: string;
                    name?: string;
                    phone?: string | null;
                    avatar?: string | null;
                    role?: 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';
                    verification_status?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
                    ine_document_id?: string | null;
                    created_at?: string;
                    updated_at?: string | null;
                };
            };
            venues: {
                Row: {
                    id: string;
                    provider_id: string;
                    name: string;
                    description: string;
                    address: string;
                    zone: string;
                    category: 'SALON_EVENTOS' | 'JARDIN' | 'TERRAZA' | 'HACIENDA' | 'BODEGA' | 'RESTAURANTE' | 'HOTEL';
                    price: number;
                    capacity: number;
                    status: 'PENDING' | 'ACTIVE' | 'FEATURED' | 'BANNED';
                    rating: number;
                    review_count: number;
                    views: number;
                    favorites: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    provider_id: string;
                    name: string;
                    description: string;
                    address: string;
                    zone: string;
                    category: 'SALON_EVENTOS' | 'JARDIN' | 'TERRAZA' | 'HACIENDA' | 'BODEGA' | 'RESTAURANTE' | 'HOTEL';
                    price: number;
                    capacity: number;
                    status?: 'PENDING' | 'ACTIVE' | 'FEATURED' | 'BANNED';
                    rating?: number;
                    review_count?: number;
                    views?: number;
                    favorites?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    provider_id?: string;
                    name?: string;
                    description?: string;
                    address?: string;
                    zone?: string;
                    category?: 'SALON_EVENTOS' | 'JARDIN' | 'TERRAZA' | 'HACIENDA' | 'BODEGA' | 'RESTAURANTE' | 'HOTEL';
                    price?: number;
                    capacity?: number;
                    status?: 'PENDING' | 'ACTIVE' | 'FEATURED' | 'BANNED';
                    rating?: number;
                    review_count?: number;
                    views?: number;
                    favorites?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            venue_images: {
                Row: {
                    id: string;
                    venue_id: string;
                    url: string;
                    display_order: number;
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    url: string;
                    display_order?: number;
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    url?: string;
                    display_order?: number;
                };
            };
            venue_amenities: {
                Row: {
                    id: string;
                    venue_id: string;
                    name: string;
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    name: string;
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    name?: string;
                };
            };
            venue_payment_methods: {
                Row: {
                    id: string;
                    venue_id: string;
                    method: 'TRANSFERENCIA' | 'EFECTIVO';
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    method: 'TRANSFERENCIA' | 'EFECTIVO';
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    method?: 'TRANSFERENCIA' | 'EFECTIVO';
                };
            };
            bookings: {
                Row: {
                    id: string;
                    venue_id: string;
                    client_id: string;
                    provider_id: string;
                    date: string;
                    status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
                    total_price: number;
                    payment_method: 'TRANSFERENCIA' | 'EFECTIVO';
                    notes: string | null;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    client_id: string;
                    provider_id: string;
                    date: string;
                    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
                    total_price: number;
                    payment_method: 'TRANSFERENCIA' | 'EFECTIVO';
                    notes?: string | null;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    client_id?: string;
                    provider_id?: string;
                    date?: string;
                    status?: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
                    total_price?: number;
                    payment_method?: 'TRANSFERENCIA' | 'EFECTIVO';
                    notes?: string | null;
                    created_at?: string;
                };
            };
            reviews: {
                Row: {
                    id: string;
                    venue_id: string;
                    user_id: string;
                    rating: number;
                    comment: string;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    venue_id: string;
                    user_id: string;
                    rating: number;
                    comment: string;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    venue_id?: string;
                    user_id?: string;
                    rating?: number;
                    comment?: string;
                    created_at?: string;
                };
            };
            conversations: {
                Row: {
                    id: string;
                    venue_id: string | null;
                    unread_count: number;
                    created_at: string;
                };
                Insert: {
                    id?: string;
                    venue_id?: string | null;
                    unread_count?: number;
                    created_at?: string;
                };
                Update: {
                    id?: string;
                    venue_id?: string | null;
                    unread_count?: number;
                    created_at?: string;
                };
            };
            conversation_participants: {
                Row: {
                    id: string;
                    conversation_id: string;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    user_id?: string;
                };
            };
            messages: {
                Row: {
                    id: string;
                    conversation_id: string;
                    sender_id: string;
                    content: string;
                    is_read: boolean;
                    timestamp: string;
                };
                Insert: {
                    id?: string;
                    conversation_id: string;
                    sender_id: string;
                    content: string;
                    is_read?: boolean;
                    timestamp?: string;
                };
                Update: {
                    id?: string;
                    conversation_id?: string;
                    sender_id?: string;
                    content?: string;
                    is_read?: boolean;
                    timestamp?: string;
                };
            };
            user_favorites: {
                Row: {
                    user_id: string;
                    venue_id: string;
                    created_at: string;
                };
                Insert: {
                    user_id: string;
                    venue_id: string;
                    created_at?: string;
                };
                Update: {
                    user_id?: string;
                    venue_id?: string;
                    created_at?: string;
                };
            };
            faqs: {
                Row: {
                    id: string;
                    question: string;
                    answer: string;
                    category: string;
                };
                Insert: {
                    id?: string;
                    question: string;
                    answer: string;
                    category: string;
                };
                Update: {
                    id?: string;
                    question?: string;
                    answer?: string;
                    category?: string;
                };
            };
            user_recently_viewed: {
                Row: {
                    id: string;
                    user_id: string;
                    venue_id: string;
                    viewed_at: string;
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    venue_id: string;
                    viewed_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    venue_id?: string;
                    viewed_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            user_role: 'CLIENTE' | 'PROVEEDOR' | 'ADMIN';
            verification_status: 'PENDING' | 'VERIFIED' | 'REJECTED';
            venue_status: 'PENDING' | 'ACTIVE' | 'FEATURED' | 'BANNED';
            venue_category: 'SALON_EVENTOS' | 'JARDIN' | 'TERRAZA' | 'HACIENDA' | 'BODEGA' | 'RESTAURANTE' | 'HOTEL';
            payment_method: 'TRANSFERENCIA' | 'EFECTIVO';
            booking_status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
        };
    };
};
