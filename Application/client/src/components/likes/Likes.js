import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "../motionComponents/AnimatedCard.js";
import SongTrack from "../discover/SongTrack.js";
import Info from "../discover/Info.js";


function Likes({ spotify }) {
  const history = useHistory();
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState();
  const [sliderVal, setSliderVal] = useState(50);
  const [display, setDisplay] = useState({
    song: "",
    image: "",
    artist: "",
    warn: "",
    success: "",
  });

  const showLikes = (e) => {

    e.preventDefault();
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
  };

  return (
    <>
      <div className="flex flex-col items-center ml-1 ">
        <div className="flex flex-col items-center p-2 m-2 min-w-full">
          <h1 className="text-slate-100 pb-2">Here are the songs you've liked:</h1>
          <form className="h-9" onSubmit={showLikes}>
            <button className="bg-slate-100 text-slate-900 h-full p-1 rounded-3xl px-3 ">
              <img className="" src="search.svg" width={12} alt="search" />
            </button>
	  </form>
	</div>
        <div className="  min-h-3/4 min-w-full flex items-center justify-center ">
          {isLoading ? (
            ""
          ) : (
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
                  key={item.track.id}
                  id={item.track.id}
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
