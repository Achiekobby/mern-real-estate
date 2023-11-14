import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});

  console.log(filePercentage);

  const handleFileUpload = () => {
    //* defining the storage of the image
    const storage = getStorage(app);

    //* renaming the image file uploaded
    const fileName = new Date().getTime() + file.name;

    //* referencing the storage defined above in relation to the image file uploaded
    const storageRef = ref(storage, fileName);

    //* recording the process of image upload
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",

      //* this method generates the percentage progress of the image upload
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`upload is ${progress}% done`);
        setFilePercentage(Math.round(progress));
      },

      //* this callback method is used to log any errors during the image upload
      (error) => {
        setFileUploadError(error);
      },

      //* this method is used to extract the url of the image after a successful image upload
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };

  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);

  return (
    //* firebase storage rules
    //*allow read
    //*allow write: if
    //*request.resource.size <2 * 1024 *1024 &&
    //*request.resource.contentType.matches('image/.*')

    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          hidden
          type="file"
          ref={fileRef}
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="mt-2 rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          src={currentUser.user_info.avatar}
          alt="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
        />
        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading: ${filePercentage}% done`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600 text">Image Uploaded Successfully!</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="first_name"
          placeholder="first_name"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="last_name"
          placeholder="last_name"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="phone_number"
          placeholder="+233*****"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 p-3">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
