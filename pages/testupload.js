import { useState, useContext } from "react";
import { storage } from "@lib/firebase";
import Image from "next/image";
import { UserContext } from "@utils/context";

export default function TestUpload() {
  const { user } = useContext(UserContext);
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

  function handleUpload(e) {
    e.preventDefault();
    const ref = storage.ref(`${user.id}/profile`);
    const uploadTask = ref.put(file);
    uploadTask.on("state_changed", console.log, console.error, () => {
      ref.getDownloadURL().then((url) => {
        setImage(null);
        console.log(url);
      });
    });
  }

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        onChange={onImageChange}
        accept="image/jpeg,image/png,image/gif"
      />
      <div style={{ width: "100px", height: "100px", position: "relative" }}>
        {image && <Image src={image} alt="preview image" layout="fill" />}
      </div>

      <button type="submit">UPload</button>
    </form>
  );
}
