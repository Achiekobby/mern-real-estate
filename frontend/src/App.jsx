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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
{/* 
        //* Declaring a private Route */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />}/>
          <Route path="/user/listings" element={<Listings/>}  />
          <Route path="/user/listing/:id" element={<ListingDetails/>} />
          <Route path ="/user/listing/update/:id" element={<EditListing/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
