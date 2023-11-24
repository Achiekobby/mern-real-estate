import { useState } from "react";
import { app } from "../firebase";
import { MdOutlineSmsFailed } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

export default function CreateListing() {
  //* states
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({ image_urls: [] });
  const [imageUploadError, setImageUploadError] = useState(false);

  console.log("formData", formData);

  //* function to handle the image upload
  const handleImageUpload = () => {
    if (
      files.length > 0 &&
      files.length < 7 &&
      formData.image_urls.length < 7
    ) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        promises.push(storeImage(file));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            image_urls: formData.image_urls.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((err) => {
          console.log("error:", err);
          setImageUploadError("Image upload failed (2MB max per image)");
        });
    } else {
      setImageUploadError("You can only upload 6 images per listing");
    }
  };

  //* an async function to store image in firebase
  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% complete`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            maxLength="62"
            minLength="10"
            required
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
          />
          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="sale" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="rent" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="parking" />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="furnished" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" className="w-5" id="offer" />
              <span>Offer</span>
            </div>
          </div>
          {/* number inputs */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bedrooms"
                min="1"
                max="10"
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <p>Bed Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bathrooms"
                min="1"
                max="10"
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <p>Bath Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="discountPrice"
                min="1"
                max="10"
                required
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Discount Price</p>
                <span className="text-xs">($ / months)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-gray-600 ml-2">
              The first image will be the cover (max:6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="images/*"
              multiple
              className="p-3 border border-gray-300 w-full"
              onChange={(event) => setFiles(event.target.files)}
            />
            <button
              onClick={handleImageUpload}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <p className="text-red-700 text-xs font-bold flex gap-2 items-center">
            {imageUploadError && (
              <>
                <span className="text-sm font-bold">
                  <MdOutlineSmsFailed />
                </span>
                {imageUploadError}
              </>
            )}
          </p>

          {/* preview the images to be uploaded */}
          
          <button className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80">
            Create a Listing
          </button>
        </div>
      </form>
    </main>
  );
}
