import { auth } from "@lib/firebase";
import { useForm } from "@utils/useForm";
import { useState } from "react";

const format = {
  email: "",
  password: "",
};

export default function Auth() {
  const [window, setWindow] = useState(true);

  const [signup, onSignupChange] = useForm(format);
  const [signin, onSigninChange] = useForm(format);

  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

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
      .catch((error) => setLoginError(error.message));
  };

  return (
    <div className="container flex auth">
      <div className="auth__left">
        <h1>SOCIAL</h1>
        <h4>269200</h4>
        <span>ez register and login brand new social app</span>
      </div>
      <div className="auth__right">
        {!window ? (
          <form onSubmit={handleSignup}>
            {error && <h3 style={{ color: "tomato" }}>{error}</h3>}
            <input
              placeholder="email"
              type="email"
              name="email"
              value={signup.email}
              onChange={onSignupChange}
              autoComplete="off"
            />
            <input
              placeholder="password"
              type="password"
              name="password"
              value={signup.password}
              onChange={onSignupChange}
            />

            <button type="submit" className="auth__right__register">
              Register
            </button>
            <button
              onClick={() => setWindow(!window)}
              className="auth__right__toside"
            >
              {!window ? "go to login" : "registartion"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            {loginError && <h3 style={{ color: "tomato" }}>{loginError}</h3>}
            <input
              type="email"
              name="email"
              value={signin.email}
              onChange={onSigninChange}
              placeholder="email"
              autoComplete="off"
            />
            <input
              type="password"
              name="password"
              value={signin.password}
              onChange={onSigninChange}
              placeholder="password"
            />

            <button type="submit" className="auth__right__register">
              login
            </button>
            <button
              onClick={() => setWindow(!window)}
              className="auth__right__toside"
            >
              {!window ? "go to login" : "registartion"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
