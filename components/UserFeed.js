import { useState, useEffect, useRef, useContext } from "react";
import { firestore, arrayUnion, arrayRemove, Increment } from "@lib/firebase";
import { UserContext } from "@utils/context";
import { useClickOutSide } from "@utils/useClickOutSide";
import Image from "next/image";
import Link from "next/link";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ReactTimeAgo from "react-time-ago";

export default function UserFeed({ id }) {
  const isCurrent = useRef(true);
  const [posts, setPosts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    return () => {
      isCurrent.current = false;
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (isCurrent) {
      unsubscribe = firestore
        .collection("posts")
        .where("createdBy", "==", id)
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
    }
    return () => {
      unsubscribe = undefined;
    };
  }, [id]);

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
        setAuthor({
          id: doc.id,
          displayName: data.displayName,
          photoURL: data.photoURL,
        });
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
          <div className="photo pointer">
            {author.photoURL && (
              <Image src={author.photoURL} alt="profile image" layout="fill" />
            )}
          </div>
          <div className="card__deatails">
            <Link href={author.id} passHref>
              <h4 className="pointer">{author.displayName}</h4>
            </Link>
            <span>
              <ReactTimeAgo
                date={post.createdAt?.toDate() || new Date()}
                locale="en-US"
                timeStyle="twitter"
              />
            </span>
          </div>
        </div>
        <PostMenu post={post} user={user} />
      </div>
      <div className="card__content">
        <span>{post.content}</span>
        {post.photoURL && (
          <div>
            <Image
              src={post.photoURL}
              width="680"
              height="640"
              alt={post.content}
            />
          </div>
        )}
      </div>
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
