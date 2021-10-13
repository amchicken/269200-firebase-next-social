import { useContext } from "react";
import { UserContext } from "@utils/context";
import { useForm } from "@utils/useForm";
import { firestore, serverTimestamp } from "@lib/firebase";

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

  const createPost = async (e) => {
    e.preventDefault();
    firestore
      .collection("posts")
      .doc()
      .set(createForm)
      .then(() => {
        console.log("success add");
        setForm(init);
      })
      .catch((err) => console.log(err));
  };

  return (
    <form onSubmit={createPost}>
      <input
        type="text"
        value={createForm.content}
        onChange={onChange}
        name="content"
      />

      <input type="file" accept="image/png" />

      <button type="submit">create post</button>
    </form>
  );
}
