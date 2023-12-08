import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function ContactComponent({ listing }) {
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  console.log("message:",message);

  useEffect(() => {
    const owner_fetch = async () => {
      try {
        const res = await fetch(`/api/listing/owner/${listing.user_ref}`);
        const data = await res.json();
        if (data.status === "failed") {
          console.log(`api_error:${data.message}`);
          return;
        }
        setOwner(data.user);
      } catch (error) {
        console.log(`Error: ${error.message}`);
      }
    };
    owner_fetch();
  }, [listing.user_ref]);
  return (
    <>
      {owner && (
        <div className="flex flex-col gap-2 mt-6">
          <p className="font-bold">
            Contact:{" "}
            <span className="font-bold">{`${owner.first_name} ${owner.last_name}`}</span>{" "}
            for{" "}
            <span className="font-bold">{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="w-full rounded-lg border p-3"
            placeholder="Enter Your Message Here"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={(e) => setMessage(e.target.message)}
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center p-3 rounded-lg uppercase hover:opacity-95"
            to={`mailto:${owner.email}?subject=Listing Enquiry:${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
//* Prop types validation
ContactComponent.propTypes = {
  listing: PropTypes.shape({
    user_ref: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};
