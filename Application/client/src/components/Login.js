import React from "react";
import AnimatedCard from "./motionComponents/AnimatedCard.js";
import data from "../constants/index.js";

function Login() {
  const authUrl = `https://accounts.spotify.com/authorize?show_dialog&client_id=${data.CLIENT_ID}&response_type=code&redirect_uri=${data.REDIRECT_URI}&scope=${data.SCOPES}`;
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-around bg-background">
	    <div className=" text-center">
        <h1 className="p-4  text-2xl">Have You Heard This?</h1>
        <h2>
          Find small Artists based on your music tastes
        </h2>
        </div>
        <a href={authUrl}>
          <AnimatedCard className=" ">
            <div className="mx-auto border rounded-md p-2 bg-green-400">
              <div className="flex text-neutral-900  mx-2">
                <img
                  src="spotify-black.svg"
                  width={25}
                  alt="spotify"
                  className="mx-2"
                />
                Log in with Spotify
              </div>
            </div>
          </AnimatedCard>
        </a>
      </div>
    </>
  );
}

export default Login;
