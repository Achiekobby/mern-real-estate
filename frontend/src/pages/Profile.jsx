import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase.js";
import {
  update_user_start,
  update_failure,
  update_success,
  delete_start,
  delete_success,
  delete_failure,
  sign_out_start,
  sign_out_success,
  sign_out_failed,
} from "../redux/user/userSlice.js";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  useEffect(() => {
    if (error) {
      const set_error = setTimeout(() => {
        dispatch(update_failure(null));
      }, 3000);

      return () => {
        clearTimeout(set_error);
      };
    }
  }, [error, dispatch]);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      dispatch(update_user_start());
      const res = await fetch(
        `/api/auth/user/update/${currentUser.user_info._id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (data.status === "failed") {
        dispatch(update_failure(data.message));
        navigate("/profile");
        return;
      }
      dispatch(update_success(data));
    } catch (error) {
      console.log(error);
      dispatch(update_failure(error.message));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(delete_start());
      const user_id = currentUser.user_info._id;

      const res = await fetch(`/api/auth/user/delete/${user_id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.status === "failed") {
        dispatch(delete_failure(data.message));
        return;
      }
      dispatch(delete_success(data.message));
    } catch (error) {
      dispatch(delete_failure(error.message));
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(sign_out_start());
      const res = await fetch("/api/auth/user/sign-out", { method: "GET" });
      const data = await res.json();
      if (data.status === "failed") {
        dispatch(sign_out_failed(data.message));
        return;
      }
      dispatch(sign_out_success());
    } catch (error) {
      dispatch(sign_out_failed(error.message));
    }
  };

  return (
    //* firebase storage rules
    //*allow read
    //*allow write: if
    //*request.resource.size <2 * 1024 *1024 &&
    //*request.resource.contentType.matches('image/.*')

    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
        {error && <p className="text-red-700 text-center">{error}</p>}

        <p className="text-sm self-center">
          {fileUploadError ? (
            <span className="text-red-700">Error Image Upload</span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Uploading: ${filePercentage}% done`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600 text">
              Image Uploaded Successfully!
            </span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          id="first_name"
          placeholder="first_name"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.user_info.first_name}
          onChange={handleChange}
        />
        <input
          type="text"
          id="last_name"
          placeholder="last_name"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.user_info.last_name}
          onChange={handleChange}
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.user_info.email}
          onChange={handleChange}
        />
        <input
          type="text"
          id="phone_number"
          placeholder="+233*****"
          className="border p-3 rounded-lg"
          defaultValue={currentUser.user_info.phone_number}
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 p-3"
        >
          update
        </button>
        <Link
          to="/create-listing"
          className="rounded-lg text-white uppercase text-center bg-green-700 p-3 hover:bg-green-600"
        >
          create listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <span
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteAccount}
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">
          Sign Out
        </span>
      </div>
      {/* <p className="text-green-600 text-center">{update_success ? "You have successfully updated your info" : ""}</p> */}
    </div>
  );
}
