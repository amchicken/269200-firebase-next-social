import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import CreatePost from "@components/CreatePost";
import PostFeed from "@components/PostFeed";
import Loader from "@components/Loader";
import Nav from "@components/Nav";
import Image from "next/image";
import { useContext } from "react";
import { UserContext } from "@utils/context";

export default function Index() {
  const { user } = useContext(UserContext);
  return (
    <>
      <Nav />
      <div className="app__container flex index">
        <div className="index__left">
          <ul className="index__left__menu">
            <li>
              <div className="relative index__left__menu__photo photo">
                <Image
                  src={user.photoURL || "/default.png"}
                  alt="profile-photo"
                  layout="fill"
                />
              </div>
              <div>
                <b>{user.displayName}</b>
              </div>
            </li>
          </ul>
        </div>
        <div className="index__center">
          <CreatePost />
          <PostFeed />
        </div>
        <div className="index__right">Message</div>
      </div>
    </>
  );
}
