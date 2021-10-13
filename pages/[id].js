import Nav from "@components/Nav";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { useState, useEffect } from "react";
import { firestore } from "@lib/firebase";
import Image from "next/image";

export default function Profile() {
  const router = useRouter();
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const userData = (
        await firestore.collection("usernames").doc(router.query.id).get()
      ).data();
      setProfile({
        ...userData,
        id: router.query.id,
      });
      setLoading(false);
    };
    getProfile();
  }, [router.query.id]);

  useEffect(() => {
    console.log(profile, loading);
  }, [profile, loading]);

  return loading ? (
    <div>Loading..</div>
  ) : (
    <>
      <Header title={profile.displayName} />
      <Nav />
      <div className="app__container">
        <div className="relative">
          <Image
            src={profile.photoURL || "/default.png"}
            alt="profile-photo"
            layout="fill"
          />
        </div>
        <h2>{profile.displayName}</h2>
        <span>{profile.bio}</span>
      </div>
    </>
  );
}
