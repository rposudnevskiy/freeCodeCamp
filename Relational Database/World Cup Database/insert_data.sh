#! /bin/bash

if [[ $1 == "test" ]]
then
  PSQL="psql --username=postgres --dbname=worldcuptest -t --no-align -c"
else
  PSQL="psql --username=freecodecamp --dbname=worldcup -t --no-align -c"
fi

# Do not change code above this line. Use the PSQL variable above to query your database.

echo "~~~ Trancating tables 'games' and 'teams' ~~~"
$PSQL "TRUNCATE TABLE games, teams;" >/dev/null 2>&1

echo "~~~ Loading data into tables 'games' and 'teams' ~~~"

while read -r line
do
  #year,round,winner,opponent,winner_goals,opponent_goals
  year=$(echo $line | cut -f1 -d,)
  round=$(echo $line | cut -f2 -d,)
  winner=$(echo $line | cut -f3 -d,)
  opponent=$(echo $line | cut -f4 -d,)
  winner_goals=$(echo $line | cut -f5 -d,)
  opponent_goals=$(echo $line | cut -f6 -d,)

  echo " => Loading game: $winner : $opponent - $year"

  #INSERT teams
  $PSQL "INSERT INTO teams(name) VALUES ('$winner') ON CONFLICT DO NOTHING;" >/dev/null 2>&1
  $PSQL "INSERT INTO teams(name) VALUES ('$opponent') ON CONFLICT DO NOTHING;" >/dev/null 2>&1
  $PSQL "INSERT INTO games (year, round, winner_id, opponent_id, winner_goals, opponent_goals) SELECT '$year' AS year, '$round' as round, (select team_id from teams where name = '$winner') AS winner_id, (select team_id from teams where name = '$opponent') AS opponent_id, $winner_goals AS winner_goals, $opponent_goals AS opponent_goals;"  >/dev/null 2>&1

done <<< "$(tail -n +2 games.csv)"
