import { UserContext } from "@utils/context";
import { useContext } from "react";
import { useForm } from "@utils/useForm";

export default function EditProfile() {
  const { user, updateUser } = useContext(UserContext);
  const [userdetail, onChange] = useForm(user);
  console.log(userdetail);

  const updateUserDetails = async (e) => {
    e.preventDefault();
    updateUser(userdetail);
  };

  return (
    <div>
      <form onSubmit={updateUserDetails}>
        displayName
        <input
          type="text"
          name="displayName"
          value={userdetail.displayName || ""}
          onChange={onChange}
          required
        />
        bio
        <input
          type="text"
          name="bio"
          value={userdetail.bio || ""}
          onChange={onChange}
        />
        photoURL
        <input
          type="text"
          name="photoURL"
          value={userdetail.photoURL || ""}
          onChange={onChange}
        />
        <button type="submit">UpdateProfile</button>
      </form>
    </div>
  );
}
