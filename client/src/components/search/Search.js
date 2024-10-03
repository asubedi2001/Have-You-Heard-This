import React, { useState } from "react";
import SongTrack from "../discover/SongTrack.js";
import axios from "axios";

function Search({ spotify }) {
  const [result, setResult] = useState();
  const [age, setAge] = useState('medium_term');
  const [isLoading, setIsLoading] = useState(true);
  const [sliderVal, setSliderVal] = useState(50);

  // Function to add song to Table of all recommended songs.
  const addTrack = async (track_id, track_name, track_cover, track_preview, track_artist, track_uri) => {
    try {
      const response = await axios.post('http://localhost:3001/api/addsong', JSON.stringify({
        track_id,
        track_name,
        track_cover,
        track_preview,
        track_artist,
        track_uri
      }), {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.status === 200) {
        console.log('Track added successfully');
      } else {
        console.error('Failed to add track');
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
    spotify.getMyTopArtists({time_range: {age}}).then(
      (data) => {
        for(let i = 0; i < 5; i++){
          const str = data.body.items[i].id
          artistIds.push(str)
        }
        
	      str = artistIds.join(",");
        spotify.getRecommendations({
	        limit: 100,
          seed_artists: str,
          max_popularity: (sliderVal+5 < 100 ? sliderVal+5 : 100),
          min_popularity: (sliderVal-20 > 0 ? sliderVal-20 : 0),
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
          <h1 className="text-slate-100 text-xl pb-2">How popular should it be?</h1>
          <h1 className="text-slate-100 text-lg pb-2">{sliderVal}% Popularity</h1>
          <div className="flex flex-col items-center min-w-full">
            <input className="w-5/12" id="slider" type="range" onChange={(val) => setSliderVal(val.target.value)}/>
          </div>
          <form className="h-9 pt-2" onSubmit={searchSubmitHandler}>
            <button className="transition ease-in-out delay-100 bg-slate-100 text-slate-900 h-full p-2 rounded-3xl px-3 hover:scale-110">
              <img className="" src="search.svg" width={12} alt="search" />
            </button>
          </form>
          <div className="flex flex-row space-x-20 pt-6">
            <button className="text-white px-2 rounded-full border-2 border-full bg-blue-600 border-blue-600 transition ease-in-out delay-80 hover:scale-110" 
              onClick={(e) => setAge({ age:"short_term" })}>
              Short Term
            </button>
            <button className="text-white px-2 rounded-full border-2 border-full bg-blue-600 border-blue-600 transition ease-in-out delay-80 hover:scale-110" 
              onClick={(e) => setAge({ age:"medium_term" })}>
                Medium Term
            </button>
            <button className="text-white px-2 rounded-full border-2 border-full bg-blue-600 border-blue-600 transition ease-in-out delay-80 hover:scale-110" 
              onClick={(e) => setAge({ age:"long_term" })}>
                Long Term
            </button>

          </div>
        </div>
        <div className="  min-h-3/4 min-w-full flex items-center justify-center ">
          {isLoading ? ("") : 
          (
            <div className="grid grid-cols-4 md:grid-cols-10 gap-x-1 max-h-fit">
            {result.map((item) => {
              let imgUrl;
              if (!item.album.images[0]) {
                imgUrl = "album.png";
              } else {
                imgUrl = item.album.images[0].url;
              }
              addTrack(item.uri, item.name, imgUrl, item.preview_url, item.artists[0].name, item.uri);
              return (
                <SongTrack
                  imgUrl={imgUrl}
                  key={item.uri}
                  id={item.uri}
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
