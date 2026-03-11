'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { account, ID } from '@/lib/appwrite-client';
import { Models } from 'appwrite';
import { useRouter } from 'next/navigation';

interface AuthContextType {
    user: Models.User<Models.Preferences> | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, pass: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, pass: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        checkUser();
    }, []);

    const checkUser = async () => {
        try {
            const session = await account.get();
            setUser(session);
        } catch (error) {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, pass: string) => {
        setLoading(true);
        try {
            await account.createEmailPasswordSession(email, pass);
            const userResponse = await account.get();
            setUser(userResponse);
            router.push('/dashboard');
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, pass: string, name: string) => {
        setLoading(true);
        try {
            await account.create(ID.unique(), email, pass, name);
            await login(email, pass);
        } catch (error) {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await account.deleteSession('current');
            setUser(null);
            router.push('/login');
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const isAdmin = user?.labels?.includes('admin') || false;

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
