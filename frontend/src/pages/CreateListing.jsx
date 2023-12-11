import { useState } from "react";
import { app } from "../firebase";
import { MdOutlineSmsFailed } from "react-icons/md";
import { FaTrashAlt } from "react-icons/fa";
import { useSelector } from "react-redux";
import {useNavigate} from"react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import { BiError } from "react-icons/bi";

export default function CreateListing() {
  //* states
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { currentUser } = useSelector((state) => state.user);

  //* states for the form submission
  const [formData, setFormData] = useState({
    image_urls: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    bed_rooms: 1,
    bath_rooms: 1,
    regular_price: 0,
    discount_price: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [submitError, setSubmitError] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  console.log("formData", formData);

  const navigate = useNavigate();

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
        setUploading(true);
        promises.push(storeImage(file));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            image_urls: formData.image_urls.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((err) => {
          console.log("error:", err);
          setUploading(false);
          setImageUploadError("Image upload failed (2MB max per image)");
        });
    } else {
      setUploading(false);
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

  //* handle image removal from form_data
  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      image_urls: formData.image_urls.filter((_, i) => i !== index),
    });
  };

  //* handle changing values of the input fields
  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({ ...formData, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.checked });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({ ...formData, [e.target.id]: e.target.value });
    }
  };

  //* handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.image_urls.length < 1) {
        setSubmitError("You must upload at least one image!!");
        return;
      }

      if (+formData.regular_price < +formData.discount_price) {
        setSubmitError(
          "Discount price cannot be more than the Regular price!!"
        );
        return;
      }
      setSubmitLoading(true);
      const response = await fetch("/api/listing/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          user_ref: currentUser.user_info._id,
        }),
      });

      const data = await response.json();
      setSubmitLoading(false);
      if (data.status === "failed") {
        setSubmitError(data.message);
        return;
      }
      //* redirect the user to the listings page
      navigate(`/user/listings`);
    } catch (err) {
      console.log(err.message);
      setSubmitLoading(false);
      setSubmitError(err.message);
    }
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">
        Create Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="Name"
            className="border p-3 rounded-lg"
            id="name"
            maxLength="62"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="Description"
            className="border p-3 rounded-lg"
            id="description"
            minLength="10"
            required
            onChange={handleChange}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="Address"
            className="border p-3 rounded-lg"
            id="address"
            required
            onChange={handleChange}
            value={formData.address}
          />
          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="sale"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="rent"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="parking"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="furnished"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                className="w-5"
                id="offer"
                onChange={handleChange}
                checked={formData.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* number inputs */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bed_rooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bed_rooms}
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <p>Bed Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="bath_rooms"
                min="1"
                max="10"
                required
                onChange={handleChange}
                value={formData.bath_rooms}
                className="p-3 w-20 border border-gray-300 rounded-lg"
              />
              <p>Bath Rooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                id="regular_price"
                min="50"
                required
                onChange={handleChange}
                value={formData.regular_price}
                className="p-3 w-full border border-gray-300 rounded-lg"
              />
              <div className="flex flex-col items-center">
                <p>Regular Price</p>
                <span className="text-xs">{formData.type==="rent"?"($ / months)":""}</span>
              </div>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  id="discount_price"
                  min="0"
                  required
                  onChange={handleChange}
                  value={formData.discount_price}
                  className="p-3 w-full border border-gray-300 rounded-lg"
                />
                <div className="flex flex-col items-center">
                  <p>Discount Price</p>
                <span className="text-xs">{formData.type==="rent"?"($ / months)":""}</span>
                </div>
              </div>
            )}
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
              disabled={uploading}
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading" : "Upload"}
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
          {formData.image_urls.length > 0 &&
            formData.image_urls.map((image, index) => {
              return (
                <>
                  <div
                    key={index}
                    className="flex justify-between p-3 border items-center bg-white"
                  >
                    <img
                      src={image}
                      alt="listing image"
                      className="w-20 h-20 rounded-lg object-contain"
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="text-white uppercase text-sm p-2 hover:opacity-90 bg-red-700 rounded-full"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                </>
              );
            })}

          <button
            disabled={submitLoading || uploading}
            className="p-3 bg-slate-700 text-white uppercase rounded-lg hover:opacity-95 disabled:opacity-80"
          >
            {submitLoading ? "Loading" : "Create a Listing"}
          </button>
          <p className="text-red-700 text-xs justify-center font-bold flex gap-2 items-center">
            {submitError && (
              <>
                <span className="text-sm font-bold">
                  <BiError />
                </span>
                {submitError}
              </>
            )}
          </p>
        </div>
      </form>
    </main>
  );
}
