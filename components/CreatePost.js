import { useContext, useState } from "react";
import { UserContext } from "@utils/context";
import { useForm } from "@utils/useForm";
import { firestore, serverTimestamp, storage } from "@lib/firebase";
import Image from "next/image";
import toast from "react-hot-toast";
import InsertPhotoIcon from "@mui/icons-material/InsertPhoto";
import CloseIcon from "@mui/icons-material/Close";

export default function CreatePost() {
  const { user } = useContext(UserContext);

  const init = {
    createdBy: user.id,
    createdAt: serverTimestamp,
    content: "",
    photoURL: null,
    lastComment: null,
    lastLike: null,
    like: [],
    likes: 0,
    comment: [],
    comments: 0,
  };

  const [createForm, onChange, setForm] = useForm(init);
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
      console.log(file);
    }
  };

  function createPost(e) {
    e.preventDefault();
    if (file) {
      const ref = storage.ref(`${user.id}/posts/${file.name}`);
      const uploadTask = ref.put(file);
      uploadTask.on("state_changed", console.log, console.error, () => {
        ref.getDownloadURL().then((url) => {
          commitPost(url);
          setImage(null);
        });
      });
    } else {
      if (createForm.content === "")
        toast.error("can't create post on empty string");
      else commitPost(null);
    }
  }

  const commitPost = async (url) => {
    const template = { ...createForm, photoURL: url };
    firestore
      .collection("posts")
      .doc()
      .set(template)
      .then(() => setForm(init))
      .catch((err) => console.log(err));
  };

  return (
    <div className="create">
      <form onSubmit={createPost} className="card form__create">
        <div className="form__create__title-group">
          <div className="photo">
            <Image
              src={user.photoURL || "./default.png"}
              layout="fill"
              alt="profile-picture"
            />
          </div>
          <input
            type="text"
            value={createForm.content}
            onChange={onChange}
            name="content"
            placeholder={`What's on your mind, ${user.displayName}`}
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
                photo
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

        <button type="submit" className="form__create__post">
          Post
        </button>
      </form>
    </div>
  );
}
