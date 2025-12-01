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
('Happier', @artist_6_id, '2018-04-27', 'Pop'),
('Afterglow', @artist_6_id, '2020-12-21', 'Pop'),
('Sing', @artist_6_id, '2014-04-07', 'Pop'),
('Bloodstream', @artist_6_id, '2015-02-17', 'Pop');

INSERT INTO ARTIST (name) VALUES ('Adele');
SET @artist_7_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Hello', @artist_7_id, '2015-10-23', 'Soul'),
('Skyfall', @artist_7_id, '2012-10-05', 'Soul'),
('Someone Like U', @artist_7_id, '2011-01-24', 'Soul'),
('Rolling Deep', @artist_7_id, '2010-11-29', 'Soul'),
('Send My Love', @artist_7_id, '2016-05-16', 'Soul'),
('When We Were', @artist_7_id, '2011-11-18', 'Soul'),
('Water Under', @artist_7_id, '2015-11-20', 'Soul'),
('Easy On Me', @artist_7_id, '2021-10-15', 'Soul'),
('Set Fire', @artist_7_id, '2011-07-04', 'Soul'),
('Turning Tabl', @artist_7_id, '2011-11-18', 'Soul');

INSERT INTO ARTIST (name) VALUES ('Drake');
SET @artist_8_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Gods Plan', @artist_8_id, '2018-01-19', 'Hip-Hop'),
('One Dance', @artist_8_id, '2016-04-05', 'Hip-Hop'),
('Hotline Bling', @artist_8_id, '2015-07-31', 'Hip-Hop'),
('In My Feel', @artist_8_id, '2018-06-08', 'Hip-Hop'),
('Nonstop', @artist_8_id, '2018-06-29', 'Hip-Hop'),
('Passionfruit', @artist_8_id, '2017-03-10', 'Hip-Hop'),
('Started', @artist_8_id, '2013-08-06', 'Hip-Hop'),
('Take Care', @artist_8_id, '2011-11-15', 'Hip-Hop'),
('Hold On', @artist_8_id, '2013-09-24', 'Hip-Hop'),
('Tuscan Lthr', @artist_8_id, '2013-09-24', 'Hip-Hop');

INSERT INTO ARTIST (name) VALUES ('Eminem');
SET @artist_9_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Lose Yourself', @artist_9_id, '2002-10-28', 'Rap'),
('Stan', @artist_9_id, '2000-12-09', 'Rap'),
('Rap God', @artist_9_id, '2013-10-14', 'Rap'),
('Without Me', @artist_9_id, '2002-04-26', 'Rap'),
('Mockingbird', @artist_9_id, '2004-04-25', 'Rap'),
('Love Game', @artist_9_id, '2013-11-05', 'Rap'),
('Not Afraid', @artist_9_id, '2010-04-29', 'Rap'),
('Berzerk', @artist_9_id, '2013-08-25', 'Rap'),
('River', @artist_9_id, '2017-11-10', 'Rap'),
('Venom', @artist_9_id, '2018-09-21', 'Rap');

INSERT INTO ARTIST (name) VALUES ('Bruno Mars');
SET @artist_10_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Uptown Funk', @artist_10_id, '2014-11-10', 'Pop'),
('Just Way You', @artist_10_id, '2010-09-20', 'Pop'),
('Treasure', @artist_10_id, '2013-05-10', 'Pop'),
('Grenade', @artist_10_id, '2010-09-28', 'Pop'),
('24K Magic', @artist_10_id, '2016-10-07', 'Pop'),
('Locked Out', @artist_10_id, '2012-10-01', 'Pop'),
('VersaceFloor', @artist_10_id, '2014-01-13', 'Pop'),
('Count On Me', @artist_10_id, '2010-10-07', 'Pop'),
('Chunky', @artist_10_id, '2016-11-04', 'Pop'),
('Finesse', @artist_10_id, '2016-11-18', 'Pop');

