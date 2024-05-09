import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

function Userpage({ spotify }) {
  const [userProfile, setUserProfile] = useState(null);

  const deleteUserHandler = (imgUrl, id, song) => {   
      
    if (!spotify) {
      console.log("empty access token");
      return;
    }
    spotify.getMe().then(
      async (data) => {
        var spotify_id = data.body.uri;
        console.log(spotify_id);
        console.log(data.body);
        console.log('User attempting to delete data.');
        try {
          const response = await axios.post('http://localhost:3001/api/deleteuser', JSON.stringify({
            spotify_id,
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            console.log('Data deleted successfully');
            
          } else {
            console.error('Failed to delete data');
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };

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
                <div className="p-4 bg-gray-800 flex flex-col rounded-lg drop-shadow-2xl">
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
                <motion.img 
                  whileHover={{ scale: "1.175"}}
                  whileTap={{ scale: "0.8" }}
                  className="cursor-pointer w-12 self-center"
                  src="delete.png"
                  onClick={deleteUserHandler}
                  alt=""
                />
                </div>
            )}
        </div>
    </div>
  );
}

export default Userpage;