import { useState, useEffect } from "react";
import { firestore } from "@lib/firebase";
import JSONPretty from "react-json-pretty";
import JSONPrettyMon from "react-json-pretty/themes/monikai.css";

export default function PostFeed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const ref = firestore
        .collection("posts")
        .orderBy("createdAt", "desc")
        .limit(1);

      const posts = (await ref.get()).docs.map((res) => {
        return {
          ...res.data(),
          id: res.id,
        };
      });
      setPosts(posts);
    };

    const interval = setInterval(() => {
      getData();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h4>DOG</h4>
      <JSONPretty data={posts} theme={JSONPrettyMon} />
    </div>
  );
}
