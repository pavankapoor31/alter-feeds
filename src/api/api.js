
import { signInWithPopup } from "firebase/auth";
import { auth,googleProvider } from "/src/_auth/firebaseConfig.js"
export  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const { uid, displayName, email, photoURL } = user;
      const defaultUrl =   `https://api.dicebear.com/7.x/initials/svg?seed=${email}`;
      const defaultProfilePic = photoURL || defaultUrl;
      return user;
    } catch (error) {
      console.error("Google Login Error:", error.message);
    }
  };