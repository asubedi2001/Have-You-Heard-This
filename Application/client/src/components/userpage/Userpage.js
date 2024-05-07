import React, { useState, useEffect } from "react";

function Userpage({ spotify }) {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = () => {
      if (!spotify) {
        console.log("empty access token");
        return;
      }
      spotify.getMe().then(
        (data) => {
          console.log(data.body);
          setUserProfile(data.body);
        },
        (err) => {
          console.error(err);
        }
      );
    };

    fetchUserProfile();
  }, [spotify]);

  return (
    <div className="justify-center">
        {/* User Profile Image */}
        {userProfile && (
            <div className="flex justify-center items-center drop-shadow-2xl p-4">
                <img className="w-full max-w-xs drop-shadow-2xl" src={userProfile.images && userProfile.images.length > 0 ? userProfile.images[userProfile.images.length-1].url : "gizz.jpg"} alt="User Profile" />
            </div>
        )}
        {/* User Information */}
        <div className="flex justify-center items-center p-4 drop-shadow-2xl">
            {userProfile && (
                <div className="p-4 bg-gray-800 rounded-lg drop-shadow-2xl">
                    <div className="mt-1">
                        <h1 className="font-bold text-slate-100">Display Name:</h1>
                        <p className="text-cyan-100 ml-2">{userProfile.display_name}</p>
                        <h1 className="font-bold mt-4 text-slate-100">Email:</h1>
                        <p className="text-cyan-100 ml-2">{userProfile.email}</p>
                        <h1 className="font-bold mt-4 text-slate-100">Country:</h1>
                        <p className="text-cyan-100 ml-2">{userProfile.country}</p>
                        <h1 className="font-bold mt-4 text-slate-100">Follower Count:</h1>
                        <p className="text-cyan-100 ml-2">{userProfile.followers.total}</p>
                        <h1 className="font-bold mt-4 text-slate-100">Spotify Link:</h1>
                        <a href={userProfile.external_urls.spotify} className="text-sky-400 ml-2">{userProfile.external_urls.spotify}</a>
                        {/* Add other user details here */}
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}

export default Userpage;