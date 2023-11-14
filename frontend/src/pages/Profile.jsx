import { useSelector } from "react-redux";
export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          className="mt-2 rounded-full h-24 w-24 object-cover cursor-pointer self-center"
          src={currentUser.user_info.avatar}
          alt="https://avatars.dicebear.com/api/adventurer-neutral/mail%40ashallendesign.co.uk.svg"
        />
        <input
          type="text"
          id="first_name"
          placeholder="first_name"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="last_name"
          placeholder="last_name"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="email"
          placeholder="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="text"
          id="phone_number"
          placeholder="+233*****"
          className="border p-3 rounded-lg"
        />
        <button className="bg-slate-700 text-white rounded-lg uppercase hover:bg-slate-800 p-3">
          update
        </button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
