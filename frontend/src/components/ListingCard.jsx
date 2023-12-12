import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function ListingCard({ listing }) {
  const discountPrice =
    typeof listing.discount_price === "number" ? listing.discount_price : Number(listing.discount_price);
  const regularPrice =
    typeof listing.regular_price === "number" ? listing.regular_price : Number(listing.regular_price);

  const locale = "en-GH";

  const formattedPrice = listing.offer
    ? discountPrice.toLocaleString(locale)
    : regularPrice.toLocaleString(locale);

  return (
    <div className="mt-7 bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          className="h-[320px] sm:h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          src={listing.image_urls[0]}
          alt={listing.name}
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="text-lg font-semibold text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className=" h-4 w-4 text-green-600" />
            <p className="truncate text-sm text-gray-600 p-2">
              {listing.address}
            </p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-600">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold">
            GHC.
            {formattedPrice}
            {listing.type==="rent" && "/month"}
          </p>
          <div className="flex items-center gap-4 text-black text-xs font-semibold">
            <div className="flex items-center gap-2">
              {listing.bed_rooms >1 ?`${listing.bed_rooms} beds` : `${listing.bed_rooms} bed`}
            </div>
            <div className="flex items-center gap-2">
              {listing.bath_rooms >1 ?`${listing.bath_rooms} beds` : `${listing.bath_rooms} bed`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
