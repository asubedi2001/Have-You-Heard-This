import React from "react";
import AnimatedCard from "./motionComponents/AnimatedCard.js";
import data from "../constants/index.js";

function Login() {
  const authUrl = `https://accounts.spotify.com/authorize?show_dialog&client_id=${data.CLIENT_ID}&response_type=code&redirect_uri=${data.REDIRECT_URI}&scope=${data.SCOPES}`;
  return (
    <>
    <div className="min-h-screen flex flex-col items-center justify-around bg-blue-900">
	    <div className="text-center max-w-prose">
        <div className="flex flex-row pt-8 justify-center">
          <img className="grow-0" src="aakash_logo.png" width={100}/>
          <h1 className="pb-4 pt-10 pl-0 text-slate-200 text-5xl grow-0">Have You Heard This?</h1>
        </div>
        <h2 className="p-4  text-slate-200 text-lg">Find small Artists based on your music tastes and help the radio station find new music! Like songs on the app to help influence a radio show on WMBC!</h2>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum1.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum2.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum3.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum4.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum5.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum6.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum7.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum8.jpeg" width={125} />
        <img className="shadow-lg shadow-indigo-950" src="loginAlbum9.jpeg" width={125} />
      </div>
      <div className="mx auto rounded-md bg-blue-900 shadow-lg shadow-indigo-950">
        <a href={authUrl}>
          <AnimatedCard>
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
    </div>
    </>
  );
}

export default Login;
