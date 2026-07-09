import { auth } from './firebase.js'
import { createContext, useContext, useState, useEffect } from 'react'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    updateProfile,
    onAuthStateChanged,
   } from 'firebase/auth'

   
const AuthContext = createContext(null);

export const AuthProvider = ({children}) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false);
        })
        return unsubscribe;
    },[])

    const signIn = async (name, email, password) => {
        const createduser =
            await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
        console.log("The user is created");
        await updateProfile(createduser.user, { displayName: name });
    }
    
    const LogIn = async (email, password) => {
        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    }

    const LogOut = async() => {
        await signOut(auth);
    }

    const value = {
        signIn,
        LogIn,
        isLoggedIn: !!user,
        loading,
        LogOut
    }

    return <AuthContext.Provider value={value}> {children} </AuthContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);


// export const isLoggedIn = async () => {
//     await onAuthStateChanged(auth, (user) => {
//         if (user)
//     })
// }