CREATE DATABASE number_guess OWNER freecodecamp;

\c number_guess
SET ROLE freecodecamp;

CREATE TABLE users(
	user_id SERIAL PRIMARY KEY,
	name VARCHAR(20) NOT NULL
);

CREATE TABLE games(
  game_id SERIAL PRIMARY KEY, 
	user_id INTEGER NOT NULL,
	CONSTRAINT fk_user_id
		FOREIGN KEY(user_id)  
		REFERENCES users(user_id)
		ON DELETE NO ACTION,  
  number_to_guess INTEGER NOT NULL,
  guesses INTEGER NOT NULL
);
