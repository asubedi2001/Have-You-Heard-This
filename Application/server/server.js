require("dotenv").config();
const SpotifyWebApi = require("spotify-web-api-node");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const sqlite3 = require('sqlite3')
const { open } = require('sqlite');
const app = express();

const DB_PATH = ''

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/login", (req, res) => {
  console.log("login request");
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: "http://localhost:3000",
    clientId: "ef99d0c9e56d4c889b3d1f6544e46b87",
    clientSecret: "b403786b72074de09ed4e66650149b33",
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      res.sendStatus(400);
    });
})

app.post("/refresh", (req, res) => {
  console.log("refresh request");
  const refreshToken = req.body.refreshToken;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      res.json({
        accessToken: data.body.accessToken,
        expiresIn: data.body.expiresIn,
      });
    })
    .catch((err) => {
      console.log(err);
      res.sendStatus(400);
    });
});

// API endpoint to handle SQL script to add user who logs in
app.post('/api/adduser', (req, res) => {
  console.log("add user request");
  const { spotify_id, display_name, email, pfp } = req.body;

  // Open the database
  let db = new sqlite3.Database('./database/utr.sqlite3');

  // SQL query to check if the user exists
  const sql = 'SELECT * FROM User WHERE spotify_id = ?';

  // Execute the query
  db.all(sql, [spotify_id], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.sendStatus(500); // Send error response
      return;
    }

    // Check if the user already exists
    const existingEntry = rows.length > 0;

    // If the user doesn't exist, insert a new entry
    if (!existingEntry) {
      console.log('Inserting user:', spotify_id, display_name, email, pfp);
      db.run('INSERT INTO User (spotify_id, display_name, email, pfp) VALUES (?, ?, ?, ?)', 
        [spotify_id, display_name, email, pfp], (err) => {
          if (err) {
            console.error('Error inserting user:', err);
            res.sendStatus(500); // Send error response
          } else {
            console.log('User added successfully');
            res.sendStatus(200); // Send success response
          }
          // Close the database connection
          db.close();
        });
    } else {
      console.log(`Entry with Spotify ID ${spotify_id} already exists`);
      res.sendStatus(409); // Send conflict response if entry already exists
      // Close the database connection
      db.close();
    }
  });
});

// API endpoint to handle SQL script to add user's liked song
app.post('/api/addlike', (req, res) => {
  console.log("add like request");
  const { id, user } = req.body;
  console.log(user);
  try {
    console.log("H");
      let db = new sqlite3.Database('./database/utr.sqlite3');
      // check if entry with the same data exists
      const existingEntry = db.all('SELECT * FROM UserLikes WHERE spotify_id = ? AND track_id = ?', user, id);
      const datetimeRes = db.get('SELECT datetime("now", "localtime") AS current_datetime');
      const datetime = datetimeRes.current_datetime;
      console.log(existingEntry);
      
      // if entry does not exist, create an entry with this data
      if (!existingEntry) {
        db.run('INSERT INTO UserLikes (spotify_id, track_id) VALUES (?, ?)', user, id);
        console.log("Hel");

          res.sendStatus(200); // Send success response
      } else {
        console.log("Hell");

          console.log(`Entry with User ID ${user} and Track ID ${id} already exists`);
          res.sendStatus(409); // Send conflict response if entry already exists
      }
      console.log("Hello!");
  } catch (error) {
      console.log("Fuck");
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add all recommended songs
app.post('/api/addsong', (req, res) => {
  console.log("add user request");
  const { track_id, track_name, track_cover, track_preview } = req.body;

  // Open the database
  let db = new sqlite3.Database('./database/utr.sqlite3');

  // SQL query to check if the user exists
  const sql = 'SELECT * FROM Song WHERE track_id = ?';

  // Execute the query
  db.all(sql, [track_id], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.sendStatus(500); // Send error response
      return;
    }

    // Check if the user already exists
    const existingEntry = rows.length > 0;

    // If the user doesn't exist, insert a new entry
    if (!existingEntry) {
      console.log('Inserting song:', track_id, track_name);
      db.run('INSERT INTO Song (track_id, track_name, track_cover, track_preview) VALUES (?, ?, ?, ?)', 
          [track_id, track_name, track_cover, track_preview], (err) => {
          if (err) {
            console.error('Error inserting song:', err);
            res.sendStatus(500); // Send error response
          } else {
            console.log('Song added successfully');
            res.sendStatus(200); // Send success response
          }
          // Close the database connection
          db.close();
        });
    } else {
      console.log(`Entry with Track ID ${track_id} already exists`);
      res.sendStatus(409); // Send conflict response if entry already exists
      // Close the database connection
      db.close();
    }
  });
});

// API endpoint to handle SQL script to add all recommended songs
app.post('/api/addToDB', (req, res) => {
  console.log("add user request");
  const { spotify_id, track_id, track_name, track_cover, track_preview } = req.body;

  // Open the database
  let db = new sqlite3.Database('./database/utr.sqlite3');

  // SQL query to check if the user exists
  const sql = 'SELECT * FROM UserLikes WHERE track_id = ? AND spotify_id = ?';

  // Execute the query
  db.all(sql, [track_id, spotify_id], (err, rows) => {
    if (err) {
      console.error('Error querying database:', err);
      res.sendStatus(500); // Send error response
      return;
    }

    // Check if the user already exists
    const existingEntry = rows.length > 0;

    // If the like doesn't exist, insert a new entry
    if (!existingEntry) {
      console.log('Inserting song:', track_id, track_name);
      db.run('INSERT INTO UserLikes (spotify_id, track_id, track_name, track_cover, track_preview) VALUES (?, ?, ?, ?)', 
          [spotify_id, track_id, track_name, track_cover, track_preview], (err) => {
          if (err) {
            console.error('Error inserting like:', err);
            res.sendStatus(500); // Send error response
          } else {
            console.log('Like added successfully');
            res.sendStatus(200); // Send success response
          }
          // Close the database connection
          db.close();
        });
    } else {
      console.log(`Entry with Track ID ${track_id} already exists for user ${spotify_id}`);
      res.sendStatus(409); // Send conflict response if entry already exists
      // Close the database connection
      db.close();
    }
  });
});

app.listen(3001);
