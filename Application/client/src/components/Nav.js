import React from "react";
import { Link } from "react-router-dom";

function Nav() {
  return (
    <>
      <div className="text flex items-center  justify-between">
        <Link to="/">
          <div className="flex items-center">
            <div className="p-2">
              <img
                src="aakash_logo.png"
                width={40}
                alt="logo"
              />
            </div>
            <h1 className="invisible sm:visible">Have you heard this?</h1>
          </div>
        </Link>

        <div className=" flex items-center w-16 text-xs sm:text-sm justify-between">
        <span>
          <Link to="/likepage">
            <img
              src="spotifyHeart.png"
              className="cursor-pointer"
              width={15}
              alt="likes"
            />
          </Link>
        </span>
          <span>
            <img
              src="gizz.jpg"
              className="rounded-full border border-slate-900 "
              width={25}
              alt=""
            />
          </span>
          <a href="/">
            <img
              src="logout.svg"
              className="cursor-pointer"
              width={15}
              alt="logout"
            />
          </a>
        </div>
      </div>
    </>
  );
}

export default Nav;
