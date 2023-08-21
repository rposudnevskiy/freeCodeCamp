CREATE DATABASE worldcup;

\c worldcup

CREATE TABLE teams(
	team_id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE games(
	game_id SERIAL PRIMARY KEY,
	year INT NOT NULL,
	round VARCHAR(50) NOT NULL,
  winner_id INT NOT NULL,
	CONSTRAINT fk_winner_id
		FOREIGN KEY(winner_id)  
		REFERENCES teams(team_id)
		ON DELETE NO ACTION,
  opponent_id INT NOT NULL,
	CONSTRAINT fk_opponent_id
		FOREIGN KEY(opponent_id)
		REFERENCES teams(team_id)
		ON DELETE NO ACTION,
	winner_goals INT NOT NULL,
	opponent_goals INT NOT NULL
);
