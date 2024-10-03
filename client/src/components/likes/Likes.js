import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import SongTrack from "../discover/SongTrack.js";


function Likes({ spotify }) {
  const history = useHistory();
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // e.preventDefault();
    if (!spotify) {
      console.log("empty access token");
      return;
    }
	  spotify.getMySavedTracks({
      limit: 50
    }).then(
      (data) => {
        console.log(data.body.items);
        setResult(data.body.items);
          setIsLoading(false);
      	},
        (err) => {
          console.error(err);
        }
    );
  });

  return (
    <>
      <div className="flex flex-col items-center ml-1 ">
        <div className="flex flex-col items-center p-2 m-2 min-w-full">
          <h1 className="text-slate-100 pb-2">Here are the songs you've liked recently:</h1>
	      </div>
        <div className="  min-h-3/4 min-w-full flex items-center justify-center ">
          {isLoading ? ("") : (
            <div className="grid grid-cols-4 md:grid-cols-10 gap-x-1 max-h-fit">
            {result.map((item) => {
              let imgUrl;
              if (!item.track.album.images[0]) {
                imgUrl = "album.png";
              } else {
                imgUrl = item.track.album.images[0].url;
              }
              return (
                <SongTrack
                  imgUrl={imgUrl}
                  key={item.track.uri}
                  id={item.track.uri}
                  audioUrl={item.track.preview_url}
                  song={item.track.name}
                  artist={item.track.artists[0].name}
                  uri={item.track.uri}
                  spotify={spotify}
                  />
                );
              })}
            </div> 
	         )}
        </div>
      </div>
    </>
  );
}
export default Likes;
