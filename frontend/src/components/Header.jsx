import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const { currentUser } = useSelector(state=>state.user);

  //* state to keep the search Input
  const [searchWord, setSearchWord] = useState("");

  //* initializing the useNavigate
  const navigate = useNavigate()

  const handleSubmit = (e)=>{
    e.preventDefault();
    try {
      const url_params = new URLSearchParams(window.location.search);
      url_params.set("search_word", searchWord);

      const search_query = url_params.toString();
      // console.log("search query: " + search_query);

      navigate(`/search?${search_query}`);

    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(()=>{
    const url_params = new URLSearchParams(location.search);
    const url_search_word = url_params.get('search_word');
    if(url_search_word){
      setSearchWord(url_search_word);
    }
  },[location.search])


  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        <Link to="/">
          <h1 className="flex flex-wrap font-bold sm:text-xl text-sm">
            <span className="text-slate-500">Ace-</span>
            <span className="text-slate-700">Housing</span>
          </h1>
        </Link>
        <form className="bg-slate-100 p-3 rounded-lg flex items-center" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="search..."
            className="bg-transparent w-24 sm:w-64 focus:outline-none"d
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
          />
          <button type="submit">
          <FaSearch className="text-slate-500" />
          </button>
        </form>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              Home
            </li>
          </Link>
          <Link to="/about-us">
            <li className="hidden sm:inline text-slate-700 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to="/profile">
            {
              currentUser ? (
                <img className="rounded-full h-7 w-7 object-cover" src={currentUser.user_info.avatar} alt="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg" />
              ):
              (
                <li className="text-slate-700 hover:underline">Sign-In</li>
              )
            }
          </Link>
        </ul>
      </div>
    </header>
  );
}
