import { useContext } from "react";
import { UserContext } from "@utils/context";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { auth } from "@lib/firebase";
import EditProfile from "@components/EditProfile";
import CreatePost from "@components/CreatePost";
import PostFeed from "@components/PostFeed";

export default function Index() {
  const { user } = useContext(UserContext);

  return (
    <div>
      welcome {user.email}
      <JSONPretty data={JSON.stringify(user)} theme={JSONPrettyMon} />
      <EditProfile />
      <button onClick={() => auth.signOut()}>Logout</button>
      <div>
        <h2>Create posts</h2>
        <CreatePost />
        <PostFeed />
      </div>
    </div>
  );
}
