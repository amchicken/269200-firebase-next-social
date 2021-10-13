import { useState, useEffect, useCallback, useContext } from "react";
import { firestore, arrayUnion, arrayRemove, Increment } from "@lib/firebase";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { UserContext } from "@utils/context";
import { useClickOutSide } from "@utils/useClickOutSide";
import Image from "next/image";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  useState(() => {
    firestore
      .collection("posts")
      .orderBy("createdAt", "desc")
      .limit(2)
      .onSnapshot((collection) => {
        const posts = collection.docs.map((res) => {
          return {
            ...res.data(),
            id: res.id,
          };
        });
        setPosts(posts);
      });
  }, []);

  return (
    <div className="post__container">
      {posts.map((post) => (
        <Post post={post} key={post.id} user={user} />
      ))}
      {/* <JSONPretty data={posts} theme={JSONPrettyMon} /> */}
    </div>
  );
}

function Post({ post, user }) {
  const authorData = () => {
    firestore
      .collection("usernames")
      .doc(post.createdBy)
      .get()
      .then((doc) => {
        const data = doc.data();
        setAuthor({ displayName: data.displayName, photoURL: data.photoURL });
        setLoading(false);
      });
  };

  const [author, setAuthor] = useState({ displayName: "", photoURL: null });
  const [lastLike, setLastLike] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authorData();
  }, []);

  useEffect(() => {
    if (typeof post.lastLike !== "undefined" && post.lastLike !== null) {
      firestore
        .collection("usernames")
        .doc(post.lastLike)
        .get()
        .then((doc) => {
          setLastLike(doc.data().displayName);
        });
    }
  }, [post.lastLike]);

  return loading ? (
    <div>Loading...</div>
  ) : (
    <div className="card">
      <div className="card__head">
        <div>
          <div className="photo">
            {author.photoURL && (
              <Image src={author.photoURL} alt="profile image" layout="fill" />
            )}
          </div>
          <div className="card__deatails">
            <h4>{author.displayName}</h4>
            <span>8 h ago</span>
          </div>
        </div>
        <PostMenu post={post} user={user} />
      </div>
      <div className="card__content">{post.content}</div>
      <div className="card__panel">
        <div>
          {post.likes > 0 ? (
            <>
              {post.likes === 1 ? (
                <>{lastLike}</>
              ) : (
                <>
                  {lastLike} and {post.likes} others
                </>
              )}
            </>
          ) : null}
        </div>
        <div>{post.comments > 0 ? <>{post.comments} comment</> : null}</div>
      </div>
      <div>
        <LikeButton post={post} />
      </div>
    </div>
  );
}

function PostMenu({ post, user }) {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useClickOutSide(() => setOpenMenu(false));
  const deleteHandle = () => {
    const userConfirm = confirm("Are you sure you want to delete this post?");
    if (userConfirm)
      firestore
        .collection("posts")
        .doc(post.id)
        .delete()
        .then(() => console.log("success delete"))
        .catch((err) => console.log(err.message));
  };

  return (
    <div ref={menuRef}>
      {user.id === post.createdBy ? (
        <div className="card__head__control">
          <button onClick={() => setOpenMenu((open) => !open)}>
            <MoreHorizIcon />
          </button>
          {openMenu ? (
            <ul>
              <li onClick={deleteHandle}>
                <DeleteForeverIcon /> Delete post
              </li>
            </ul>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function LikeButton({ post }) {
  const { user } = useContext(UserContext);
  const handleLikeClick = async () => {
    const ref = firestore.collection("posts").doc(post.id);
    await ref.update({
      like: arrayUnion(user.id),
      lastLike: user.id,
      likes: Increment(1),
    });
  };

  const handleUnLike = async () => {
    const newLastlike = post.like.filter((doc) => doc !== user.id);
    const ref = firestore.collection("posts").doc(post.id);
    await ref.update({
      like: arrayRemove(user.id),
      lastLike: newLastlike[newLastlike.length - 1] || null,
      likes: Increment(-1),
    });
  };

  return post.like.includes(user.id) ? (
    <button onClick={handleUnLike}>Unlike</button>
  ) : (
    <button onClick={handleLikeClick}>Like</button>
  );
}
