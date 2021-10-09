import { auth } from "@lib/firebase";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { useForm } from "@utils/useForm";
import { useState } from "react";

export default function Home() {
  console.log(auth.currentUser);

  const [signup, onSignupChange] = useForm({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(signup.email, signup.password)
      .then((userCredential) => {
        // Signed in
        console.log(userCredential.user);
        // ...
      })
      .catch((error) => {
        setError(error.message);
        // ..
      });
  };

  return (
    <div>
      {auth && (
        <JSONPretty
          data={JSON.stringify(auth.currentUser)}
          theme={JSONPrettyMon}
        />
      )}
      <>
        <h3 style={{ color: "tomato" }}>{error}</h3>
        <div>
          <input
            type="email"
            name="email"
            value={signup.email}
            onChange={onSignupChange}
          />
          <input
            type="password"
            name="password"
            value={signup.password}
            onChange={onSignupChange}
          />
          <button onClick={handleSignup}>Register</button>
        </div>
        <div>
          {/* <input type="email" />
            <input type="password" /> */}
        </div>
      </>
    </div>
  );
}
