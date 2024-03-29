import { auth, firestore } from "@lib/firebase";
import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const useAuth = () => {
  const [authUser, authLoading] = useAuthState(auth);
  const [user, setUser] = useState(authUser);
  const [loading, setLoading] = useState(authLoading);

  useEffect(() => {
    async function getUserData() {
      setLoading(true);
      if (authUser) {
        const ref = firestore.collection("usernames").doc(authUser.uid);
        const userData = await ref.get();
        if (userData.exists) {
          setUser({ ...userData.data(), id: authUser.uid });
        } else {
          const template = {
            email: authUser.email,
            photoURL: authUser.photoURL,
            displayName: null,
            bio: null,
          };
          ref
            .set(template)
            .then(() => setUser({ ...template, id: authUser.uid }));
        }
      } else {
        //user logout
        setUser(null);
      }
      setLoading(false);
    }

    getUserData();
  }, [authUser]);

  const updateUser = (userobject) => {
    const data = { ...userobject };
    delete data.id;
    firestore.collection("usernames").doc(userobject.id).set(data);
    auth.currentUser.updateProfile(data).then(() => setUser(userobject));
  };

  return [user, loading, updateUser];
};
