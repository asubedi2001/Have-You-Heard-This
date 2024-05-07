import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "../motionComponents/AnimatedCard.js";
import SongTrack from "../discover/SongTrack.js";
import Info from "../discover/Info.js";
import axios from "axios";

function Search({ spotify }) {
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

  // Function to add song to Table of all recommended songs.
  const addTrack = async (track_id, track_name, track_cover, track_preview) => {
    try {
      const response = await axios.post('http://localhost:3001/api/addsong', JSON.stringify({
        track_id,
        track_name,
        track_cover,
        track_preview
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        console.log('User added successfully');
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Function to add user like
  const addLike = async (spotify_id, track_id) => {
    try {
      const response = await axios.post('http://localhost:3001/api/addlike', JSON.stringify({
        spotify_id,
        track_id
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        console.log('User added successfully');
      } else {
        console.error('Failed to add user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const searchSubmitHandler = (e) => {

    e.preventDefault();
    if (!spotify) {
      console.log("empty access token");
      return;
    }
    let artistIds = [];
    let str = "";
    spotify.getMyTopArtists().then(
      (data) => {
        for(let i = 0; i < 5; i++){
          const str = data.body.items[i].id
          artistIds.push(str)
      }
        
	str = artistIds.join(",");
        console.log(artistIds);
        spotify.getRecommendations({
	  limit: 24,
          seed_artists: str,
          max_popularity: (sliderVal+5 < 100 ? sliderVal+5 : 100),
          min_popularity: (sliderVal-20 > 0 ? sliderVal-20 : 0),
          limit: 100
        }).then(
          (data) => {
            console.log(data);
	     setResult(data.body.tracks);
	    setIsLoading(false);
          },
          (err) => {
            console.error(err);
          }
        );
      }
    );
  };

  return (
    <>
      <div className="flex flex-col items-center ml-1 ">
        <div className="flex flex-col items-center p-2 m-2 min-w-full">
          <h1 className="text-slate-100 pb-2">How popular should it be?</h1>
          <h1 className="text-slate-100 pb-2">{sliderVal}% Popularity</h1>
          <div className="flex flex-col items-center">
            <input className="min-w-96" id="slider" type="range" onChange={(val) => setSliderVal(val.target.value)}/>
          </div>
          <form className="h-9" onSubmit={searchSubmitHandler}>
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
              if (!item.album.images[0]) {
                imgUrl = "album.png";
              } else {
                imgUrl = item.album.images[0].url;
              }
              addTrack(item.uri, item.name, imgUrl, item.preview_url);
              return (
                <SongTrack
                  imgUrl={imgUrl}
                  key={item.id}
                  id={item.id}
                  audioUrl={item.preview_url}
                  song={item.name}
                  artist={item.artists[0].name}
                  uri={item.uri}
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
export default Search;
