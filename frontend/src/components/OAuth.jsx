import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase.js";
import {useDispatch, useSelector} from "react-redux";

export default function OAuth() {
  const dispatch = useDispatch();

  const handleGoogleLinkClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      console.log(result);

      //* call an api at the backend to store relevant data of the user
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: result._tokenResponse.first_name,
          last_name: result._tokenResponse.last_name,
          email: result.user.email,
          photo_url: result.user.photoURL,
        }),
      });

      const user_data = await res.json();

    } catch (error) {
      console.log("could not sign in with google", error);
    }
  };

  return (
    <button
      onClick={handleGoogleLinkClick}
      className=" m-3 bg-red-700 text-white p-3 rounded-lg uppercase text-center hover:opacity-95"
    >
      continue with google
    </button>
  );
}
