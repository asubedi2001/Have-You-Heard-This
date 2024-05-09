import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import AnimatedCard from "../motionComponents/AnimatedCard";
import axios from "axios";

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
  const [item, itemState] = useState();

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
  const addLikeHandler = (imgUrl, id, song) => {   
      
      if (!spotify) {
        console.log("empty access token");
        return;
      }
      var user2 = spotify.getMe();
      spotify.getMe().then(
        async (data) => {
          console.log("Hi");
          var user = data.body.uri;
          console.log(user);
          console.log(data.body);
          console.log('User attempting to add liked song.');
          try {
            const response = await axios.post('http://localhost:3001/api/addlike', JSON.stringify({
              user,
              id,
            }), {
              headers: {
                'Content-Type': 'application/json'
              }
            });

            if (response.status === 200) {
              console.log('Like added successfully');
              document.getElementById(song).src = "aakash_liked.png";
            } else {
              console.error('Failed to add like');
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

  const addDislikeHandler = (imgUrl, id, song) => {   
    console.log(id);
      
    if (!spotify) {
      console.log("empty access token");
      return;
    }

    spotify.getMe().then(
      async (data) => {
        var user = data.body.uri;
        console.log(user);
        console.log(data.body);
        console.log('User attempting to add disliked song.');
        try {
          const response = await axios.post('http://localhost:3001/api/adddislike', JSON.stringify({
            user,
            id,
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            console.log('Like added successfully');
            document.getElementById(id).src = "aakash_disliked.png";
          } else {
            console.error('Failed to add like');
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
  useEffect(async () => {
    setAudio(new Audio(audioUrl));
    spotify.getMe().then(
      async (data) => {
        var user = data.body.uri;
        try {
          const response = await axios.post('http://localhost:3001/api/getdislike', JSON.stringify({
            user,
            id,
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });
          if (response.status === 200) {
            document.getElementById(id).src = "aakash_disliked.png";
          } else {
            document.getElementById(id).src = "aakash_dislike.png";
            console.error('Failed to add like');
          }
        } catch (error) {
          console.error('Error:', error);
        }

        try {
          const response = await axios.post('http://localhost:3001/api/getlike', JSON.stringify({
            user,
            id,
          }), {
            headers: {
              'Content-Type': 'application/json'
            }
          });

          if (response.status === 200) {
            document.getElementById(song).src = "aakash_liked.png";
          } else {
            document.getElementById(song).src = "aakash_unliked.png";
          }
        } catch (error) {
          console.error('Error:', error);
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }, [audioUrl]);

  return (
    <div className="flex flex-col items-center justify-between w-28 shadow-md rounded-lg shadow-indigo-950 bg-blue-950">
      <div
        className="relative  hover:border-2 hover:border-sky-500"
        onMouseOver={play}
        onMouseOut={pause} 
      >
        <img src={imgUrl} alt="" />
        <div className="flex justify-between">
          <div className="flex">
            <motion.img id={id}
              whileTap={{ scale: "0.8" }}
              className="flex left-0 bottom-0 w-4 sm:w-8 p-1 cursor-pointer"
              src="aakash_dislike.png"
              onClick={() => addDislikeHandler(imgUrl, uri)}
              alt=""
            />
            <motion.img id={song}
              whileHover={{ scale: "1.125" }}
              whileTap={{ scale: "0.8" }}
              className="flex left-0 bottom-0 w-4 sm:w-8 p-1 cursor-pointer"
              src="like.png"
              onClick={() => addLikeHandler(imgUrl, uri, song)}
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
