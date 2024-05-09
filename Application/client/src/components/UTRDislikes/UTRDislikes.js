import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SongTrack from "../discover/SongTrack.js";
import axios from "axios";

function UTRDislikes({ spotify }) {
  console.log("UTR Dislikes being created...");
  const [userDislikes, setUserDislikes] = useState(null);
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!spotify) {
        console.log("empty access token");
        return;
      }
      try {
        spotify.getMe().then(
            async (data) => {
              console.log("in data scope" + data.body.uri);
              getUserDislikes(data.body.uri);
            });
      } catch (err) {
        console.error(err);
        console.log("bad thing happen");
      }
    };

    fetchUserProfile();
  }, [spotify]);

  // Function to get all user UTR likes.
  const getUserDislikes = async (spotify_id) => {
    console.log("START GUL SPOTIFYID");
    console.log(spotify_id);
    console.log("END GUL SPOTIFYID");
    try {
      const response = await axios.get("http://localhost:3001/api/getdislikes",
        {params: {
            spotify_id: spotify_id,
        }},
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      
      if (response.status === 200) {
        setUserDislikes(response.data);
      } else {
        console.error("Failed to get likes");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(userDislikes);

  return (
    <>
      <div className="flex flex-col items-center ml-1 ">
        <div className="flex flex-col items-center p-2 m-2 min-w-full">
          <h1 className="text-slate-100 pb-2">Here are the songs you've disliked:</h1>
        </div>
        <div className="min-h-3/4 min-w-full flex items-center justify-center ">
          {userDislikes && (
            <div className="grid grid-cols-4 md:grid-cols-10 gap-x-1 max-h-fit">
              {userDislikes.map((item) => (
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

export default UTRDislikes;