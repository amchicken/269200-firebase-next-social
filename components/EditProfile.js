import { UserContext } from "@utils/context";
import { storage } from "@lib/firebase";
import { useContext, useState } from "react";
import { useForm } from "@utils/useForm";
import Image from "next/image";

export default function EditProfile() {
  const { user, updateUser } = useContext(UserContext);
  const [userdetail, onChange] = useForm(user);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 3145728) {
        console.log("FILE TO LARGE !");
        return;
      }
      setImage(URL.createObjectURL(event.target.files[0]));
      setFile(event.target.files[0]);
    }
  };

  function updateUserDetails(e) {
    e.preventDefault();
    const ref = storage.ref(`${user.id}/profile`);
    const uploadTask = ref.put(file);
    if (file) {
      uploadTask.on("state_changed", () => {
        ref.getDownloadURL().then((url) => {
          if (url) updateUser({ ...userdetail, photoURL: url });
        });
      });
    } else updateUser(userdetail);
  }

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
          type="file"
          name="photoURL"
          onChange={onImageChange}
          accept="image/jpeg,image/png,image/gif"
        />
        <div style={{ width: "100px", height: "100px", position: "relative" }}>
          {image && <Image src={image} alt="preview image" layout="fill" />}
        </div>
        <button type="submit">UpdateProfile</button>
      </form>
    </div>
  );
}
