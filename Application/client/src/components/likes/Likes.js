import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "../motionComponents/AnimatedCard.js";

function Likes({ spotify }) {
  const history = useHistory();
  const [result, setResult] = useState();
  const [isLoading, setIsLoading] = useState(true);

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
            <button className="">
                <AnimatedCard className=" ">
                    <div className=" flex flex-col items-center cursor-pointer justify-between w-36">
                        <img className="" src={"showmelikes.png"} alt=""/>
                    </div>
                </AnimatedCard>
            </button>
          </form>
        </div>
        <div className="  min-h-3/4 min-w-full flex items-center justify-center ">
          {isLoading ? (
            <h1 className="text-slate-100 pb-2">Display your likes with the button above!</h1>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 m-w-full sm:w-3/4 lg:gird-cols-7 gap-6">
              {result.map((item) => {
                console.log(item);
                let imgUrl;
                if (!item.track.album.images[0]) {
                  imgUrl = "playlist.png";
                } else {
                  imgUrl = item.track.album.images[0].url;
                }
                return (
                  <div
                    className="flex items-between "
                    key={item.id}
                  >
                    <AnimatedCard className=" ">
                      <div className=" flex flex-col items-center cursor-pointer justify-between w-28">
                        <img className="" src={imgUrl} alt="" width={100} />
                        <h1 className="text-slate-300 text-xs">{item.track.name}</h1>
                        <h1 className="text-slate-300 text-xs">by {item.track.artists[0].name}</h1>
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
export default Likes;