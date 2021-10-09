import { auth } from "@lib/firebase";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { useForm } from "@utils/useForm";
import { useState } from "react";

export default function Auth() {
  const [window, setWindow] = useState(false);

  const [signup, onSignupChange] = useForm({
    email: "",
    password: "",
  });

  const [signin, onSigninChange] = useForm({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    auth
      .createUserWithEmailAndPassword(signup.email, signup.password)
      .catch((error) => setError(error.message));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(signin.email, signin.password)
      .catch((error) => setError(error.message));
  };

  return (
    <div>
      <JSONPretty
        data={JSON.stringify(auth.currentUser)}
        theme={JSONPrettyMon}
      />
      <>
        <h3 style={{ color: "tomato" }}>{error}</h3>
        {auth.currentUser === null ? (
          <button onClick={() => setWindow(!window)}>
            {!window ? "go to login" : "registartion"}
          </button>
        ) : (
          <button onClick={() => auth.signOut()}>Logout</button>
        )}
        {auth.currentUser === null ? (
          <>
            {!window ? (
              <form onSubmit={handleSignup}>
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
                <button type="submit">Register</button>
              </form>
            ) : (
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  name="email"
                  value={signin.email}
                  onChange={onSigninChange}
                />
                <input
                  type="password"
                  name="password"
                  value={signin.password}
                  onChange={onSigninChange}
                />
                <button type="submit">login</button>
              </form>
            )}
          </>
        ) : null}
      </>
    </div>
  );
}
