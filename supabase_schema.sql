-- ==================== LIMPIEZA INICIAL (IMPORTANTE) ====================
-- Esto elimina las tablas anteriores para asegurar que la nueva configuración (y los triggers) se instalen bien.
-- NO borra tus usuarios de autenticación (login), solo recarga la estructura de datos.

DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS venue_payment_methods CASCADE;
DROP TABLE IF EXISTS venue_amenities CASCADE;
DROP TABLE IF EXISTS venue_images CASCADE;
DROP TABLE IF EXISTS user_recently_viewed CASCADE;
DROP TABLE IF EXISTS venues CASCADE;
DROP TABLE IF EXISTS users CASCADE;

DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS venue_status CASCADE;
DROP TYPE IF EXISTS venue_category CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS booking_status CASCADE;

CREATE TYPE user_role AS ENUM ('CLIENTE', 'PROVEEDOR', 'ADMIN');
CREATE TYPE verification_status AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
CREATE TYPE venue_status AS ENUM ('PENDING', 'ACTIVE', 'FEATURED', 'BANNED');
CREATE TYPE venue_category AS ENUM ('SALON_EVENTOS', 'JARDIN', 'TERRAZA', 'HACIENDA', 'BODEGA', 'RESTAURANTE', 'HOTEL');
CREATE TYPE payment_method AS ENUM ('TRANSFERENCIA', 'EFECTIVO');
CREATE TYPE booking_status AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');

-- ==================== TABLA: USERS ====================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT, -- Se permite NULL porque Supabase Auth maneja la contraseña
    name TEXT NOT NULL,
    phone TEXT,
    avatar TEXT,
    role user_role NOT NULL DEFAULT 'CLIENTE',
    verification_status verification_status,
    ine_document_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- Índices para búsquedas frecuentes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ==================== TABLA: VENUES ====================
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    zone TEXT NOT NULL,
    category venue_category NOT NULL,
    price DECIMAL(12, 2) NOT NULL,
    capacity INTEGER NOT NULL,
    status venue_status NOT NULL DEFAULT 'PENDING',
    rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para búsquedas y filtros
CREATE INDEX idx_venues_provider ON venues(provider_id);
CREATE INDEX idx_venues_zone ON venues(zone);
CREATE INDEX idx_venues_category ON venues(category);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_price ON venues(price);

-- ==================== TABLA: VENUE_IMAGES ====================
CREATE TABLE venue_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

CREATE INDEX idx_venue_images_venue ON venue_images(venue_id);

-- ==================== TABLA: VENUE_AMENITIES ====================
CREATE TABLE venue_amenities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE INDEX idx_venue_amenities_venue ON venue_amenities(venue_id);

-- ==================== TABLA: VENUE_PAYMENT_METHODS ====================
CREATE TABLE venue_payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    method payment_method NOT NULL
);

CREATE INDEX idx_venue_payment_methods_venue ON venue_payment_methods(venue_id);

-- ==================== TABLA: BOOKINGS ====================
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status booking_status NOT NULL DEFAULT 'PENDING',
    total_price DECIMAL(12, 2) NOT NULL,
    payment_method payment_method NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_bookings_venue ON bookings(venue_id);
CREATE INDEX idx_bookings_client ON bookings(client_id);
CREATE INDEX idx_bookings_provider ON bookings(provider_id);
CREATE INDEX idx_bookings_date ON bookings(date);
CREATE INDEX idx_bookings_status ON bookings(status);

-- ==================== TABLA: REVIEWS ====================
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_reviews_venue ON reviews(venue_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

-- ==================== TABLA: CONVERSATIONS ====================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
    unread_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_conversations_venue ON conversations(venue_id);

-- ==================== TABLA: CONVERSATION_PARTICIPANTS ====================
CREATE TABLE conversation_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(conversation_id, user_id)
);

CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id);

-- ==================== TABLA: MESSAGES ====================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ==================== TABLA: USER_FAVORITES ====================
CREATE TABLE user_favorites (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, venue_id)
);

CREATE INDEX idx_user_favorites_user ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_venue ON user_favorites(venue_id);

-- ==================== TABLA: FAQS ====================
CREATE TABLE faqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category TEXT NOT NULL
);

