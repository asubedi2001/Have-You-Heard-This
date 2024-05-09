import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import AnimatedCard from "./motionComponents/AnimatedCard.js";
import axios from "axios";

function Nav({ spotify }) {
  const [userProfile, setUserProfile] = useState(null);
  const history = useHistory();

  // Function to add user
  const addUser = async (spotify_id, display_name, email, pfp) => {
    try {
      const response = await axios.post('http://localhost:3001/api/adduser', JSON.stringify({
        spotify_id,
        display_name,
        email,
        pfp
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
 
  useEffect(() => {
    const fetchUserProfile = () => {
      if (!spotify) {
        console.log("empty access token");
        return;
      }
      spotify.getMe().then(
        (data) => {
          console.log(data.body);
          setUserProfile(data.body);
          console.log('User attempting to add.');
          addUser(data.body.uri, data.body.display_name, data.body.email, data.body.images[0].url);
        },
        (err) => {
          console.error(err);
        }
      );
    };

    fetchUserProfile();
  }, [spotify]);

  return (
    <>
      <div className="text flex items-center justify-between bg-blue-900">
        <Link to="/">
          <div className="flex items-center">
            <div className="p-2">
              <img
                src="aakash_logo.png"
                width={70}
                alt="logo"
              />
            </div>
            <h1 className="invisible sm:visible text-slate-200 text-2xl">Have you heard this?</h1>
          </div>
        </Link>

        <div className="flex items-center w-17 text-xs space-x-8 sm:text-sm justify-between">
        <span>         
          <AnimatedCard>
            <Link to="/UTRdislikes">
              <img
                src="aakash_disliked2.png"
                className="cursor-pointer"
                width={35}
                alt="Likes"
              />
            </Link>
          </AnimatedCard>
        </span>
        <span>         
          <AnimatedCard>
            <Link to="/UTRlikes">
              <img
                src="aakash_liked.png"
                className="cursor-pointer"
                width={35}
                alt="Likes"
              />
            </Link>
          </AnimatedCard>
        </span>
        <span>
          <AnimatedCard>
            <Link to="/likepage">
              <img
                src="spotifyHeart.png"
                className="cursor-pointer"
                width={45}
                alt="likes"
              />
            </Link>
          </AnimatedCard>
        </span>
        {userProfile && userProfile.images && userProfile.images.length > 0 ? (
          <span>
            <AnimatedCard>
              <Link to="/userinfo">
                <img
                  src={userProfile.images[0].url}
                  alt="User Profile"
                  className="rounded-full border border-slate-900"
                  width={45}
                />
              </Link>
            </AnimatedCard>
          </span>
        ) : (
          <span>
            <AnimatedCard>
              <Link to="/userinfo">
                <img
                  src="gizz.jpg"
                  alt="Default Profile"
                  className="rounded-full border border-slate-900"
                  width={45}
                />
              </Link>
            </AnimatedCard>
          </span>
          
        )}
        <AnimatedCard>
          <a href="/">
            <img
              src="logout.svg"
              className="cursor-pointer"
              width={35}
              alt="logout"
            />
          </a>
        </AnimatedCard>
        </div>
      </div>
    </>
  );
}

export default Nav;

