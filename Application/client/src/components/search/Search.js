import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "../motionComponents/AnimatedCard.js";
import SuggestedSearch from "./SuggestedSearch.js";
var WebApiRequest = require('./webApiRequest.js');

function Search({ spotify, setDiscoverPlaylist }) {
  const history = useHistory();
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState();
  const [sliderVal, setSliderVal] = useState(50);

  const searchSubmitHandler = (e) => {

    e.preventDefault();
    if (!spotify) {
      console.log("empty access token");
      return;
    }
    const artistIds = [];
    spotify.getMyTopArtists().then(
      (data) => {
        for(let i = 0; i < 5; i++){
          const str = data.body.items[i].id
          artistIds.push(str)
        }
      }
    )
    console.log(artistIds);
    console.log(["aojsdlaksjd;alksd", ";aksdja;lsdk;alskd;alskd", "asldkalskdlaksdlaksdlaksd"])
    console.log(artistIds.join(","));
    // spotify.getRecommendations({
    //   seed_artists: artistIds,
    //   target_popularity: sliderVal
    // }).then(
    //   (data) => {
    //     setResult(data.body.items);
    //     setIsLoading(false);
    //   },
    //   (err) => {
    //     console.error(err);
    //   }
    // );
    
    // artistStr = artistIds.at(0);
    // for(let i = 1; i < 5; i++){
    //   artistStr.concat(",", artistIds[i]);
    // }
    // console.log(artistStr);
    var _opts = {};
    _opts['target_popularity'] = sliderVal;
  
  };

  const playlistHandler = (id) => {
    spotify.getPlaylist(id).then(
      (data) => {
        let imgUrl;
        if (!data.body.images[0]) {
          imgUrl = "playlist.png";
        } else {
          imgUrl = data.body.images[0].url;
        }
        setDiscoverPlaylist({
          id: data.body.id,
          name: data.body.name,
          description: data.body.description,
          author: data.body.owner.display_name,
          image: imgUrl,
        });

        history.push("/discover");
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
          <h1 className="text-slate-100 pb-2">How obscure do you want it?</h1>
          <h1 className="text-slate-100 pb-2">{sliderVal}% Obscure</h1>
          <div className="flex flex-col items-center">
            <input className="min-w-96" id="slider" type="range" onChange={(val) => setSliderVal(100-val.target.value)}/>
          </div>
          <form className="h-9" onSubmit={searchSubmitHandler}>
            <button className="bg-slate-100 text-slate-900 h-full p-1 rounded-r-3xl px-3 ">
              <img className="" src="search.svg" width={12} alt="search" />
            </button>
          </form>
        </div>
        <div className="  min-h-3/4 min-w-full flex items-center justify-center ">
          {isLoading ? (
            ""
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 m-w-full sm:w-3/4 lg:gird-cols-7 gap-6">
              {result.map((item) => {
                let imgUrl;
                if (!item.images[0]) {
                  imgUrl = "playlist.png";
                } else {
                  imgUrl = item.images[0].url;
                }
                return (
                  <div
                    className="flex items-between "
                    key={item.id}
                    onClick={() => playlistHandler(item.id)}
                  >
                    <AnimatedCard className=" ">
                      <div className=" flex flex-col items-center cursor-pointer justify-between w-28">
                        <img className="" src={imgUrl} alt="" width={100} />
                        <h1 className="text-slate-300 text-xs">{item.name}</h1>
                      </div>
                    </AnimatedCard>
                  </div>
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
