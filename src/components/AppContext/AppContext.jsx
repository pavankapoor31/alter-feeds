import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import React, { createContext, useState, useEffect } from 'react'
import { auth, db } from '../../_auth/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
export const AuthContext = createContext();
const AppContext = ({ children }) => {
    const navigate = useNavigate();
    const collectionUsersRef = collection(db, "users");
    const provider = new GoogleAuthProvider();
    const [user, setUser] = useState()
    const [userData, setUserData] = useState()

    const signInWithGoogle = async () => {

        try {
            const popup = await signInWithPopup(auth, provider)
            const user = popup.user;
            const q = query(collectionUsersRef, where("uid", "==", user.uid));
            const docs = await getDocs(q);
            const defaultUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${user?.email}`;
            if (docs.docs.length === 0) {
                await addDoc(collectionUsersRef, {
                    uid: user?.uid,
                    name: user?.displayName,
                    email: user?.email,
                    image: user?.photoURL || defaultUrl,
                    authProvider: popup?.providerId
                })
            }
        }
        catch (err) {
            console.error(err, "Error in login")
        }

    }
    const signOutUser = async () => {
        await signOut(auth);
    }

    const userStateChanged = async () => {
        onAuthStateChanged(auth, async (user) => {
            if (user) {
                const q = query(collectionUsersRef, where("uid", "==", user.uid));
                await onSnapshot(q, (doc) => {
                    setUserData(doc.docs[0]?.data())
                });
                setUser(user)
                // navigate('/home')
            }
            else {
                setUser(null);
                // navigate('/register')
            }
        })
    }

    const initialState = {
        signInWithGoogle,
        signOutUser,
        user,
        userData
    };

    useEffect(() => {
        userStateChanged();
        if (user || userData) {
            navigate('/home')
        }
        else {
            // navigate('/register');
        }
        return () => userStateChanged();
    }, [])
    return (
        <div>
            <AuthContext.Provider value={initialState}>
                {children}
            </AuthContext.Provider>
        </div>
    )
}

export default AppContext