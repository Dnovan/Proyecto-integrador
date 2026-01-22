/**
 * @fileoverview Cliente de Supabase para EventSpace
 * @description Configuración del cliente Supabase con funciones de autenticación
 */

import { createClient, type SupabaseClient, type User, type Session } from '@supabase/supabase-js';

// Configuración de Supabase desde variables de entorno
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verificar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn(
        '⚠️ Supabase no configurado. Usando datos mock.',
        'Para habilitar Supabase, configura VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env'
    );
}

/**
 * Cliente de Supabase
 */
export const supabase: SupabaseClient = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
        auth: {
            autoRefreshToken: true,
            persistSession: true,
            detectSessionInUrl: true,
        },
    }
);

/**
 * Verifica si Supabase está configurado correctamente
 */
export const isSupabaseConfigured = (): boolean => {
    return Boolean(
        supabaseUrl &&
        supabaseAnonKey &&
        supabaseUrl !== 'https://placeholder.supabase.co' &&
        import.meta.env.VITE_USE_SUPABASE === 'true'
    );
};

/**
 * Helper para manejar errores de Supabase
 */
export const handleSupabaseError = (error: unknown): string => {
    if (error && typeof error === 'object' && 'message' in error) {
        const msg = (error as { message: string }).message;
        // Traducir errores comunes
        if (msg.includes('Invalid login credentials')) {
            return 'Credenciales inválidas';
        }
        if (msg.includes('Email not confirmed')) {
            return 'Email no verificado. Revisa tu bandeja de entrada.';
        }
        if (msg.includes('User already registered')) {
            return 'Este email ya está registrado';
        }
        return msg;
    }
    return 'Error desconocido';
};

// ==================== FUNCIONES DE AUTENTICACIÓN ====================

/**
 * Registra un nuevo usuario con Supabase Auth
 * Envía email de verificación automáticamente
 */
export const signUp = async (email: string, password: string, metadata?: { name: string; phone?: string }) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
                name: metadata?.name || '',
                phone: metadata?.phone || '',
            },
        },
    });

    if (error) {
        throw new Error(handleSupabaseError(error));
    }

    // Si el registro fue exitoso, crear entrada en tabla users
    if (data.user) {
        await createUserProfile(data.user, metadata);
    }

    return data;
};

/**
 * Crea el perfil del usuario en la tabla users
 */
const createUserProfile = async (authUser: User, metadata?: { name: string; phone?: string }) => {
    const { error } = await supabase.from('users').insert([{
        id: authUser.id,
        email: authUser.email,
        password_hash: '', // No guardamos la contraseña, Supabase Auth la maneja
        name: metadata?.name || authUser.email?.split('@')[0] || 'Usuario',
        phone: metadata?.phone || null,
        role: 'CLIENTE',
        created_at: new Date().toISOString(),
    }]);

    if (error && !error.message.includes('duplicate')) {
        console.error('Error creating user profile:', error);
    }
};

/**
 * Inicia sesión con email y contraseña
 * Verifica que el email esté confirmado
 */
export const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        throw new Error(handleSupabaseError(error));
    }

    // Verificar que el email esté confirmado
    if (data.user && !data.user.email_confirmed_at) {
        await supabase.auth.signOut();
        throw new Error('Email no verificado. Revisa tu bandeja de entrada.');
    }

    return data;
};

/**
 * Cierra sesión
 */
export const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        throw new Error(handleSupabaseError(error));
    }
};

/**
 * Obtiene la sesión actual
 */
export const getSession = async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session;
};

/**
 * Obtiene el usuario actual de Supabase Auth
 */
export const getCurrentAuthUser = async (): Promise<User | null> => {
    const { data } = await supabase.auth.getUser();
    return data.user;
};

/**
 * Reenvía el email de verificación
 */
export const resendVerificationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
    });

    if (error) {
        throw new Error(handleSupabaseError(error));
    }
};

/**
 * Verifica si un usuario de Supabase Auth tiene email confirmado
 */
export const isEmailVerified = (user: User | null): boolean => {
    return Boolean(user?.email_confirmed_at);
};

/**
 * Obtiene los datos del usuario de la tabla users
 */
export const getUserProfile = async (userId: string) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

    if (error) {
        return null;
    }

    return data;
};

/**
 * Suscribe a cambios de autenticación
 */
export const onAuthStateChange = (callback: (event: string, session: Session | null) => void) => {
    return supabase.auth.onAuthStateChange((event, session) => {
        callback(event, session);
    });
};

export default supabase;
