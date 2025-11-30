/*
Steven Yi, Michelle Liu
CS 3265- Project Phase 3
12/02/2025
*/

CREATE TABLE USER (
    user_id INT AUTO_INCREMENT,
    username VARCHAR(15) NOT NULL,
    PRIMARY KEY (user_id)
);

CREATE TABLE PLAYLIST (
    playlist_id INT AUTO_INCREMENT,
    number_of_likes INT NOT NULL,
    uploader_id INT,
    PRIMARY KEY (playlist_id),
    FOREIGN KEY (uploader_id) REFERENCES USER (user_id) ON DELETE CASCADE
);

CREATE TABLE ARTIST (
    artist_id INT AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    PRIMARY KEY (artist_id)
);

CREATE TABLE SONG (
    song_id INT AUTO_INCREMENT,
    name VARCHAR(15) NOT NULL,
    artist_id INT,
    release_date DATE,
    genre VARCHAR(15) NOT NULL,
    PRIMARY KEY (song_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (artist_id) ON DELETE CASCADE
);

CREATE TABLE PLAYLIST_SONGS (
    playlist_id INT,
    song_id INT,
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES PLAYLIST (playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES SONG (song_id) ON DELETE CASCADE
);

CREATE TABLE ALBUM (
    artist_id INT,
    name VARCHAR(15) NOT NULL,
    release_date DATE,
    PRIMARY KEY (artist_id, name),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (artist_id) ON DELETE CASCADE
);

CREATE TABLE ALBUM_SONGS (
    artist_id INT,
    name VARCHAR(15) NOT NULL,
    song_id INT,
    PRIMARY KEY (artist_id, name, song_id),
    FOREIGN KEY (artist_id) REFERENCES ARTIST (artist_id) ON DELETE CASCADE,
    FOREIGN KEY (song_id) REFERENCES SONG (song_id) ON DELETE CASCADE
);

-- Populating Tables

INSERT INTO USER (username) VALUES ('user_1');
SET @user_1_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('user_2');
SET @user_2_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (number_of_likes, uploader_id) VALUES (10, @user_1_id);
SET @playlist_1_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (number_of_likes, uploader_id) VALUES (8, @user_2_id);
SET @playlist_2_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Reol');
SET @artist_1_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Maroon 5');
SET @artist_2_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('No title', @artist_1_id, '2014-08-13', 'J-Pop');
SET @song_1_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('drop pop candy', @artist_1_id, '2014-07-18', 'J-Pop');
SET @song_2_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Payphone', @artist_2_id, '2012-04-16', 'Pop');
SET @song_3_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Memories', @artist_2_id, '2019-09-20', 'Pop');
SET @song_4_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_2_id, @song_1_id),
(@playlist_2_id, @song_2_id),
(@playlist_2_id, @song_3_id);

INSERT INTO ALBUM (artist_id, name, release_date)
VALUES (@artist_1_id, 'No Title-', '2016-03-18');

INSERT INTO ALBUM_SONGS (artist_id, name, song_id) VALUES
(@artist_1_id, 'No title', @song_1_id),
(@artist_1_id, 'drop pop candy', @song_2_id);

-- Functions