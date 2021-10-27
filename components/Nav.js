import Image from "next/image";
import { useContext, useState, useEffect } from "react";
import { UserContext } from "@utils/context";
import { auth, firestore } from "@lib/firebase";
import { useClickOutSide } from "@utils/useClickOutSide";
import Link from "next/link";

export default function Nav() {
  const { user } = useContext(UserContext);

  return (
    <nav className="nav">
      <div className="nav__left flex">
        <Link href="/" passHref>
          <div className="logo">
            <Image src="/default.png" layout="fill" alt="logo" />
          </div>
        </Link>
        <FindUser />
      </div>
      {/* <div className="nav__middle"> */}

      {/* </div> */}
      <div className="nav__right">
        <Link href={`/${user.id}`} passHref>
          <div className="nav__right__profile">
            <div className="photo nav__right__profile__photo ">
              <Image
                src={user.photoURL || "default.png"}
                layout="fill"
                alt="profile-photo"
              />
            </div>
            <h5>{user.displayName}</h5>
          </div>
        </Link>
        <div className="nav__right__group">
          <button
            className="button"
            style={{ color: "white" }}
            onClick={() => auth.signOut()}
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

function FindUser() {
  const [find, setFind] = useState("");
  const [query, setQuery] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultShow, setResultShow] = useState(false);
  const searchRes = useClickOutSide(() => {
    setResultShow(false);
    setQuery();
  });

  useEffect(() => {
    const some = setTimeout(() => {
      setQuery([]);
      setNotFound(false);

      if (find.length > 0) {
        setLoading(true);
        firestore
          .collection("usernames")
          .where("displayName", "==", find)
          .get()
          .then((collection) => {
            collection.docs.map((doc) =>
              setQuery((q) => [...q, { id: doc.id, ...doc.data() }])
            );
            setLoading(false);
            setResultShow(true);
            if (!collection.size > 0) setNotFound(true);
          });
      }
    }, 800);

    return () => {
      clearTimeout(some);
    };
  }, [find]);

  return (
    <div className="nav__left__serchbox" ref={searchRes}>
      <input
        type="text"
        value={find}
        onChange={(e) => setFind(e.target.value)}
      />
      {resultShow ? (
        <ul>
          {notFound ? (
            <li>NotFound</li>
          ) : (
            query.map((doc) => (
              <Link href={`/${doc.id}`} passHref key={doc.id}>
                <li className="">
                  <div className="photo photo__li">
                    <Image
                      src={doc.photoURL}
                      layout="fill"
                      alt="profile picture"
                    />
                  </div>
                  <h4>{doc.displayName}</h4>
                </li>
              </Link>
            ))
          )}
        </ul>
      ) : null}
    </div>
  );
}
