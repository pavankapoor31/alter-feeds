import { doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "/src/_auth/firebaseConfig.js";

/**
 * Fetches user details from the Firestore "users" collection by UID.
 * @param {string} uid - The UID of the user.
 * @returns {Promise<Object|null>} The user details if found, otherwise null.
 */
import { collection, query, where } from "firebase/firestore";

export const fetchUserDetails = async (uid) => {
    if (!uid) {
        console.error("UID is required to fetch user details.");
        return null;
    }

    try {

        const citiesRef = collection(db, "users");
        const q = query(citiesRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);
        let data=null
        querySnapshot.forEach((doc) => {
            if(doc.data())
                data =  doc.data()
          });
        if(data) return data;       
    } catch (error) {
        console.error("Error fetching user details:", error);
        return null; // Return null in case of an error
    }
};
