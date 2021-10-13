import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@utils/context";
import { auth } from "@lib/firebase";
import Link from "next/link";

export default function Nav() {
  const { user } = useContext(UserContext);

  return (
    <nav className="nav">
      <div className="nav__left">
        <Link href="/" passHref>
          <div className="logo">
            <Image src="/default.png" layout="fill" alt="logo" />
          </div>
        </Link>
      </div>
      {/* <div className="nav__middle">Heelo</div> */}
      <div className="nav__right">
        <Link href={`/${user.id}`} passHref>
          <div className="nav__right__profile">
            <div className="nav__right__profile__photo">
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
