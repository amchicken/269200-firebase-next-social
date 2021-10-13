import "../styles/globals.scss";
import { useAuth } from "@utils/useAuth";
import { UserContext } from "@utils/context";
import Auth from "@components/Auth";
import EditProfile from "@components/EditProfile";
import Header from "@components/Header";

function MyApp({ Component, pageProps }) {
  const [user, loading, updateUser] = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Auth />;

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <Header />
      {!user.displayName ? (
        <div>
          FRIST TIME update displayName <EditProfile />
        </div>
      ) : (
        <Component {...pageProps} />
      )}
    </UserContext.Provider>
  );
}

export default MyApp;
