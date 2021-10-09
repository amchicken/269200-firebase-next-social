import { useContext } from "react";
import { UserContext } from "@utils/context";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { auth } from "@lib/firebase";
import EditProfile from "@components/EditProfile";

export default function Index() {
  const { user } = useContext(UserContext);

  return (
    <div>
      welcome {user.email}
      <JSONPretty data={JSON.stringify(user)} theme={JSONPrettyMon} />
      <EditProfile />
      <button onClick={() => auth.signOut()}>Logout</button>
    </div>
  );
}
