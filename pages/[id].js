import Nav from "@components/Nav";
import { useRouter } from "next/router";
import Header from "@components/Header";
import { useState, useEffect, useContext, useRef } from "react";
import { firestore } from "@lib/firebase";
import Image from "next/image";
import UserFeed from "@components/UserFeed";
import { UserContext } from "@utils/context";
import EditProfile from "@components/EditProfile";

export default function Profile() {
  const { user } = useContext(UserContext);
  const isCurrent = useRef(true);
  const router = useRouter();
  const profileId = router.query.id;
  const [profile, setProfile] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return () => {
      isCurrent.current = false;
    };
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);
      const userData = (
        await firestore.collection("usernames").doc(profileId).get()
      ).data();
      setProfile({
        id: profileId,
        ...userData,
      });
      setLoading(false);
    };

    if (isCurrent.current) getProfile();
  }, [profileId]);

  return loading ? (
    <div>Loading..</div>
  ) : (
    <>
      <Header title={profile.displayName} />
      <Nav />
      <div className="app__container">
        <div className="photo relative">
          <Image
            src={profile.photoURL || "/default.png"}
            alt="profile-photo"
            layout="fill"
          />
        </div>
        <h2>{profile.displayName}</h2>
        <span>{profile.bio}</span>
        {profileId === user.id ? <EditProfile /> : null}
        <UserFeed id={profileId} />
      </div>
    </>
  );
}
