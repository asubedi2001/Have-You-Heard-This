import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import AnimatedCard from "../motionComponents/AnimatedCard";
function SongTrack({
  imgUrl,
  id,
  audioUrl,
  setDisplay,
  song,
  artist,
  uri,
  spotify,
  playlist,
  setPlaylist,
}) {
  //states

  const [audio, setAudio] = useState();

  const likeSongHandler = (id) => {
    console.log(id);
    spotify.addToMySavedTracks([id]).then(
      (data) => {
        if (data.statusCode === 200) {
          setDisplay({ success: "Song Liked!" });
        }
      },
      (err) => {
        console.error(err);
      }
    );
  };
  const addDislikeHandler = () => {
    const value = {
      uuid: uuidv4(),
      imgUrl,
      spotifyId: id,
      name: song,
      artist,
      uri,
    };
    setPlaylist([...playlist, value]);
    setDisplay({ success: "Song added to Playlist Creator!" });
  };
  //song handlers
  const pause = () => {
    audio.pause();
  };
  const play = async () => {
    await audio.play();
    if (!audioUrl) {
      setDisplay({
        song,
        artist,
        image: imgUrl,
        warn: "  No Preview Available  ",
      });
      return;
    }
  };
  useEffect(() => {
    setAudio(new Audio(audioUrl));
  }, [audioUrl]);

  return (
    <div className = "flex flex-col items-center justify-between w-28 shadow-md rounded-lg shadow-indigo-950 bg-blue-950">
      <div
        className="relative  hover:border-2 hover:border-sky-500"
        onMouseOver={play}
        onMouseOut={pause}
      >
        <img src={imgUrl} alt="" />
        <div className="flex justify-between">
          <div className = "flex">
            <img
              whileTap={{ scale: "0.8" }}
              className="flex left-0 bottom-0 w-4 sm:w-8 p-1 cursor-pointer rotate-180"
              src="aakash_unliked.png"
              onClick={() => addDislikeHandler()}
              alt=""
            />
            <motion.img
              whileHover={{ scale: "1.125" }}
              whileTap={{ scale: "0.8" }}
              className="flex left-0 bottom-0 w-4 sm:w-8 p-1 cursor-pointer"
              src="aakash_unliked.png"
              onClick={() => addDislikeHandler()}
              alt=""
            />
          </div>
          <motion.img
            whileHover={{ scale: "1.275" }}
            whileTap={{ scale: "0.8" }}
            className="flex bottom-0 right-0 w-4 sm:w-8 p-1 cursor-pointer"
            src="like.svg"
            onClick={() => likeSongHandler(id)}
            alt=""
          />
        </div>
        <h1 className="text-slate-300 text-xs font-semibold">{song}</h1>
        <h1 className="text-slate-300 text-xs font-semibold">by {artist}</h1>
      </div>
    </div>
  );
}

export default SongTrack;
