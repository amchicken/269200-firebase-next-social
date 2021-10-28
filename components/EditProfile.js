import { UserContext } from "@utils/context";
import { storage } from "@lib/firebase";
import { useContext, useState } from "react";
import { useForm } from "@utils/useForm";
import Image from "next/image";
import toast from "react-hot-toast";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";

export default function EditProfile() {
  const { user, updateUser } = useContext(UserContext);
  const [userdetail, onChange] = useForm(user);
  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 3145728) {
        toast.error("FILE TO LARGE !");
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
    <div className="profile__edit__container">
      <form onSubmit={updateUserDetails} className="card form__create max-w">
        <div className="form__create__title-group">
          <h2>displayName</h2>
          <input
            type="text"
            name="displayName"
            value={userdetail.displayName || ""}
            onChange={onChange}
            required
          />
        </div>
        <div className="form__create__title-group">
          <h2>bio</h2>
          <input
            type="text"
            name="bio"
            value={userdetail.bio || ""}
            onChange={onChange}
          />
        </div>
        {!image && (
          <div className="form__create__upload-group">
            <div className="image-upload">
              <input
                type="file"
                onChange={onImageChange}
                accept="image/jpeg,image/png,image/gif"
              />
              <div className="custom-file-upload">
                <InsertPhotoIcon />
                Upload profile picture
              </div>
            </div>
          </div>
        )}
        {image && (
          <>
            <div className="form__create__image-group">
              <button
                onClick={() => {
                  setFile(null);
                  setImage(null);
                }}
                className="form__create__image-group__clear-btn"
              >
                <CloseIcon />
              </button>
              <div className="post__photo">
                <Image
                  src={image}
                  alt="preview image"
                  width="680"
                  height="640"
                />
              </div>
            </div>
          </>
        )}
        <button type="submit">UpdateProfile</button>
      </form>
    </div>
  );
}