INSERT INTO ARTIST (name) VALUES ('Dua Lipa');
SET @artist_11_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Levitating', @artist_11_id, '2020-10-01', 'Dance'),
('New Rules', @artist_11_id, '2017-06-02', 'Dance'),
('IDGAF', @artist_11_id, '2018-01-12', 'Dance'),
('Break My Hrt', @artist_11_id, '2020-03-23', 'Dance'),
('Physical', @artist_11_id, '2020-01-31', 'Dance'),
('Hallucinat', @artist_11_id, '2020-07-10', 'Dance'),
('BeTheOne', @artist_11_id, '2015-10-30', 'Dance'),
('Swan Song', @artist_11_id, '2019-01-24', 'Dance'),
('Cool', @artist_11_id, '2020-03-27', 'Dance'),
('Love Again', @artist_11_id, '2021-06-04', 'Dance');

INSERT INTO ARTIST (name) VALUES ('Coldplay');
SET @artist_12_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Yellow', @artist_12_id, '2000-06-26', 'Alt-Rock'),
('Fix You', @artist_12_id, '2005-09-05', 'Alt-Rock'),
('Paradise', @artist_12_id, '2011-09-12', 'Alt-Rock'),
('Clocks', @artist_12_id, '2003-03-24', 'Alt-Rock'),
('Speed Lif', @artist_12_id, '2008-09-15', 'Alt-Rock'),
('Viva Vida', @artist_12_id, '2008-05-25', 'Alt-Rock'),
('Adventure', @artist_12_id, '2015-11-06', 'Alt-Rock'),
('Magic', @artist_12_id, '2014-03-03', 'Alt-Rock'),
('Everglow', @artist_12_id, '2015-11-27', 'Alt-Rock'),
('Hymn Wld', @artist_12_id, '2014-09-25', 'Alt-Rock');

INSERT INTO ARTIST (name) VALUES ('The Weeknd');
SET @artist_13_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Blinding Lt', @artist_13_id, '2019-11-29', 'R&B'),
('Starboy', @artist_13_id, '2016-09-22', 'R&B'),
('I Feel It', @artist_13_id, '2015-08-21', 'R&B'),
('Save Tears', @artist_13_id, '2020-08-09', 'R&B'),
('Call Out My', @artist_13_id, '2016-11-17', 'R&B'),
('Earned It', @artist_13_id, '2015-02-03', 'R&B'),
('InYourEyes', @artist_13_id, '2020-03-24', 'R&B'),
('Secrets', @artist_13_id, '2016-11-18', 'R&B'),
('Reminder', @artist_13_id, '2017-05-09', 'R&B'),
('Often', @artist_13_id, '2014-06-16', 'R&B');

INSERT INTO ARTIST (name) VALUES ('Kendrick L');
SET @artist_14_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre) VALUES
('Humble', @artist_14_id, '2017-03-30', 'Hip-Hop'),
('Alright', @artist_14_id, '2015-06-30', 'Hip-Hop'),
('DNA', @artist_14_id, '2017-04-18', 'Hip-Hop'),
('Loyalty', @artist_14_id, '2017-07-14', 'Hip-Hop'),
('PoeticJustc', @artist_14_id, '2012-10-22', 'Hip-Hop'),
('King Kunta', @artist_14_id, '2015-03-24', 'Hip-Hop'),
('Swimming', @artist_14_id, '2012-04-03', 'Hip-Hop'),
('Element', @artist_14_id, '2017-06-20', 'Hip-Hop'),
('Love', @artist_14_id, '2017-12-21', 'Hip-Hop'),
('Money Tree', @artist_14_id, '2012-10-22', 'Hip-Hop');

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
VALUES (@artist_1_id, 'No Title-', '2016-03-18');

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

-- Additional seed data

-- New Users
INSERT INTO USER (username) VALUES ('melody_mx');
SET @user_3_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('sunrise_sam');
SET @user_4_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('nightowl_jo');
SET @user_5_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('vinyl_ari');
SET @user_6_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('beatseeker');
SET @user_7_id := LAST_INSERT_ID();

INSERT INTO USER (username) VALUES ('lofi_luke');
SET @user_8_id := LAST_INSERT_ID();

-- New Artists
INSERT INTO ARTIST (name) VALUES ('Halsey');
SET @artist_15_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Tame Impala');
SET @artist_16_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('ODESZA');
SET @artist_17_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Grimes');
SET @artist_18_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Disclosure');
SET @artist_19_id := LAST_INSERT_ID();

INSERT INTO ARTIST (name) VALUES ('Lorde');
SET @artist_20_id := LAST_INSERT_ID();

