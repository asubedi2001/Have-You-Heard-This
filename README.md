<div style="display: flex; align-items: center;">
    <img src="https://raw.githubusercontent.com/asubedi2001/Have-You-Heard-This/main/client/public/aakash_logo.png" alt="Logo" width="50" style="margin-right: 10px;"/>
    <span style="font-size: 36px; font-weight: bold;"> Haveyouheardthis? </span>
</div>

### About

haveyouheardthis? is a project meant to aid in recommending users songs from lesser known artists. 
Users are asked to login with Spotify, and we use their listening history to let them preview (and save) songs that are similar that they might also like.
Recommendations are generated using Spotify API, and the songs that users like through the application get added to the user's Spotify likes.

### Tools used

- React
- TailwindCSS
- Node (for Auth Server) 

### How to run

- Fork and Clone this repository
- Go to [Spotify Developer Dashboard](/developer.spotify.com/dashboard/applications) and create an application
- Generate ClientID and Client Secret for the application.
- Update ENV for Server (server/.env.sample) and and Client (client/src/constants/index.js)
- Install dependencies for server and client individually, using `npm install`
- Cd into server and run `node server.js`
- Cd into client and run `npm run start`
- Project will be hosted at localhost:3000, server listening on port 3001.
