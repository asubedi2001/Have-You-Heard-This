import React from "react";
import data from "../constants/index.js";
import Header from "./Header.js";
import "../App.css"
import { ReactComponent as Logo} from "./Spotify-Icon-Black.svg"
function Login() {
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${data.CLIENT_ID}&response_type=code&redirect_uri=${data.REDIRECT_URI}&scope=${data.SCOPES}`;
  return (
    <>
      <div className="loginContainer">
        <div style={{flex:1}}>
          <h1 className="title">haveyouheardthis</h1>
          <h2 className="title">
            Find new artists without all the soundcloud ads!
          </h2>
        </div>
        <div className="box">
            <div style={{flex:2}} />
            <a className="login" href={authUrl}>
                <Logo className="logo"/>
                <p>Log in with Spotify</p>
            </a>
            <div style={{flex:2}} />
        </div>
      </div>
    </>
  );
}

export default Login;