-- Songs by Halsey
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Colors', @artist_15_id, '2015-02-09', 'Alt-Pop');
SET @song_colors_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Ghost', @artist_15_id, '2014-07-28', 'Alt-Pop');
SET @song_ghost_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Gasoline', @artist_15_id, '2015-10-29', 'Alt-Pop');
SET @song_gasoline_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Control', @artist_15_id, '2016-08-25', 'Alt-Pop');
SET @song_control_id := LAST_INSERT_ID();

-- Songs by Tame Impala
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Elephant', @artist_16_id, '2012-07-25', 'Alt-Rock');
SET @song_elephant_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Let It Happen', @artist_16_id, '2015-03-10', 'Alt-Rock');
SET @song_letithappen_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Borderline', @artist_16_id, '2019-04-12', 'Alt-Rock');
SET @song_borderline_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Patience', @artist_16_id, '2019-03-22', 'Alt-Rock');
SET @song_patience_id := LAST_INSERT_ID();

-- Songs by ODESZA
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Say My Name', @artist_17_id, '2014-09-16', 'Electronic');
SET @song_saymyname_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Line of Sight', @artist_17_id, '2017-04-25', 'Electronic');
SET @song_lineofsight_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('A Moment', @artist_17_id, '2019-07-25', 'Electronic');
SET @song_amoment_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Across Room', @artist_17_id, '2017-09-22', 'Electronic');
SET @song_acrossroom_id := LAST_INSERT_ID();

-- Songs by Grimes
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Oblivion', @artist_18_id, '2012-03-06', 'Alt-Pop');
SET @song_oblivion_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Genesis', @artist_18_id, '2011-12-05', 'Alt-Pop');
SET @song_genesis_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Flesh Bone', @artist_18_id, '2012-04-20', 'Alt-Pop');
SET @song_fleshbone_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Realiti', @artist_18_id, '2015-03-08', 'Alt-Pop');
SET @song_realiti_id := LAST_INSERT_ID();

-- Songs by Disclosure
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Latch', @artist_19_id, '2012-10-08', 'Electronic');
SET @song_latch_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Omen', @artist_19_id, '2015-07-27', 'Electronic');
SET @song_omen_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Magnets', @artist_19_id, '2015-09-23', 'Electronic');
SET @song_magnets_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('WhiteNoise', @artist_19_id, '2013-02-01', 'Electronic');
SET @song_whitenoise_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Talk', @artist_19_id, '2019-05-10', 'Electronic');
SET @song_talk_id := LAST_INSERT_ID();

-- Songs by Lorde
INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Royals', @artist_20_id, '2013-06-03', 'Alt-Pop');
SET @song_royals_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Team', @artist_20_id, '2013-09-10', 'Alt-Pop');
SET @song_team_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Green Light', @artist_20_id, '2017-03-02', 'Alt-Pop');
SET @song_greenlight_id := LAST_INSERT_ID();

INSERT INTO SONG (name, artist_id, release_date, genre)
VALUES ('Ribs', @artist_20_id, '2013-06-03', 'Alt-Pop');
SET @song_ribs_id := LAST_INSERT_ID();

-- New Playlists
INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Morning Flow', 3, @user_3_id);
SET @playlist_4_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Late Night Neon', 3, @user_4_id);
SET @playlist_5_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Acoustic Sun', 2, @user_5_id);
SET @playlist_6_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Global Grooves', 4, @user_6_id);
SET @playlist_7_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Indie Pulse', 3, @user_7_id);
SET @playlist_8_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Electric Run', 3, @user_8_id);
SET @playlist_9_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Soul Soiree', 2, @user_3_id);
SET @playlist_10_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('HipHop Heat', 3, @user_4_id);
SET @playlist_11_id := LAST_INSERT_ID();

INSERT INTO PLAYLIST (name, number_of_likes, uploader_id)
VALUES ('Chillwave Mix', 4, @user_6_id);
SET @playlist_12_id := LAST_INSERT_ID();

