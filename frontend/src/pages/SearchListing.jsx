import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchListing() {
  const [sidebarSearchData, setSideBarSearchData] = useState({
    search_word: "",
    type: "all",
    parking: false,
    offer: false,
    furnished: false,
    sort: "createdAt",
    order: "desc",
  });

  const [loading, setLoading] = useState(false);
  const [listing_data, setListingData] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    try {
      if (
        e.target.id === "all" ||
        e.target.id === "rent" ||
        e.target.id === "sale"
      ) {
        setSideBarSearchData({ ...sidebarSearchData, type: e.target.id });
      }

      if (e.target.id === "search_word") {
        setSideBarSearchData({
          ...sidebarSearchData,
          search_word: e.target.value,
        });
      }
      if (
        e.target.id === "parking" ||
        e.target.id === "furnished" ||
        e.target.id === "offer"
      ) {
        setSideBarSearchData({
          ...sidebarSearchData,
          [e.target.id]:
            e.target.checked || e.target.checked == e.target.checked.toString()
              ? true
              : false,
        });
      }

      if (e.target.id === "sort_order") {
        const sort = e.target.value.split("-")[0];
        const order = e.target.value.split("-")[1];

        setSideBarSearchData({
          ...sidebarSearchData,
          sort,
          order,
        });
      }
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  const handleSubmit = (e) => {
    try {
      e.preventDefault();
      const url_params = new URLSearchParams(window.location.search);
      url_params.set("search_word", sidebarSearchData.search_word);
      url_params.set("type", sidebarSearchData.type);
      url_params.set("parking", sidebarSearchData.parking);
      url_params.set("furnished", sidebarSearchData.furnished);
      url_params.set("offer", sidebarSearchData.offer);
      url_params.set("sort", sidebarSearchData.sort);
      url_params.set("order", sidebarSearchData.order);
      const search_query = url_params.toString();

      navigate(`/search?${search_query}`);
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  };

  useEffect(() => {
    const url_params = new URLSearchParams(location.search);
    const searchWordFromUrlParams = url_params.get("search_word");
    const typeFromUrlParams = url_params.get("type");
    const offerFromUrlParams = url_params.get("offer");
    const parkingFromUrlParams = url_params.get("parking");
    const furnishedFromUrlParams = url_params.get("furnished");
    const sortFromUrlParams = url_params.get("sort");
    const orderFromUrlParams = url_params.get("order");
    if (
      searchWordFromUrlParams ||
      typeFromUrlParams ||
      offerFromUrlParams ||
      parkingFromUrlParams ||
      furnishedFromUrlParams ||
      sortFromUrlParams ||
      orderFromUrlParams
    ) {
      setSideBarSearchData({
        search_word: searchWordFromUrlParams || "",
        type: typeFromUrlParams || "all",
        offer: offerFromUrlParams === "true" ? true : false,
        parking: parkingFromUrlParams === "true" ? true : false,
        furnished: furnishedFromUrlParams === "true" ? true : false,
        sort: sortFromUrlParams || "createdAt",
        order: orderFromUrlParams || "desc",
      });
    }

    const fetchListings = async () => {
      try {
        setLoading(true);
        const search_query = url_params.toString();
        const res = await fetch(`/api/listing/search?${search_query}`);
        const data = await res.json();

        if (data.status === "failed") {
          console.log(`API Error: ${data.message}`);
          return;
        }
        
        setListingData(data.listings);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(`Error:${error.message}`);
      }
    };
    fetchListings();
  }, [location.search]);

  return (
    <div className="flex flex-col md:flex-row">
      {/* search queries */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">
              Search Term:
            </label>
            <input
              type="text"
              id="search_word"
              placeholder="Search..."
              className="border rounded-lg p-3 w-full"
              value={sidebarSearchData.search_word}
              onChange={handleChange}
            />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">
              Type:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                checked={sidebarSearchData.type === "all"}
                onChange={handleChange}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                checked={sidebarSearchData.type === "rent"}
                onChange={handleChange}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                checked={sidebarSearchData.type === "sale"}
                onChange={handleChange}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                checked={sidebarSearchData.offer}
                onChange={handleChange}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">
              Amenities:
            </label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                checked={sidebarSearchData.parking}
                onChange={handleChange}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                checked={sidebarSearchData.furnished}
                onChange={handleChange}
              />
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold" htmlFor="sort">
              Sort
            </label>
            <select
              className="border rounded-lg p-3"
              id="sort_order"
              onChange={handleChange}
              defaultValue={"createdAt-desc"}
            >
              <option value="regular_price-desc">Price high to low</option>
              <option value="regular_price-asc">Price low to high</option>
              <option value="createdAt-desc">Latest</option>
              <option value="createdAt-asc">Oldest</option>
            </select>
          </div>
          <button
            type="submit"
            className="text-center bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95"
          >
            Search
          </button>
        </form>
      </div>

      {/* search results */}
      <div className="p-7">
        <h1 className="text-slate-700 uppercase font-semibold text-3xl border-b-2">
          Listing Results:{" "}
          <span>
            {loading && (
              <p className="text-center font-semibold text-blue-700 text-3xl">
                Loading...
              </p>
            )}
          </span>
        </h1>
        {/* if no data was returned */}
        {!listing_data && (
          <p className="text-center p-3 font-semibold text-red-700 text-3xl">
            No results found
          </p>
        )}
        {
          listing_data.map((listing)=>{
            return(
              <>
              </>
            );
          })
        }
      </div>
    </div>
  );
}
