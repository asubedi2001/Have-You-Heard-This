import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SongTrack from "../discover/SongTrack.js";
import axios from "axios";

function UTRLikes({ spotify }) {
  console.log("UTR Likes being created...");
  const [spotify_id, setSpotifyID] = useState(null);
  const [userLikes, setUserLikes] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!spotify) {
        console.log("empty access token");
        return;
      }
      try {
        const data = await spotify.getMe();
        console.log(data.body);
        setSpotifyID(data.body.uri);
        setUserLikes(getUserLikes(data.body.uri));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserProfile();
  }, [spotify]);

  // Function to get all user UTR likes.
  const getUserLikes = async (spotify_id) => {
    try {
      const response = await axios.post(
        "http://localhost:3001/api/getlikes",
        JSON.stringify({
          spotify_id
        }),
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.status === 200) {
        setUserLikes(response.data);
        console.log("successfully retrieved likes");
      } else {
        console.error("Failed to get likes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center ml-1 ">
        <div className="flex flex-col items-center p-2 m-2 min-w-full">
          <h1 className="text-slate-100 pb-2">Here are the songs you've liked:</h1>
          <button className="bg-slate-100 text-slate-900 h-full p-1 rounded-3xl px-3 ">
            <img className="" src="search.svg" width={12} alt="search" />
          </button>
        </div>
        <div className="min-h-3/4 min-w-full flex items-center justify-center ">
          {userLikes && (
            <div className="grid grid-cols-4 md:grid-cols-10 gap-x-1 max-h-fit">
              {userLikes.map((item) => (
                <SongTrack
                  imgUrl={item.track_cover}
                  key={item.track_id}
                  id={item.track_id}
                  audioUrl={item.track_preview}
                  song={item.track_name}
                  artist={item.track_artist}
                  uri={item.track_uri}
                  spotify={spotify}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UTRLikes;