CREATE TABLE User (
    spotify_id VARCHAR(255) PRIMARY KEY,
    display_name VARCHAR(255),
    email VARCHAR(255),
    pfp VARCHAR(255)
);

CREATE TABLE Song (
    track_id VARCHAR(255) PRIMARY KEY,
    track_name VARCHAR(255),
    album_cover VARCHAR(255),
    artist_id VARCHAR(255),
    genre_id VARCHAR(255),
    FOREIGN KEY (artist_id) REFERENCES Artist(artist_id),
    FOREIGN KEY (genre_id) REFERENCES Genre(genre_id)
);

CREATE TABLE UserLikes (
    spotify_id VARCHAR(255),
    track_id VARCHAR(255),
    PRIMARY KEY (spotify_id, track_id),
    FOREIGN KEY (spotify_id) REFERENCES User(spotify_id),
    FOREIGN KEY (track_id) REFERENCES Song(track_id)
);

CREATE TABLE UserDislikes (
    spotify_id VARCHAR(255),
    track_id VARCHAR(255),
    PRIMARY KEY (spotify_id, track_id),
    FOREIGN KEY (spotify_id) REFERENCES User(spotify_id),
    FOREIGN KEY (track_id) REFERENCES Song(track_id)
);