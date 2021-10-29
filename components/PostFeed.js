import { useState, useEffect, useRef, useContext } from "react";
import { firestore, arrayUnion, arrayRemove, Increment } from "@lib/firebase";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";
import { UserContext } from "@utils/context";
import { useClickOutSide } from "@utils/useClickOutSide";
import Image from "next/image";
import Link from "next/link";

import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import ReactTimeAgo from "react-time-ago";

export default function PostFeed() {
  const isCurrent = useRef(true);
  const { user } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    return () => {
      isCurrent.current = false;
    };
  }, []);

  useEffect(() => {
    let unsubscribe;
    if (isCurrent.current) {
      unsubscribe = firestore
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(limit)
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
  }, [limit]);

  return (
    <div className="post__container">
      {posts.map((post) => (
        <Post post={post} key={post.id} user={user} />
      ))}

      <button
        onClick={() => setLimit((c) => c + 2)}
        className="post__container__button"
      >
        Loadmore
      </button>
    </div>
  );
}

function Post({ post, user }) {
  const [open, setOpen] = useState(false);
  const [comment, setComent] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    firestore
      .collection("posts")
      .doc(post.id)
      .update({
        lastComment: {
          userId: user.id,
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
          content: comment,
        },
        comment: arrayUnion({
          userId: user.id,
          userDisplayName: user.displayName,
          userPhotoURL: user.photoURL,
          content: comment,
        }),
        comments: Increment(1),
      });
    setComent("");
  };

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
    <div className="card relative">
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
      <div style={{ display: "flex", justifyContent: "space-around" }}>
        <LikeButton post={post} />
        <button onClick={() => setOpen(true)}>comment</button>
      </div>
      <div>
        {post.comment?.map((doc, idx) => (
          <div key={idx} className="commnets">
            <Link href={`/${doc.userId}`} passHref>
              <>
                <div className="img">
                  <Image
                    src={doc.userPhotoURL || "/default.png"}
                    width="30"
                    height="30"
                    alt="notFound"
                  />
                </div>
                <h3>{doc.userDisplayName}</h3>
              </>
            </Link>
            {"  "}
            {doc.content}
          </div>
        ))}
        {open ? (
          <form onSubmit={onSubmit} className="form">
            <input
              type="text"
              value={comment}
              onChange={(e) => setComent(e.target.value)}
            />
          </form>
        ) : null}
      </div>
    </div>
  );
}

function PostMenu({ post, user }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [editContent, setEditContent] = useState(false);
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
              <li
                onClick={(e) => {
                  setEditContent(true);
                  setOpenMenu(false);
                }}
              >
                <EditIcon /> Edit post
              </li>
              <li onClick={deleteHandle}>
                <DeleteForeverIcon /> Delete post
              </li>
            </ul>
          ) : null}
        </div>
      ) : null}
      {editContent ? (
        <Editing post={post} setEditContent={setEditContent} />
      ) : null}
    </div>
  );
}

function Editing({ post, setEditContent }) {
  const [content, setContent] = useState(post.content);
  const editRef = useClickOutSide(() => setEditContent(false));

  const updateContent = (e) => {
    e.preventDefault();
    if (content !== post.content && content !== "") {
      firestore.collection("posts").doc(post.id).update({ content });
      setEditContent(false);
    }
  };

  return (
    <form className="editpost" ref={editRef} onSubmit={updateContent}>
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button>Save</button>
    </form>
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
