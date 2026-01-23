/**
 * @fileoverview Servicio Mock API para EventSpace
 * @description Simula las respuestas del backend .NET 9 con latencia artificial
 * 
 * @iso25010
 * - Eficiencia de Desempeño: Latencia configurable para pruebas realistas
 * - Mantenibilidad: Estructura modular que facilita migración a API real
 * - Portabilidad: Interfaces compatibles con endpoints .NET 9
 */

import type {
    User,
    Venue,
    Booking,
    Review,
    Message,
    Conversation,
    ProviderMetrics,
    AdminMetrics,
    FAQItem,
    SearchFilters,
    PaginatedResponse,
    VenueCategory,
    DateAvailability,
    LoginCredentials,
    RegisterData,
} from '../types';

// ==================== CONFIGURACIÓN ====================

/** Latencia mínima simulada en ms */
const MIN_LATENCY = 300;
/** Latencia máxima simulada en ms */
const MAX_LATENCY = 800;

/**
 * Simula latencia de red
 */
const simulateLatency = (): Promise<void> => {
    const delay = Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
    return new Promise((resolve) => setTimeout(resolve, delay));
};

// ==================== DATOS MOCK ====================

/** Usuarios de prueba */
const mockUsers: User[] = [
    {
        id: '1',
        email: 'cliente@eventspace.com',
        name: 'María García',
        role: 'CLIENTE',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        phone: '+52 55 1234 5678',
        createdAt: new Date('2025-01-01'),
    },
    {
        id: '2',
        email: 'proveedor@eventspace.com',
        name: 'Carlos Rodríguez',
        role: 'PROVEEDOR',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        phone: '+52 55 9876 5432',
        createdAt: new Date('2024-06-15'),
        verificationStatus: 'VERIFIED',
        ineDocumentId: 'INE-12345',
    },
    {
        id: '3',
        email: 'admin@eventspace.com',
        name: 'Admin EventSpace',
        role: 'ADMIN',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        createdAt: new Date('2024-01-01'),
    },
];

/** Contraseñas mock (en producción estarían hasheadas) */
const mockPasswords: Record<string, string> = {
    'cliente@eventspace.com': 'cliente123',
    'proveedor@eventspace.com': 'proveedor123',
    'admin@eventspace.com': 'admin123',
};

/** Zonas disponibles */
export const zones = [
    'Polanco',
    'Roma Norte',
    'Condesa',
    'Santa Fe',
    'Coyoacán',
    'San Ángel',
    'Tlalpan',
    'Xochimilco',
];

/** Categorías con labels */
export const categoryLabels: Record<VenueCategory, string> = {
    SALON_EVENTOS: 'Salón de Eventos',
    JARDIN: 'Jardín',
    TERRAZA: 'Terraza',
    HACIENDA: 'Hacienda',
    BODEGA: 'Bodega Industrial',
    RESTAURANTE: 'Restaurante',
    HOTEL: 'Hotel',
};

