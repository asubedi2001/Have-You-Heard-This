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
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sql = 'SELECT * FROM UserLikes WHERE spotify_id = ? AND track_id = ?';
    db.all(sql, [user, id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
  
      // Check if the user already exists
      const existingEntry = rows.length > 0;
      const sanityCheck = db.all('SELECT * FROM UserLikes WHERE spotify_id = ? AND track_id = ?', user, id);
      console.log(existingEntry);
      // If the user doesn't exist, insert a new entry
      if (!existingEntry) {
        console.log('Inserting user:', user, id);
        db.run('INSERT INTO UserLikes (spotify_id, track_id) VALUES (?, ?)', 
          [user, id], (err) => {
            if (err) {
              console.error('Error inserting song:', err);
              res.sendStatus(500); // Send error response
            } else {
              console.log('Song inserted successfully');
              res.sendStatus(200); // Send success response
            }
            // Close the database connection
            db.close();
          });
      } else {
        console.log(`Entry with Spotify ID ${user} and track id ${id} already exists`);
        res.sendStatus(409); // Send conflict response if entry already exists
        // Close the database connection
        db.close();
      }
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add user's liked song
app.post('/api/adddislike', (req, res) => {
  console.log("add dislike request");
  const { id, user } = req.body;
  console.log(user);
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sql = 'SELECT * FROM UserDislikes WHERE spotify_id = ? AND track_id = ?';
    db.all(sql, [user, id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
  
      // Check if the user already exists
      const existingEntry = rows.length > 0;
      // If the user doesn't exist, insert a new entry
      if (!existingEntry) {
        console.log('Inserting user:', user, id);
        db.run('INSERT INTO UserDislikes (spotify_id, track_id) VALUES (?, ?)', 
          [user, id], (err) => {
            if (err) {
              console.error('Error inserting song:', err);
              res.sendStatus(500); // Send error response
            } else {
              console.log('Song inserted successfully');
              res.sendStatus(200); // Send success response
            }
            // Close the database connection
            db.close();
          });
      } else {
        console.log(`Entry with Spotify ID ${user} and track id ${id} already exists`);
        res.sendStatus(409); // Send conflict response if entry already exists
        // Close the database connection
        db.close();
      }
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to get ALL of user's liked songs.
app.get('/api/getlikes', (req, res) => {
  console.log("get likes request");
  console.log(req.query);
  const spotify_id = req.query.spotify_id;
  console.log(spotify_id);
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sanityCheck = db.all('SELECT * FROM UserLikes JOIN Song ON UserLikes.track_id=Song.track_id WHERE spotify_id = ?', spotify_id);
      console.log(sanityCheck);



    const sql = 'SELECT * \
    FROM UserLikes \
    JOIN Song \
    ON UserLikes.track_id=Song.track_id \
    WHERE UserLikes.spotify_id = ?';
    db.all(sql, [spotify_id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
      console.log(rows);
      res.json(rows);
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add user's liked song
app.post('/api/getlike', (req, res) => {
  console.log("add like request");
  const { id, user } = req.body;
  console.log(user);
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sql = 'SELECT * FROM UserLikes WHERE spotify_id = ? AND track_id = ?';
    db.all(sql, [user, id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
  
      // Check if the user already exists
      const existingEntry = rows.length > 0;
      console.log(existingEntry);
      // If the user doesn't exist, insert a new entry
      if (!existingEntry) {
        res.sendStatus(201);
        db.close();
      } else {
        res.sendStatus(200); // Send conflict response if entry already exists
        // Close the database connection
        db.close();
      }
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add user's liked song
app.post('/api/getdislike', (req, res) => {
  console.log("add dislike request");
  const { id, user } = req.body;
  console.log(user);
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sql = 'SELECT * FROM UserDislikes WHERE spotify_id = ? AND track_id = ?';
    db.all(sql, [user, id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
  
      // Check if the user already exists
      const existingEntry = rows.length > 0;
      // If the user doesn't exist, insert a new entry
      if (!existingEntry) {
        res.sendStatus(201);
        db.close();
      } else {
        res.sendStatus(200); // Send conflict response if entry already exists
        // Close the database connection
        db.close();
      }
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add user's liked song
app.post('/api/deleteUser', (req, res) => {
  console.log("add dislike request");
  const { id, user } = req.body;
  console.log(user);
  let db = new sqlite3.Database('./database/utr.sqlite3');
  try {
    const sql = 'SELECT * FROM UserDislikes WHERE spotify_id = ? AND track_id = ?';
    db.all(sql, [user, id], (err, rows) => {
      if (err) {
        console.error('Error querying database:', err);
        res.sendStatus(500); // Send error response
        return;
      }
  
      // Check if the user already exists
      const existingEntry = rows.length > 0;
      // If the user doesn't exist, insert a new entry
      if (!existingEntry) {
        console.log('Inserting user:', user, id);
        db.run('INSERT INTO UserDislikes (spotify_id, track_id) VALUES (?, ?)', 
          [user, id], (err) => {
            if (err) {
              console.error('Error inserting song:', err);
              res.sendStatus(500); // Send error response
            } else {
              console.log('Song inserted successfully');
              res.sendStatus(200); // Send success response
            }
            // Close the database connection
            db.close();
          });
      } else {
        console.log(`Entry with Spotify ID ${user} and track id ${id} already exists`);
        res.sendStatus(409); // Send conflict response if entry already exists
        // Close the database connection
        db.close();
      }
    });
  } catch (error) {
      console.error('Error:', error);
      res.sendStatus(500); // Send error response
  }
});

// API endpoint to handle SQL script to add all recommended songs
app.post('/api/addsong', (req, res) => {
  console.log("add user request");
  const { track_id, track_name, track_cover, track_preview, track_artist, track_uri } = req.body;

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
      db.run('INSERT INTO Song (track_id, track_name, track_cover, track_preview, track_artist, track_uri) VALUES (?, ?, ?, ?, ?, ?)', 
          [track_id, track_name, track_cover, track_preview, track_artist, track_uri], (err) => {
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

// API endpoint to delete user if they press the delete user on userinfo page
app.post('/api/deleteuser', (req, res) => {
  console.log("delete user request");
  const { spotify_id } = req.body;

  // Open the database
  let db = new sqlite3.Database(DB_PATH);

  // SQL queries to delete user data
  const deleteUserQuery = 'DELETE FROM User WHERE spotify_id = ?';
  const deleteLikesQuery = 'DELETE FROM UserLikes WHERE spotify_id = ?';
  const deleteDislikesQuery = 'DELETE FROM UserDislikes WHERE spotify_id = ?';

  // Execute the delete queries
  db.run(deleteUserQuery, [spotify_id], function(err) {
    if (err) {
      console.error('Error deleting user data:', err);
      res.sendStatus(500); // Send error response
      return;
    }
    console.log(`Deleted user data for spotify_id: ${spotify_id}`);

    // Execute the likes deletion query
    db.run(deleteLikesQuery, [spotify_id], function(err) {
      if (err) {
        console.error('Error deleting user likes data:', err);
        res.sendStatus(500); // Send error response
        return;
      }
      console.log(`Deleted user likes data for spotify_id: ${spotify_id}`);

      // Execute the dislikes deletion query
      db.run(deleteDislikesQuery, [spotify_id], function(err) {
        if (err) {
          console.error('Error deleting user dislikes data:', err);
          res.sendStatus(500); // Send error response
          return;
        }
        console.log(`Deleted user dislikes data for spotify_id: ${spotify_id}`);

        // Send success response
        res.sendStatus(200);
      });
    });
  });

  // Close the database connection
  db.close();
});



app.listen(3001);
