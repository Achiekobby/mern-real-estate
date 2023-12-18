import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { RiDeleteBin5Line } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Listings() {
  const { currentUser } = useSelector((state) => state.user);
  // console.log(currentUser.user_info._id);

  const [listings, setListings] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [problem, setProblem] = useState(false);

  const navigate = useNavigate();

  const fetched_data = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/user/listing/${currentUser.user_info._id}`
      );
      console.log("content-type:",response.headers.get('Content-Type')); 
      console.log(response);
      const data = await response.json();
      console.log("data", data.listings);
      if (data.status === "failed") {
        setLoading(false);
        setError({
          status_code: data.status_code,
          message: data.message,
        });
        return;
      }
      setListings(data.listings);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError({
        status_code: 500,
        message: error.message,
      });
      console.log("error:", error);
    }
  };
  useEffect(() => {
    fetched_data();
  }, []);

  const formatDate = (timestamp) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  };

  const handleListingDelete = async (listing_id) => {
    try {
      //* Make API call
      const res = await fetch(`/api/user/listing/${listing_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.status === "failed") {
        setProblem(data.message);
        console.log("delete_error", data.message);
      }
      //* call the api to fetch the updated listings again
      fetched_data();
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleEditClick = (listing_id) => {
    try {
      navigate(`/user/listing/update/${listing_id}`);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      {loading && (
        <p className="text-3xl text-center text-black p-3 mx-auto">
          Loading...
        </p>
      )}
      {problem && (
        <p className="text-3xl text-center text-black p-3 mx-auto">{problem}</p>
      )}
      {error && (
        <div>
          <section className="relative z-10 bg-blue-500 py-[120px]">
            <div className="container mx-auto">
              <div className="-mx-4 flex">
                <div className="w-full px-4">
                  <div className="mx-auto max-w-[400px] text-center">
                    <h2 className="mb-2 text-[50px] font-bold leading-none text-white sm:text-[80px] md:text-[100px]">
                      {error.status_code}
                    </h2>
                    <h4 className="mb-3 text-[22px] font-semibold leading-tight text-white">
                      Oops! {error.message}
                    </h4>
                    <p className="mb-8 text-lg text-white">
                      click the button to go back
                    </p>
                    <Link
                      to="/profile"
                      className="inline-block rounded-lg border border-white px-8 py-3 text-center text-base font-semibold text-white transition hover:bg-white hover:text-blue-500"
                    >
                      Go Back
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-between space-x-5 md:space-x-8 lg:space-x-14">
              <div className="h-full w-1/3 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"></div>
              <div className="flex h-full w-1/3">
                <div className="h-full w-1/2 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"></div>
                <div className="h-full w-1/2 bg-gradient-to-t from-[#FFFFFF14] to-[#C4C4C400]"></div>
              </div>
              <div className="h-full w-1/3 bg-gradient-to-b from-[#FFFFFF14] to-[#C4C4C400]"></div>
            </div>
          </section>
        </div>
      )}

      {listings && (
        <div>
          <h1 className="text-black font-semibold text-center p-3 text-5xl">
            <span className="text-blue-600">{`${currentUser.user_info.first_name}'s`}</span>{" "}
            Listings
          </h1>
          <div className="max-w-7xl mx-auto mt-3 p-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {listings.map((listing) => {
              return (
                <>
                  <div
                    key={listing._id}
                    className="flex flex-col md:h-70 rounded-lg bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700 md:max-w-xl md:flex-row"
                  >
                    <img
                      className="h-90 w-full md:w-3/10 rounded-t-lg object-cover md:h-auto md:rounded-none md:rounded-l-lg"
                      src={listing.image_urls[0]}
                      alt={listing.name}
                    />
                    <div className="flex flex-col justify-start p-6 w-full md:w-7/10">
                      <Link to={`/listing/${listing._id}`}>
                      <h5 className="mb-2 text-xl text-neutral-800 font-bold dark:text-neutral-50">
                        {listing.name.substr(0, 10)}...
                      </h5>
                      </Link>
                      <p
                        style={{
                          textDecoration: `${
                            listing.discount_price !== "0" ? "line-through" : ""
                          }`,
                          opacity: `${
                            listing.discount_price !== "0" ? "0.5" : "1"
                          }`,
                        }}
                        className="mb-2 text-base text-blue-600 dark:text-blue-500"
                      >
                        Regular: GHC. {Number(listing.regular_price).toFixed(2)}
                      </p>
                      {
                        <p className="mb-2 text-base text-green-600 font-semibold dark:text-green-500 text">
                          New: GHC. {Number(listing.discount_price).toFixed(2)}
                        </p>
                      }

                      <p className="text-sm mb-4 text-neutral-700 dark:text-neutral-300 font-semibold">
                        {listing.type === "rent" ? `Duration: Monthly` : ""}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-300">
                        Last updated {formatDate(listing.createdAt)}
                      </p>

                      <div className="flex justify-end mt-4 gap-2">
                        <button
                          onClick={() => handleEditClick(listing._id)}
                          type="button"
                          className="rounded-lg bg-orange-400  hover:bg-orange-500 self-center text-white p-3"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleListingDelete(listing._id)}
                          type="button"
                          className="rounded-lg bg-red-700 text-white  hover:bg-red-500 cur self-center p-3"
                        >
                          <RiDeleteBin5Line />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* </Link> */}
                </>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
