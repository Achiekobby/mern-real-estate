export default function SearchListing() {

  return (
    <div className="flex flex-col md:flex-row">

      {/* search queries */}
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form className="flex flex-col gap-8">
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input type="text" id="search_word" placeholder="Search..." className="border rounded-lg p-3 w-full" />
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="all" className="w-5"/>
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5"/>
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5"/>
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5"/>
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <label className="font-semibold" htmlFor="type">Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5"/>
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5"/>
              <span>Furnished</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold" htmlFor="sort">Sort</label>
            <select className="border rounded-lg p-3" name="sort_order" id="sort_order">
              <option value="latest">Price high to low</option>
              <option value="latest">Price low to high</option>
              <option value="latest">Latest</option>
              <option value="latest">Oldest</option>
            </select>
          </div>
          <button type="submit" className="text-center bg-slate-700 uppercase text-white p-3 rounded-lg hover:opacity-95">Search</button>
        </form>
      </div>

      {/* search results */}
      <div className="p-7">
        <h1 className="text-slate-700 uppercase font-semibold text-3xl border-b-2">Listing Results:</h1>
      </div>
    </div>
  );
}