-- ==================== TABLA: USER_RECENTLY_VIEWED ====================
CREATE TABLE user_recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID NOT NULL REFERENCES venues(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_user_recently_viewed_user ON user_recently_viewed(user_id);

-- ==================== ROW LEVEL SECURITY (RLS) ====================
-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_recently_viewed ENABLE ROW LEVEL SECURITY;

-- ==================== POLÍTICAS DE SEGURIDAD ====================

-- USERS: Acceso público para lectura (nombres básicos)
CREATE POLICY "Public can view basic user info" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- VENUES: Todos pueden ver locales activos
CREATE POLICY "Anyone can view active venues" ON venues
    FOR SELECT USING (status IN ('ACTIVE', 'FEATURED'));

CREATE POLICY "Providers can manage own venues" ON venues
    FOR ALL USING (auth.uid() = provider_id);

-- VENUE_IMAGES: Público
CREATE POLICY "Anyone can view venue images" ON venue_images
    FOR SELECT USING (true);

CREATE POLICY "Providers can manage venue images" ON venue_images
    FOR ALL USING (
        venue_id IN (SELECT id FROM venues WHERE provider_id = auth.uid())
    );

-- VENUE_AMENITIES: Público
CREATE POLICY "Anyone can view venue amenities" ON venue_amenities
    FOR SELECT USING (true);

-- VENUE_PAYMENT_METHODS: Público
CREATE POLICY "Anyone can view payment methods" ON venue_payment_methods
    FOR SELECT USING (true);

-- BOOKINGS: Solo participantes pueden ver
CREATE POLICY "Clients can view own bookings" ON bookings
    FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Providers can view their venue bookings" ON bookings
    FOR SELECT USING (auth.uid() = provider_id);

CREATE POLICY "Clients can create bookings" ON bookings
    FOR INSERT WITH CHECK (auth.uid() = client_id);

-- REVIEWS: Público para leer, autenticados para escribir
CREATE POLICY "Anyone can view reviews" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- MESSAGES: Solo participantes
CREATE POLICY "Conversation participants can view messages" ON messages
    FOR SELECT USING (
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Participants can send messages" ON messages
    FOR INSERT WITH CHECK (
        auth.uid() = sender_id AND
        conversation_id IN (
            SELECT conversation_id FROM conversation_participants WHERE user_id = auth.uid()
        )
    );

-- FAQS: Público
CREATE POLICY "Anyone can view FAQs" ON faqs
    FOR SELECT USING (true);

-- USER_FAVORITES: Solo el dueño
CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- USER_RECENTLY_VIEWED: Solo el dueño
CREATE POLICY "Users can manage own recently viewed" ON user_recently_viewed
    FOR ALL USING (auth.uid() = user_id);

-- ==================== DATOS INICIALES ====================

-- Insertar usuarios de prueba
-- Contraseña para todos: "123456" (hasheada)
INSERT INTO users (id, email, password_hash, name, phone, role, verification_status) VALUES
    ('11111111-1111-1111-1111-111111111111', 'cliente@eventspace.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'María García', '+52 55 1234 5678', 'CLIENTE', NULL),
    ('22222222-2222-2222-2222-222222222222', 'proveedor@eventspace.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Carlos Rodríguez', '+52 55 9876 5432', 'PROVEEDOR', 'VERIFIED'),
    ('33333333-3333-3333-3333-333333333333', 'admin@eventspace.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Admin EventSpace', '+52 55 0000 0000', 'ADMIN', NULL);

-- Insertar FAQs
INSERT INTO faqs (question, answer, category) VALUES
    ('¿Cómo puedo reservar un local?', 'Navega al local que te interesa, selecciona la fecha disponible y haz clic en "Reservar". Recibirás confirmación por email.', 'Reservaciones'),
    ('¿Cuáles son los métodos de pago aceptados?', 'Aceptamos transferencia bancaria y pago en efectivo. El método específico depende de cada proveedor.', 'Pagos'),
    ('¿Puedo cancelar mi reservación?', 'Sí, puedes cancelar hasta 48 horas antes del evento sin cargo. Consulta la política de cada local.', 'Reservaciones'),
    ('¿Cómo me convierto en proveedor?', 'Los proveedores son creados por administradores. Contacta a soporte para iniciar el proceso de verificación.', 'Proveedores'),
    ('¿Es segura la plataforma?', 'Sí, usamos encriptación SSL, verificamos proveedores y protegemos tus datos personales.', 'Seguridad');

-- Insertar locales de ejemplo
INSERT INTO venues (id, provider_id, name, description, address, zone, category, price, capacity, status, rating, review_count, views, favorites) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '22222222-2222-2222-2222-222222222222', 
     'Hacienda Los Arcos', 'Hermosa hacienda colonial con amplios jardines y capilla privada. Ideal para bodas y eventos elegantes.',
     'Km 45 Carretera México-Cuernavaca', 'Xochimilco', 'HACIENDA', 85000.00, 300, 'FEATURED', 4.8, 127, 3420, 234),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222',
     'Terraza Skyline CDMX', 'Terraza rooftop con vista panorámica de la ciudad. Perfecta para eventos corporativos y cócteles.',
     'Av. Reforma 500, Piso 40', 'Polanco', 'TERRAZA', 120000.00, 150, 'ACTIVE', 4.6, 89, 2150, 178),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222',
     'Jardín Botánico Roma', 'Jardín secreto en el corazón de la Roma. Ambiente íntimo rodeado de vegetación exuberante.',
     'Calle Orizaba 127', 'Roma Norte', 'JARDIN', 45000.00, 100, 'ACTIVE', 4.9, 56, 1890, 145);

