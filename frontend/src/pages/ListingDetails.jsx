import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function ListingDetails() {
  SwiperCore.use([Navigation]);
  const { listing_id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  console.log(listing);

  const fetch_listing = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/user/listing/show/${listing_id}?_=${new Date().getTime()}`
      );

      const data = await res.json();
      if (data.status === "failed") {
        setError({ status_code: data.status_code, message: data.message });
        console.log(`Error: ${data.message}`);
        return;
      }
      console.log("data", data.listing);
      setListing(data.listing);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error.message);
    }
  };
  console.log("Listing:", listing);

  useEffect(() => {
    fetch_listing();
  }, [listing_id]);

  return (
    <main>
      {loading && (
        <p className="text-3xl text-center text-black p-3 mx-auto my-7">
          Loading...
        </p>
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
                      to="/user/listings"
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

      {/* the details page goes here */}
      {listing && !loading && !error && (
        <Swiper
          navigation
        >
          {listing.image_urls.map(url => (
            <SwiperSlide key={url}>
              <div
                className="h-[450px]"
                style={{
                  background: `url(${url}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </main>
  );
}
