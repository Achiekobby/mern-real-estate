import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import Listings from './pages/Listings';
import EditListing from "./pages/EditListing";
import ListingDetails from "./pages/ListingDetails";
import SearchListing from "./pages/SearchListing";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />

        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />}/>
          <Route path ="/user/listing/update/:id" element={<EditListing/>} />
          <Route path="/listing/:listing_id" element={<ListingDetails/>} />
          <Route path="/user/listings" element={<Listings/>}  />
          <Route path="/search" element={<SearchListing/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
