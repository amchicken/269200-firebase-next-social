import { auth, firestore } from "@lib/firebase";
import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);

  auth.onAuthStateChanged(async function (user) {
    setLoading(true);
    if (user) {
      setUser(user);
    }
    setLoading(false);
  });

  return [user, loading];
};
