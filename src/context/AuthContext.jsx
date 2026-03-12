import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../services/firebase";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const login = async () => {
        if (!auth) {
            console.warn('Firebase auth not available');
            return null;
        }
        const { signInWithPopup, GoogleAuthProvider } = await import("firebase/auth");
        const { doc, setDoc, getDoc } = await import("firebase/firestore");
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const userRef = doc(db, "users", result.user.uid);
            const userSnap = await getDoc(userRef);
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: result.user.email,
                    displayName: result.user.displayName,
                    photoURL: result.user.photoURL,
                    createdAt: new Date().toISOString()
                });
            }
            return result.user;
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const logout = async () => {
        if (!auth) return;
        const { signOut } = await import("firebase/auth");
        return signOut(auth);
    };

    useEffect(() => {
        if (!auth) {
            // No Firebase — skip auth, render immediately
            setLoading(false);
            return;
        }

        let resolved = false;

        const importAndSubscribe = async () => {
            try {
                const { onAuthStateChanged } = await import("firebase/auth");
                const unsubscribe = onAuthStateChanged(auth, (user) => {
                    resolved = true;
                    setCurrentUser(user);
                    setLoading(false);
                });
                return unsubscribe;
            } catch (e) {
                console.warn('Firebase auth subscription failed:', e);
                setLoading(false);
                return () => { };
            }
        };

        let unsub = () => { };
        importAndSubscribe().then(u => { unsub = u; });

        // Fallback: if Firebase doesn't respond in 2 seconds, render anyway
        const timeout = setTimeout(() => {
            if (!resolved) {
                console.warn('Firebase auth timeout — continuing as unauthenticated');
                setLoading(false);
            }
        }, 2000);

        return () => {
            unsub();
            clearTimeout(timeout);
        };
    }, []);

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