-- Insertar imágenes de venues
INSERT INTO venue_images (venue_id, url, display_order) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800', 0),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://images.unsplash.com/photo-1464366400600-1ae0fe772534?w=800', 1),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', 0),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'https://images.unsplash.com/photo-1510076857177-7470076d4098?w=800', 0);

-- Insertar amenidades
INSERT INTO venue_amenities (venue_id, name) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Estacionamiento'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Cocina industrial'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Capilla'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Wi-Fi'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Vista panorámica'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Bar equipado'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'Wi-Fi'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Jardín privado'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'Iluminación decorativa');

-- Insertar métodos de pago
INSERT INTO venue_payment_methods (venue_id, method) VALUES
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'TRANSFERENCIA'),
    ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'EFECTIVO'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'TRANSFERENCIA'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'TRANSFERENCIA'),
    ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'EFECTIVO');

-- ==================== TRIGGERS DE AUTH (CRUCIAL) ====================
-- Sincroniza auth.users con public.users automáticamente

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'Usuario Nuevo'),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'CLIENTE')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Elimina el trigger si existe para evitar duplicados
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==================== FUNCIONES Y TRIGGERS ====================

-- Función para actualizar rating promedio de un venue
CREATE OR REPLACE FUNCTION update_venue_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE venues
    SET 
        rating = (SELECT COALESCE(AVG(rating), 0) FROM reviews WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id)),
        review_count = (SELECT COUNT(*) FROM reviews WHERE venue_id = COALESCE(NEW.venue_id, OLD.venue_id))
    WHERE id = COALESCE(NEW.venue_id, OLD.venue_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar rating cuando se agrega/modifica/elimina reseña
CREATE TRIGGER trigger_update_venue_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_venue_rating();

-- Función para actualizar contador de favoritos
CREATE OR REPLACE FUNCTION update_venue_favorites()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE venues SET favorites = favorites + 1 WHERE id = NEW.venue_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE venues SET favorites = favorites - 1 WHERE id = OLD.venue_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_venue_favorites
AFTER INSERT OR DELETE ON user_favorites
FOR EACH ROW EXECUTE FUNCTION update_venue_favorites();

-- ==================== REPARACIÓN DE USUARIOS EXISTENTES ====================
-- Ejecuta esto para crear perfiles de usuarios que ya se registraron pero no tienen perfil
INSERT INTO public.users (id, email, name, role)
SELECT 
    id, 
    email, 
    COALESCE(raw_user_meta_data->>'name', 'Usuario Existente'),
    COALESCE((raw_user_meta_data->>'role')::user_role, 'CLIENTE')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT DO NOTHING;

-- ============================================================
-- ¡LISTO! Tu base de datos está configurada
-- 
-- Tablas creadas: 13
-- Funciones Auth: Configured
-- ============================================================
