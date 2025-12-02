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
    name VARCHAR(50) NOT NULL,
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

CREATE TABLE PLAYLIST_LIKES (
    playlist_id INT NOT NULL,
    user_id INT NOT NULL,
    liked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (playlist_id, user_id),
    FOREIGN KEY (playlist_id) REFERENCES PLAYLIST (playlist_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USER (user_id) ON DELETE CASCADE
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

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id) VALUES ('Focus Beats', 1, @user_1_id);
SET @playlist_1_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id) VALUES ('Workout Essentials', 1, @user_2_id);
SET @playlist_2_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Reol');
SET @artist_1_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Maroon 5');
SET @artist_2_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Taylor Swift');
SET @artist_3_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('ImagineDrgns');
SET @artist_4_id := LAST_INSERT_ID();

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

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Blank Space', @artist_3_id, '2014-11-10', 'Pop');
SET @song_5_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Style', @artist_3_id, '2015-02-09', 'Pop');
SET @song_6_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Believer', @artist_4_id, '2017-02-01', 'Rock');
SET @song_7_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Thunder', @artist_4_id, '2017-04-27', 'Rock');
SET @song_8_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Billie Eilish');
SET @artist_5_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Ocean Eyes', @artist_5_id, '2016-11-18', 'Alt-Pop'),
('Bad Guy', @artist_5_id, '2019-03-29', 'Alt-Pop'),
('Bury A Friend', @artist_5_id, '2019-01-30', 'Alt-Pop'),
('Lovely', @artist_5_id, '2018-04-19', 'Alt-Pop'),
('Watch', @artist_5_id, '2017-06-29', 'Alt-Pop'),
('My Future', @artist_5_id, '2020-07-30', 'Alt-Pop'),
('Therefore I', @artist_5_id, '2020-11-12', 'Alt-Pop'),
('Ilomilo', @artist_5_id, '2019-03-29', 'Alt-Pop'),
('Xanny', @artist_5_id, '2019-03-29', 'Alt-Pop'),
('No Time To Die', @artist_5_id, '2020-02-13', 'Alt-Pop');

INSERT INTO ARTIST (name) VALUES ('Ed Sheeran');
SET @artist_6_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Shape of You', @artist_6_id, '2017-01-06', 'Pop'),
('Perfect', @artist_6_id, '2017-03-03', 'Pop'),
('Photograph', @artist_6_id, '2015-05-11', 'Pop'),
('Castle on Hill', @artist_6_id, '2017-01-06', 'Pop'),
('Galway Girl', @artist_6_id, '2017-03-17', 'Pop'),
('Dive', @artist_6_id, '2017-03-03', 'Pop'),
('Happier', @artist_6_id, '2018-04-27', 'Pop');


INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_2_id, @song_1_id),
(@playlist_2_id, @song_2_id),
(@playlist_2_id, @song_3_id),
(@playlist_2_id, @song_8_id);

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id) VALUES ('Indie Chill', 0, @user_1_id);
SET @playlist_3_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST_LIKES (playlist_id, user_id) VALUES
(@playlist_1_id, @user_2_id),
(@playlist_2_id, @user_1_id);

INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_3_id, @song_5_id),
(@playlist_3_id, @song_6_id),
(@playlist_3_id, @song_7_id);

INSERT INTO ALBUM (artist_id, name, release_date)
VALUES (@artist_1_id, 'No Title', '2016-03-18');

INSERT INTO ALBUM (artist_id, name, release_date)
VALUES (@artist_3_id, '1989', '2014-10-27');

INSERT INTO ALBUM (artist_id, name, release_date)
VALUES (@artist_4_id, 'Evolve', '2017-06-23');

INSERT INTO ALBUM_SONGS (artist_id, name, song_id) VALUES
(@artist_1_id, 'No title', @song_1_id),
(@artist_1_id, 'drop pop candy', @song_2_id),
(@artist_3_id, '1989', @song_5_id),
(@artist_3_id, '1989', @song_6_id),
(@artist_4_id, 'Evolve', @song_7_id),
(@artist_4_id, 'Evolve', @song_8_id);