-- Likes for new playlists
INSERT INTO PLAYLIST_LIKES (playlist_id, user_id) VALUES
(@playlist_4_id, @user_1_id),
(@playlist_4_id, @user_3_id),
(@playlist_4_id, @user_5_id),
(@playlist_5_id, @user_2_id),
(@playlist_5_id, @user_4_id),
(@playlist_5_id, @user_7_id),
(@playlist_6_id, @user_3_id),
(@playlist_6_id, @user_6_id),
(@playlist_7_id, @user_4_id),
(@playlist_7_id, @user_5_id),
(@playlist_7_id, @user_6_id),
(@playlist_7_id, @user_8_id),
(@playlist_8_id, @user_2_id),
(@playlist_8_id, @user_3_id),
(@playlist_8_id, @user_7_id),
(@playlist_9_id, @user_1_id),
(@playlist_9_id, @user_5_id),
(@playlist_9_id, @user_8_id),
(@playlist_10_id, @user_4_id),
(@playlist_10_id, @user_6_id),
(@playlist_11_id, @user_1_id),
(@playlist_11_id, @user_4_id),
(@playlist_11_id, @user_8_id),
(@playlist_12_id, @user_3_id),
(@playlist_12_id, @user_5_id),
(@playlist_12_id, @user_7_id),
(@playlist_12_id, @user_8_id);

-- References to existing songs for playlist population
SET @song_inmyfeel_id := (SELECT song_id FROM SONG WHERE name = 'In My Feel' AND artist_id = @artist_8_id);
SET @song_levitating_id := (SELECT song_id FROM SONG WHERE name = 'Levitating' AND artist_id = @artist_11_id);
SET @song_adventure_id := (SELECT song_id FROM SONG WHERE name = 'Adventure' AND artist_id = @artist_12_id);
SET @song_love_id := (SELECT song_id FROM SONG WHERE name = 'Love' AND artist_id = @artist_14_id);
SET @song_humble_id := (SELECT song_id FROM SONG WHERE name = 'Humble' AND artist_id = @artist_14_id);
SET @song_dna_id := (SELECT song_id FROM SONG WHERE name = 'DNA' AND artist_id = @artist_14_id);
SET @song_godsplan_id := (SELECT song_id FROM SONG WHERE name = 'Gods Plan' AND artist_id = @artist_8_id);
SET @song_notafraid_id := (SELECT song_id FROM SONG WHERE name = 'Not Afraid' AND artist_id = @artist_9_id);
SET @song_oceaneyes_id := (SELECT song_id FROM SONG WHERE name = 'Ocean Eyes' AND artist_id = @artist_5_id);

-- Songs for new playlists
-- Morning Flow
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_4_id, @song_colors_id),
(@playlist_4_id, @song_letithappen_id),
(@playlist_4_id, @song_saymyname_id);

-- Late Night Neon
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_5_id, @song_gasoline_id),
(@playlist_5_id, @song_realiti_id),
(@playlist_5_id, @song_whitenoise_id),
(@playlist_5_id, @song_inmyfeel_id);

-- Acoustic Sun
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_6_id, @song_patience_id),
(@playlist_6_id, @song_ghost_id),
(@playlist_6_id, @song_ribs_id);

-- Global Grooves
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_7_id, @song_amoment_id),
(@playlist_7_id, @song_magnets_id),
(@playlist_7_id, @song_royals_id),
(@playlist_7_id, @song_levitating_id);

-- Indie Pulse
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_8_id, @song_oblivion_id),
(@playlist_8_id, @song_elephant_id),
(@playlist_8_id, @song_team_id),
(@playlist_8_id, @song_adventure_id);

-- Electric Run
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_9_id, @song_lineofsight_id),
(@playlist_9_id, @song_talk_id),
(@playlist_9_id, @song_greenlight_id),
(@playlist_9_id, @song_7_id);

-- Soul Soiree
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_10_id, @song_control_id),
(@playlist_10_id, @song_latch_id),
(@playlist_10_id, @song_love_id);

-- HipHop Heat
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_11_id, @song_humble_id),
(@playlist_11_id, @song_dna_id),
(@playlist_11_id, @song_godsplan_id),
(@playlist_11_id, @song_notafraid_id);

-- Chillwave Mix
INSERT INTO PLAYLIST_SONGS (playlist_id, song_id) VALUES
(@playlist_12_id, @song_acrossroom_id),
(@playlist_12_id, @song_genesis_id),
(@playlist_12_id, @song_saymyname_id),
(@playlist_12_id, @song_oceaneyes_id);

-- Functions