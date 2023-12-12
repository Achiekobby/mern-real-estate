import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import ListingCard from "../components/ListingCard";

const Home = () => {
  SwiperCore.use([Navigation]);

  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(`offers:${offerListings}`);

  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const offer_state = true;
        const res = await fetch(
          `/api/listing/search?offer=${offer_state}&limit=4`
        );
        const data = await res.json();
        if (data.status === "failed") {
          console.log(`API Error: ${data.message}`);
          return;
        }
        setOfferListings(data.listings);
        fetchRentListings();
        fetchSaleListings();
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    };
    fetchOfferListings();
  }, []);
  const fetchRentListings = async () => {
    try {
      const res = await fetch(`/api/listing/search?type=rent&limit=4`);
      const data = await res.json();
      if (data.status === "failed") {
        console.log(`API Error: ${data.message}`);
        return;
      }
      setRentListings(data.listings);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const fetchSaleListings = async () => {
    try {
      const res = await fetch(`/api/listing/search?type=sale&limit=4`);
      const data = await res.json();
      if (data.status === "failed") {
        console.log(`API Error: ${data.message}`);
        return;
      }
      setSaleListings(data.listings);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find our next
          <span className="text-slate-500"> perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-sm sm:text-xs">
          Ace-housing is the best place to find your next perfect place to live
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to="/search"
          className="text-sm text-blue-800 font-bold hover:underline"
        >{`Let's get started...`}</Link>
      </div>
      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide key={listing._id}>
              <div
                className="h-[450px]"
                style={{
                  background: `url(${listing.image_urls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <>
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent Offers
                </h2>
                <Link
                  className="bg-green-500 rounded-lg p-3 text-white font-semibold text-center hover:bg-green-700 transition-hover"
                  to={`/search?offer=true`}
                >
                  View More
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings &&
                  offerListings.length > 0 &&
                  offerListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
              </div>
            </div>
          )}
          {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Sales Offers
                </h2>
                <Link
                  className="bg-green-500 rounded-lg p-3 text-white font-semibold text-center hover:bg-green-700 transition-hover"
                  to={`/search?type=sale`}
                >
                  View More
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings &&
                  saleListings.length > 0 &&
                  saleListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
              </div>
            </div>
          )}
          {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="flex justify-between items-center w-full">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Rental Offers
                </h2>
                <Link
                  className="bg-green-500 rounded-lg p-3 text-white font-semibold text-center hover:bg-green-700 transition-hover"
                  to={`/search?type=rent`}
                >
                  View More
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings &&
                  rentListings.length > 0 &&
                  rentListings.map((listing) => (
                    <ListingCard key={listing._id} listing={listing} />
                  ))}
              </div>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default Home;
