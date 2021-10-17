import { useContext, useState } from "react";
import { UserContext } from "@utils/context";
import { useForm } from "@utils/useForm";
import { firestore, serverTimestamp, storage } from "@lib/firebase";
import Image from "next/image";

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
    comments: 0,
  };

  const [createForm, onChange, setForm] = useForm(init);
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
      commitPost(null);
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
    <form onSubmit={createPost} className="card">
      <input
        type="text"
        value={createForm.content}
        onChange={onChange}
        name="content"
        placeholder={`What's on your mind, ${user.displayName}`}
      />
      <input
        type="file"
        onChange={onImageChange}
        accept="image/jpeg,image/png,image/gif"
      />
      <div style={{ width: "100px", height: "100px", position: "relative" }}>
        {image && <Image src={image} alt="preview image" layout="fill" />}
      </div>

      <button type="submit">create post</button>
    </form>
  );
}