/** Locales de prueba */
const mockVenues: Venue[] = [
    {
        id: 'v1',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda Los Arcos',
        description: 'Hermosa hacienda colonial del siglo XVIII con amplios jardines, fuentes tradicionales y arquitectura histórica. Perfecta para bodas y eventos de gala con capacidad para grandes celebraciones.',
        address: 'Av. Insurgentes Sur 1234, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 12000,
        capacity: 350,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Cocina', 'Mobiliario', 'Jardín', 'Capilla', 'Suite Nupcial'],
        services: [
            { id: 's1', name: 'Mobiliario (Mesas y Sillas)', price: 0, isOptional: false },
            { id: 's2', name: 'Limpieza post-evento', price: 800, isOptional: true },
            { id: 's3', name: 'Seguridad privada', price: 1500, isOptional: true }
        ],
        status: 'FEATURED',
        rating: 4.8,
        reviewCount: 127,
        views: 3420,
        favorites: 234,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v2',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Skyline CDMX',
        description: 'Exclusiva terraza en el piso 25 con vista panorámica a la Ciudad de México. Diseño contemporáneo con iluminación LED personalizable y sistema de audio profesional.',
        address: 'Paseo de la Reforma 500, Polanco',
        zone: 'Polanco',
        category: 'TERRAZA',
        price: 18000,
        capacity: 200,
        images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Barra Premium', 'DJ Booth', 'Terraza Techada', 'Clima'],
        services: [
            { id: 's1', name: 'Mobiliario Lounge', price: 0, isOptional: false },
            { id: 's2', name: 'Limpieza post-evento', price: 500, isOptional: true },
            { id: 's3', name: 'DJ Residente', price: 3500, isOptional: true }
        ],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        views: 2150,
        favorites: 178,
        createdAt: new Date('2024-05-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v3',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Botánico Roma',
        description: 'Oasis verde en el corazón de la Roma Norte. Jardín secreto con vegetación exótica, pérgolas de madera y ambiente íntimo para eventos boutique.',
        address: 'Calle Orizaba 89, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 85000,
        capacity: 100,
        images: [
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Jardín', 'Pérgola', 'Iluminación', 'Mobiliario'],
        services: [
            { id: 's1', name: 'Mobiliario Vintage', price: 0, isOptional: false },
            { id: 's2', name: 'Limpieza post-evento', price: 400, isOptional: true }
        ],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 56,
        views: 1890,
        favorites: 145,
        createdAt: new Date('2024-07-10'),
        updatedAt: new Date('2025-01-05'),
    },
    {
        id: 'v4',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Imperial Condesa',
        description: 'Elegante salón art déco con techos altos, candelabros de cristal y pisos de mármol. Ideal para galas, cenas de empresa y celebraciones formales.',
        address: 'Av. Ámsterdam 156, Condesa',
        zone: 'Condesa',
        category: 'SALON_EVENTOS',
        price: 15000,
        capacity: 180,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Cocina Industrial', 'Audio Profesional', 'Pista de Baile', 'Clima'],
        services: [
            { id: 's1', name: 'Mobiliario de Gala', price: 0, isOptional: false },
            { id: 's2', name: 'Limpieza post-evento', price: 1000, isOptional: true },
            { id: 's3', name: 'Personal de baños', price: 800, isOptional: true }
        ],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 203,
        views: 4560,
        favorites: 312,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v5',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Bodega Industrial 1920',
        description: 'Espacioso loft industrial con ladrillo expuesto, vigas de acero y amplios ventanales. Perfecto para eventos alternativos, exposiciones de arte y fiestas temáticas.',
        address: 'Calle Liverpool 45, Roma Norte',
        zone: 'Roma Norte',
        category: 'BODEGA',
        price: 11000,
        capacity: 250,
        images: [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Cocina', 'Barra', 'Proyector', 'WiFi', 'Terraza'],
        services: [
            { id: 's1', name: 'Mobiliario Industrial', price: 0, isOptional: false },
            { id: 's2', name: 'Limpieza post-evento', price: 600, isOptional: true }
        ],
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 78,
        views: 2340,
        favorites: 167,
        createdAt: new Date('2024-04-22'),
        updatedAt: new Date('2025-01-09'),
    },
    // ========== NUEVOS LOCALES ==========
    {
        id: 'v6',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Diamante',
        description: 'Elegante salón de fiestas con capacidad para grandes eventos. Cuenta con iluminación LED programable, sistema de sonido profesional y amplia pista de baile con piso de cristal.',
        address: 'Av. Presidente Masaryk 201, Polanco',
        zone: 'Polanco',
        category: 'SALON_EVENTOS',
        price: 25000,
        capacity: 300,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Valet Parking', 'Cocina Industrial', 'Audio Profesional', 'Pista de Baile', 'Clima', 'Barra Premium'],
        services: [
            { id: 's1', name: 'Mobiliario de Gala', price: 0, isOptional: false },
            { id: 's2', name: 'DJ Residente', price: 4000, isOptional: true },
        ],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 156,
        views: 5200,
        favorites: 423,
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2025-01-15'),
    },
    {
        id: 'v7',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Real Condesa',
        description: 'Salón clásico con toques modernos, perfecto para bodas y quinceañeras. Techos altos con candelabros de cristal y jardín interior privado.',
        address: 'Calle Tamaulipas 89, Condesa',
        zone: 'Condesa',
        category: 'SALON_EVENTOS',
        price: 18000,
        capacity: 200,
        images: [
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Estacionamiento', 'Cocina', 'Audio', 'Jardín Interior', 'Clima'],
        services: [
            { id: 's1', name: 'Decoración incluida', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 89,
        views: 3100,
        favorites: 234,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v8',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Salón Versalles Santa Fe',
        description: 'Moderno salón empresarial ideal para conferencias, lanzamientos y cenas de gala. Equipado con tecnología de punta y servicio de catering premium.',
        address: 'Av. Santa Fe 440, Santa Fe',
        zone: 'Santa Fe',
        category: 'SALON_EVENTOS',
        price: 35000,
        capacity: 400,
        images: [
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Tecnología AV', 'WiFi Premium', 'Catering', 'Sala VIP'],
        services: [
            { id: 's1', name: 'Equipo audiovisual', price: 0, isOptional: false },
            { id: 's2', name: 'Hostess', price: 2000, isOptional: true },
        ],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 67,
        views: 2800,
        favorites: 189,
        createdAt: new Date('2024-05-15'),
        updatedAt: new Date('2025-01-10'),
    },
    {
        id: 'v9',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Las Palmas',
        description: 'Hermoso jardín tropical con palmeras centenarias y fuente central. Espacio al aire libre perfecto para bodas y eventos sociales bajo las estrellas.',
        address: 'Calle Durango 156, Roma Norte',
        zone: 'Roma Norte',
        category: 'JARDIN',
        price: 15000,
        capacity: 150,
        images: [
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento', 'Iluminación', 'Jardín', 'Fuente', 'Carpa'],
        services: [
            { id: 's1', name: 'Carpa de emergencia', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 112,
        views: 4100,
        favorites: 298,
        createdAt: new Date('2024-02-20'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v10',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Jardín Secreto Coyoacán',
        description: 'Jardín bohemio escondido en el corazón de Coyoacán. Rodeado de vegetación exótica, ideal para eventos íntimos y ceremonias especiales.',
        address: 'Calle Francisco Sosa 45, Coyoacán',
        zone: 'Coyoacán',
        category: 'JARDIN',
        price: 12000,
        capacity: 80,
        images: [
            'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
            'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Estacionamiento cercano', 'Iluminación romántica', 'Pérgola', 'Zona lounge'],
        services: [
            { id: 's1', name: 'Mobiliario vintage', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.9,
        reviewCount: 78,
        views: 2900,
        favorites: 267,
        createdAt: new Date('2024-04-10'),
        updatedAt: new Date('2025-01-05'),
    },
    {
        id: 'v11',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Panorámica WTC',
        description: 'Impresionante terraza en el piso 40 con vista 360° de la Ciudad de México. Ideal para cócteles, lanzamientos y eventos corporativos exclusivos.',
        address: 'Montecito 38, Nápoles',
        zone: 'Santa Fe',
        category: 'TERRAZA',
        price: 45000,
        capacity: 180,
        images: [
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Valet Parking', 'Barra Premium', 'Vista 360°', 'Clima', 'Helipuerto'],
        services: [
            { id: 's1', name: 'Servicio de bar', price: 0, isOptional: false },
            { id: 's2', name: 'Fotógrafo', price: 5000, isOptional: true },
        ],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 134,
        views: 6200,
        favorites: 512,
        createdAt: new Date('2024-01-05'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v12',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Terraza Verde San Ángel',
        description: 'Terraza ecológica con jardín vertical y techo de cristal retráctil. Ambiente sofisticado para eventos sostenibles y celebraciones únicas.',
        address: 'Av. Revolución 1500, San Ángel',
        zone: 'San Ángel',
        category: 'TERRAZA',
        price: 22000,
        capacity: 120,
        images: [
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Jardín vertical', 'Techo retráctil', 'Barra', 'WiFi', 'Clima natural'],
        services: [
            { id: 's1', name: 'Plantas decorativas', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 56,
        views: 2100,
        favorites: 178,
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2025-01-07'),
    },
    {
        id: 'v13',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda San Miguel',
        description: 'Majestuosa hacienda del siglo XVII completamente restaurada. Capilla privada, caballerizas y amplios jardines. El escenario perfecto para bodas de ensueño.',
        address: 'Carretera Xochimilco-Tulyehualco Km 8',
        zone: 'Xochimilco',
        category: 'HACIENDA',
        price: 95000,
        capacity: 500,
        images: [
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Capilla', 'Caballerizas', 'Suite nupcial', 'Jardines', 'Fuentes', 'Estacionamiento 200 autos'],
        services: [
            { id: 's1', name: 'Coordinador de evento', price: 0, isOptional: false },
            { id: 's2', name: 'Mariachi', price: 8000, isOptional: true },
        ],
        status: 'FEATURED',
        rating: 5.0,
        reviewCount: 89,
        views: 7500,
        favorites: 634,
        createdAt: new Date('2023-12-01'),
        updatedAt: new Date('2025-01-13'),
    },
    {
        id: 'v14',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hacienda El Molino',
        description: 'Encantadora hacienda con molino histórico y lago artificial. Arquitectura colonial auténtica con todos los servicios modernos.',
        address: 'Camino a Santa Teresa 200, Tlalpan',
        zone: 'Tlalpan',
        category: 'HACIENDA',
        price: 75000,
        capacity: 350,
        images: [
            'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
            'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Lago', 'Molino histórico', 'Jardines', 'Capilla', 'Suite', 'Estacionamiento'],
        services: [
            { id: 's1', name: 'Decoración floral', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 67,
        views: 4300,
        favorites: 389,
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2025-01-11'),
    },
    {
        id: 'v15',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Bodega Arte Vivo',
        description: 'Espacio industrial reconvertido en galería de arte. Paredes de ladrillo, techos de 8 metros y luz natural abundante. Perfecto para exposiciones y eventos creativos.',
        address: 'Calle Córdoba 78, Roma Norte',
        zone: 'Roma Norte',
        category: 'BODEGA',
        price: 14000,
        capacity: 200,
        images: [
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Galería', 'Luz natural', 'Proyector', 'WiFi', 'Cocina', 'Estacionamiento'],
        services: [
            { id: 's1', name: 'Iluminación artística', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.6,
        reviewCount: 45,
        views: 1900,
        favorites: 156,
        createdAt: new Date('2024-05-20'),
        updatedAt: new Date('2025-01-06'),
    },
    {
        id: 'v16',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Restaurante La Hacienda',
        description: 'Restaurante mexicano de alta cocina con salón privado para eventos. Menú degustación y maridaje con vinos mexicanos. Ambiente cálido y sofisticado.',
        address: 'Av. Álvaro Obregón 286, Roma Norte',
        zone: 'Roma Norte',
        category: 'RESTAURANTE',
        price: 8000,
        capacity: 60,
        images: [
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Salón privado', 'Cocina gourmet', 'Sommelier', 'Valet Parking'],
        services: [
            { id: 's1', name: 'Menú degustación', price: 0, isOptional: false },
            { id: 's2', name: 'Maridaje de vinos', price: 3500, isOptional: true },
        ],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 234,
        views: 5600,
        favorites: 445,
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2025-01-09'),
    },
    {
        id: 'v17',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Restaurante Cielo Polanco',
        description: 'Restaurante rooftop con cocina internacional y vista espectacular. Terraza climatizada perfecta para cenas empresariales y celebraciones íntimas.',
        address: 'Av. Presidente Masaryk 340, Polanco',
        zone: 'Polanco',
        category: 'RESTAURANTE',
        price: 12000,
        capacity: 80,
        images: [
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
            'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Terraza', 'Vista panorámica', 'Clima', 'Barra premium', 'Valet Parking'],
        services: [
            { id: 's1', name: 'Chef privado', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.7,
        reviewCount: 189,
        views: 4200,
        favorites: 367,
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2025-01-08'),
    },
    {
        id: 'v18',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Hotel Boutique La Condesa',
        description: 'Elegante hotel boutique con salón de eventos exclusivo. Habitaciones para invitados, jardín interior y servicio de catering propio.',
        address: 'Av. Ámsterdam 212, Condesa',
        zone: 'Condesa',
        category: 'HOTEL',
        price: 55000,
        capacity: 150,
        images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Habitaciones', 'Salón eventos', 'Jardín', 'Spa', 'Restaurante', 'Valet Parking'],
        services: [
            { id: 's1', name: 'Habitaciones para novios', price: 0, isOptional: false },
            { id: 's2', name: 'Brunch post-boda', price: 12000, isOptional: true },
        ],
        status: 'FEATURED',
        rating: 4.9,
        reviewCount: 78,
        views: 3800,
        favorites: 312,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2025-01-12'),
    },
    {
        id: 'v19',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Gran Hotel Reforma',
        description: 'Majestuoso hotel histórico con salón de baile estilo Belle Époque. Ideal para galas, bodas de ensueño y eventos corporativos de primer nivel.',
        address: 'Paseo de la Reforma 1, Centro',
        zone: 'Polanco',
        category: 'HOTEL',
        price: 120000,
        capacity: 600,
        images: [
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA'],
        amenities: ['Salón de baile', 'Suites', 'Spa', 'Restaurantes', 'Concierge', 'Valet Parking'],
        services: [
            { id: 's1', name: 'Wedding planner', price: 0, isOptional: false },
            { id: 's2', name: 'Fuegos artificiales', price: 25000, isOptional: true },
        ],
        status: 'ACTIVE',
        rating: 4.8,
        reviewCount: 156,
        views: 8900,
        favorites: 678,
        createdAt: new Date('2023-11-01'),
        updatedAt: new Date('2025-01-14'),
    },
    {
        id: 'v20',
        providerId: '2',
        providerName: 'Carlos Rodríguez',
        name: 'Bodega Brooklyn CDMX',
        description: 'Auténtico estilo Brooklyn con ladrillo rojo, tubería expuesta y arte urbano. El lugar más trendy para fiestas alternativas y sesiones de fotos.',
        address: 'Calle Tonalá 23, Roma Norte',
        zone: 'Roma Norte',
        category: 'BODEGA',
        price: 9500,
        capacity: 180,
        images: [
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
        ],
        paymentMethods: ['TRANSFERENCIA', 'EFECTIVO'],
        amenities: ['Arte urbano', 'DJ booth', 'Barra', 'Terraza pequeña', 'WiFi'],
        services: [
            { id: 's1', name: 'Ambientación urbana', price: 0, isOptional: false },
        ],
        status: 'ACTIVE',
        rating: 4.5,
        reviewCount: 92,
        views: 3100,
        favorites: 234,
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2025-01-10'),
    },
];

/** Reseñas de prueba */
const mockReviews: Review[] = [
    {
        id: 'r1',
        venueId: 'v1',
        userId: '1',
        userName: 'María García',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        rating: 5,
        comment: 'Increíble experiencia. El lugar es mágico y el servicio impecable. Nuestra boda fue un sueño hecho realidad.',
        createdAt: new Date('2025-01-05'),
    },
    {
        id: 'r2',
        venueId: 'v1',
        userId: '4',
        userName: 'Ana López',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
        rating: 5,
        comment: 'La hacienda es espectacular. Los jardines perfectos para fotos. 100% recomendado.',
        createdAt: new Date('2024-12-20'),
    },
    {
        id: 'r3',
        venueId: 'v2',
        userId: '5',
        userName: 'Roberto Sánchez',
        userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Roberto',
        rating: 4,
        comment: 'Vista increíble de la ciudad. El evento corporativo fue todo un éxito. Solo mejoraría el sistema de audio.',
        createdAt: new Date('2025-01-02'),
    },
];

/** Reservaciones de prueba */
const mockBookings: Booking[] = [
    {
        id: 'b1',
        venueId: 'v1',
        venueName: 'Hacienda Los Arcos',
        venueImage: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
        clientId: '1',
        clientName: 'María García',
        providerId: '2',
        date: '2025-02-14',
        status: 'CONFIRMED',
        totalPrice: 85000,
        paymentMethod: 'TRANSFERENCIA',
        createdAt: new Date('2025-01-10'),
        notes: 'Boda - 180 invitados',
    },
    {
        id: 'b2',
        venueId: 'v2',
        venueName: 'Terraza Skyline CDMX',
        venueImage: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800',
        clientId: '1',
        clientName: 'María García',
        providerId: '2',
        date: '2025-03-20',
        status: 'PENDING',
        totalPrice: 120000,
        paymentMethod: 'TRANSFERENCIA',
        createdAt: new Date('2025-01-12'),
        notes: 'Evento corporativo',
    },
];

/** Conversaciones de chat */
const mockConversations: Conversation[] = [
    {
        id: 'c1',
        participants: [
            { id: '1', name: 'María García', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', role: 'CLIENTE' },
            { id: '2', name: 'Carlos Rodríguez', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', role: 'PROVEEDOR' },
        ],
        venueId: 'v1',
        venueName: 'Hacienda Los Arcos',
        lastMessage: {
            id: 'm3',
            conversationId: 'c1',
            senderId: '2',
            senderName: 'Carlos Rodríguez',
            content: '¡Perfecto! Te envío la cotización actualizada.',
            timestamp: new Date('2025-01-13T10:30:00'),
            isRead: false,
        },
        unreadCount: 1,
        createdAt: new Date('2025-01-10'),
    },
];

/** Mensajes de chat */
const mockMessages: Message[] = [
    {
        id: 'm1',
        conversationId: 'c1',
        senderId: '1',
        senderName: 'María García',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        content: 'Hola, me interesa reservar la hacienda para el 14 de febrero.',
        timestamp: new Date('2025-01-10T09:00:00'),
        isRead: true,
    },
    {
        id: 'm2',
        conversationId: 'c1',
        senderId: '2',
        senderName: 'Carlos Rodríguez',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        content: '¡Hola María! Claro, esa fecha está disponible. ¿Cuántos invitados tendrás?',
        timestamp: new Date('2025-01-10T09:15:00'),
        isRead: true,
    },
    {
        id: 'm3',
        conversationId: 'c1',
        senderId: '1',
        senderName: 'María García',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
        content: 'Seremos aproximadamente 180 personas. ¿Incluye el montaje de mesas?',
        timestamp: new Date('2025-01-13T10:00:00'),
        isRead: true,
    },
    {
        id: 'm4',
        conversationId: 'c1',
        senderId: '2',
        senderName: 'Carlos Rodríguez',
        senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
        content: '¡Perfecto! Te envío la cotización actualizada.',
        timestamp: new Date('2025-01-13T10:30:00'),
        isRead: false,
    },
];

/** FAQ */
const mockFAQs: FAQItem[] = [
    {
        id: 'faq1',
        question: '¿Cómo puedo reservar un local?',
        answer: 'Para reservar un local, primero navega al detalle del espacio que te interesa. Revisa la disponibilidad en el calendario y haz clic en "Solicitar Reservación". El proveedor recibirá tu solicitud y te contactará para confirmar los detalles.',
        category: 'Reservaciones',
    },
    {
        id: 'faq2',
        question: '¿Cuáles son los métodos de pago aceptados?',
        answer: 'Cada local puede aceptar diferentes métodos de pago. Los más comunes son transferencia bancaria y efectivo. Puedes ver los métodos aceptados en la página de detalle de cada espacio.',
        category: 'Pagos',
    },
    {
        id: 'faq3',
        question: '¿Cómo me convierto en proveedor?',
        answer: 'Los proveedores son verificados manualmente por nuestro equipo. Si tienes un espacio que deseas publicar, contáctanos a través del formulario de contacto y nuestro equipo evaluará tu solicitud.',
        category: 'Proveedores',
    },
    {
        id: 'faq4',
        question: '¿Puedo cancelar una reservación?',
        answer: 'Las políticas de cancelación varían según el proveedor. Te recomendamos revisar los términos antes de confirmar y comunicarte directamente con el proveedor para acordar cualquier cambio.',
        category: 'Reservaciones',
    },
    {
        id: 'faq5',
        question: '¿Cómo contacto a un proveedor?',
        answer: 'Una vez que hayas encontrado un local que te interese, puedes enviar un mensaje al proveedor directamente desde la página del espacio. También puedes iniciar una conversación desde tu centro de mensajes.',
        category: 'Comunicación',
    },
];

/** IDs de locales vistos recientemente (simulación) */
let recentlyViewedIds: string[] = ['v1', 'v3'];

// ==================== SERVICIOS DE AUTENTICACIÓN ====================

/**
 * Inicia sesión con credenciales
 */
export const login = async (credentials: LoginCredentials): Promise<User> => {
    await simulateLatency();

    const user = mockUsers.find((u) => u.email === credentials.email);
    const password = mockPasswords[credentials.email];

    if (!user || password !== credentials.password) {
        throw new Error('Credenciales inválidas');
    }

    return user;
};

/**
 * Registra un nuevo usuario (cliente o proveedor)
 * @throws Error si el email ya existe
 */
export const register = async (data: RegisterData): Promise<User> => {
    await simulateLatency();

    if (mockUsers.some((u) => u.email === data.email)) {
        throw new Error('El email ya está registrado');
    }

    const role = data.role || 'CLIENTE';

    const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email,
        name: data.name,
        role: role,
        phone: data.phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${data.name.replace(' ', '')}`,
        createdAt: new Date(),
        verificationStatus: role === 'PROVEEDOR' ? 'PENDING' : undefined,
    };

    mockUsers.push(newUser);
    mockPasswords[data.email] = data.password;

    return newUser;
};

/**
 * Cierra sesión (limpia datos locales)
 */
export const logout = async (): Promise<void> => {
    await simulateLatency();
    // En producción, invalidaría el token en el servidor
};

// ==================== SERVICIOS DE LOCALES ====================

/**
 * Obtiene locales con filtros y paginación
 */
export const getVenues = async (
    filters?: SearchFilters,
    page = 1,
    pageSize = 10
): Promise<PaginatedResponse<Venue>> => {
    await simulateLatency();

    let filtered = [...mockVenues].filter((v) => v.status !== 'BANNED');

    if (filters?.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(
            (v) =>
                v.name.toLowerCase().includes(query) ||
                v.description.toLowerCase().includes(query) ||
                v.zone.toLowerCase().includes(query)
        );
    }

    if (filters?.zone) {
        filtered = filtered.filter((v) => v.zone === filters.zone);
    }

    if (filters?.category) {
        filtered = filtered.filter((v) => v.category === filters.category);
    }

    if (filters?.priceMin !== undefined) {
        filtered = filtered.filter((v) => v.price >= filters.priceMin!);
    }

    if (filters?.priceMax !== undefined) {
        filtered = filtered.filter((v) => v.price <= filters.priceMax!);
    }

    if (filters?.capacity) {
        filtered = filtered.filter((v) => v.capacity >= filters.capacity!);
    }

    // Ordenar: destacados primero, luego por rating
    filtered.sort((a, b) => {
        if (a.status === 'FEATURED' && b.status !== 'FEATURED') return -1;
        if (b.status === 'FEATURED' && a.status !== 'FEATURED') return 1;
        return b.rating - a.rating;
    });

    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const data = filtered.slice(startIndex, startIndex + pageSize);

    return {
        data,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
    };
};

/**
 * Obtiene un local por ID
 */
export const getVenueById = async (id: string): Promise<Venue> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === id);
    if (!venue) {
        throw new Error('Local no encontrado');
    }

    // Registrar vista
    venue.views++;

    // Agregar a vistos recientemente
    recentlyViewedIds = [id, ...recentlyViewedIds.filter((vid) => vid !== id)].slice(0, 5);

    return venue;
};

/**
 * Obtiene locales vistos recientemente
 */
export const getRecentlyViewed = async (): Promise<Venue[]> => {
    await simulateLatency();

    return recentlyViewedIds
        .map((id) => mockVenues.find((v) => v.id === id))
        .filter((v): v is Venue => v !== undefined);
};

/**
 * Obtiene locales recomendados
 */
export const getRecommendedVenues = async (): Promise<Venue[]> => {
    await simulateLatency();

    // Simula recomendaciones basadas en popularidad
    return [...mockVenues]
        .filter((v) => v.status !== 'BANNED')
        .sort((a, b) => b.favorites - a.favorites)
        .slice(0, 4);
};

/**
 * Obtiene disponibilidad de fechas para un local
 */
export const getVenueAvailability = async (
    venueId: string,
    month: number,
    year: number
): Promise<DateAvailability[]> => {
    await simulateLatency();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const availability: DateAvailability[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];

        // Simula disponibilidad aleatoria
        const isBooked = mockBookings.some(
            (b) => b.venueId === venueId && b.date === dateStr && b.status !== 'CANCELLED'
        );

        // Fechas pasadas no disponibles
        const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

        availability.push({
            date: dateStr,
            isAvailable: !isBooked && !isPast,
        });
    }

    return availability;
};

/**
 * Obtiene reseñas de un local
 */
export const getVenueReviews = async (venueId: string): Promise<Review[]> => {
    await simulateLatency();

    return mockReviews.filter((r) => r.venueId === venueId);
};

// ==================== SERVICIOS DE RESERVACIONES ====================

/**
 * Obtiene reservaciones del usuario
 */
export const getUserBookings = async (userId: string): Promise<Booking[]> => {
    await simulateLatency();

    return mockBookings.filter((b) => b.clientId === userId);
};

/**
 * Obtiene reservaciones del proveedor
 */
export const getProviderBookings = async (providerId: string): Promise<Booking[]> => {
    await simulateLatency();

    return mockBookings.filter((b) => b.providerId === providerId);
};

/**
 * Crea una nueva reservación
 */
export const createBooking = async (
    venueId: string,
    clientId: string,
    date: string,
    paymentMethod: 'TRANSFERENCIA' | 'EFECTIVO',
    notes?: string
): Promise<Booking> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === venueId);
    if (!venue) throw new Error('Local no encontrado');

    const client = mockUsers.find((u) => u.id === clientId);
    if (!client) throw new Error('Usuario no encontrado');

    const booking: Booking = {
        id: `b-${Date.now()}`,
        venueId,
        venueName: venue.name,
        venueImage: venue.images[0],
        clientId,
        clientName: client.name,
        providerId: venue.providerId,
        date,
        status: 'PENDING',
        totalPrice: venue.price,
        paymentMethod,
        createdAt: new Date(),
        notes,
    };

    mockBookings.push(booking);
    return booking;
};

// ==================== SERVICIOS DE MENSAJERÍA ====================

/**
 * Obtiene conversaciones del usuario
 */
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    await simulateLatency();

    return mockConversations.filter((c) =>
        c.participants.some((p) => p.id === userId)
    );
};

/**
 * Obtiene mensajes de una conversación
 */
export const getMessages = async (conversationId: string): Promise<Message[]> => {
    await simulateLatency();

    return mockMessages.filter((m) => m.conversationId === conversationId);
};

/**
 * Envía un mensaje
 */
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string
): Promise<Message> => {
    await simulateLatency();

    const sender = mockUsers.find((u) => u.id === senderId);
    if (!sender) throw new Error('Usuario no encontrado');

    const message: Message = {
        id: `m-${Date.now()}`,
        conversationId,
        senderId,
        senderName: sender.name,
        senderAvatar: sender.avatar,
        content,
        timestamp: new Date(),
        isRead: false,
    };

    mockMessages.push(message);
    return message;
};

// ==================== SERVICIOS DE MÉTRICAS ====================

/**
 * Obtiene métricas del proveedor
 */
export const getProviderMetrics = async (providerId: string): Promise<ProviderMetrics> => {
    await simulateLatency();

    const providerVenues = mockVenues.filter((v) => v.providerId === providerId);
    const providerBookings = mockBookings.filter((b) => b.providerId === providerId);
    const providerConversations = mockConversations.filter((c) =>
        c.participants.some((p) => p.id === providerId)
    );

    return {
        totalViews: providerVenues.reduce((sum, v) => sum + v.views, 0),
        totalReservations: providerBookings.length,
        totalFavorites: providerVenues.reduce((sum, v) => sum + v.favorites, 0),
        totalMessages: providerConversations.reduce((sum, c) => sum + c.unreadCount, 0),
        viewsChange: 12.5,
        reservationsChange: 8.3,
        favoritesChange: 15.2,
        messagesChange: -2.1,
    };
};

/**
 * Obtiene métricas de administración
 */
export const getAdminMetrics = async (): Promise<AdminMetrics> => {
    await simulateLatency();

    return {
        totalUsers: mockUsers.length,
        totalClients: mockUsers.filter((u) => u.role === 'CLIENTE').length,
        totalProviders: mockUsers.filter((u) => u.role === 'PROVEEDOR').length,
        totalVenues: mockVenues.length,
        totalBookings: mockBookings.length,
        completedBookings: mockBookings.filter((b) => b.status === 'COMPLETED').length,
        revenue: mockBookings
            .filter((b) => b.status === 'CONFIRMED' || b.status === 'COMPLETED')
            .reduce((sum, b) => sum + b.totalPrice, 0),
        userGrowth: [
            { month: 'Ago', count: 45 },
            { month: 'Sep', count: 62 },
            { month: 'Oct', count: 78 },
            { month: 'Nov', count: 95 },
            { month: 'Dic', count: 112 },
            { month: 'Ene', count: 134 },
        ],
        bookingsByMonth: [
            { month: 'Ago', count: 12 },
            { month: 'Sep', count: 18 },
            { month: 'Oct', count: 24 },
            { month: 'Nov', count: 31 },
            { month: 'Dic', count: 28 },
            { month: 'Ene', count: 35 },
        ],
    };
};

// ==================== SERVICIOS DE ADMINISTRACIÓN ====================

/**
 * Obtiene todos los usuarios (solo admin)
 */
export const getAllUsers = async (): Promise<User[]> => {
    await simulateLatency();
    return mockUsers;
};

/**
 * Obtiene todos los locales (solo admin)
 */
export const getAllVenues = async (): Promise<Venue[]> => {
    await simulateLatency();
    return mockVenues;
};

/**
 * Crea un nuevo proveedor (solo admin)
 */
export const createProvider = async (
    email: string,
    name: string,
    phone: string,
    verified: boolean
): Promise<User> => {
    await simulateLatency();

    if (mockUsers.some((u) => u.email === email)) {
        throw new Error('El email ya está registrado');
    }

    const newProvider: User = {
        id: `prov-${Date.now()}`,
        email,
        name,
        role: 'PROVEEDOR',
        phone,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name.replace(' ', '')}`,
        createdAt: new Date(),
        verificationStatus: verified ? 'VERIFIED' : 'PENDING',
    };

    mockUsers.push(newProvider);
    mockPasswords[email] = 'proveedor123'; // Contraseña por defecto

    return newProvider;
};

/**
 * Actualiza estado de un local (bannear/destacar)
 */
export const updateVenueStatus = async (
    venueId: string,
    status: 'ACTIVE' | 'BANNED' | 'FEATURED'
): Promise<Venue> => {
    await simulateLatency();

    const venue = mockVenues.find((v) => v.id === venueId);
    if (!venue) throw new Error('Local no encontrado');

    venue.status = status;
    venue.updatedAt = new Date();

    return venue;
};

// ==================== SERVICIOS DE AYUDA ====================

/**
 * Obtiene preguntas frecuentes
 */
export const getFAQs = async (): Promise<FAQItem[]> => {
    await simulateLatency();
    return mockFAQs;
};

/**
 * Obtiene locales del proveedor
 */
export const getProviderVenues = async (providerId: string): Promise<Venue[]> => {
    await simulateLatency();
    return mockVenues.filter((v) => v.providerId === providerId);
};
