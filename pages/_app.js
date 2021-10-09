import "../styles/globals.css";
import { useAuth } from "@utils/useAuth";
import { UserContext } from "@utils/context";
import Auth from "@components/Auth";
import EditProfile from "@components/EditProfile";

function MyApp({ Component, pageProps }) {
  const [user, loading, updateUser] = useAuth();

  if (loading) return <div> Loading...</div>;
  if (!user) return <Auth />;

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {!user.displayName ? <EditProfile /> : <Component {...pageProps} />}
    </UserContext.Provider>
  );
}

export default MyApp;
