#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=number_guess -t --no-align -c"

NUMBER=`echo $((1 + $RANDOM % 1000))`

echo "Enter your username:"
read USERNAME

USER_ID=$($PSQL "SELECT user_id FROM users WHERE name = '$USERNAME'")

# if not available
if [[ -z $USER_ID ]];
then
  # send to main menu
  echo -e "Welcome, $USERNAME! It looks like this is your first time here."
  INSERT_USER=$($PSQL "INSERT INTO users(name) VALUES ('$USERNAME')")
  USER_ID=$($PSQL "SELECT user_id FROM users WHERE name = '$USERNAME'")
else
  USER_GAMES=$($PSQL "SELECT count(game_id) FROM games WHERE user_id = $USER_ID")
  BEST_GAME=$($PSQL "SELECT min(guesses) FROM games WHERE user_id = $USER_ID")

  echo -e "Welcome back, $USERNAME! You have played $USER_GAMES games, and your best game took $BEST_GAME guesses."
fi

echo -e "Guess the secret number between 1 and 1000:"

GUESS_COUNT=0

while true
do
	read USER_GUESS
  GUESS_COUNT=$((GUESS_COUNT+1))
  #if integer
  case $USER_GUESS in
    [0-9]*)
      # get element by atomic number
      #ELEMENT=$($PSQL "SELECT atomic_number, symbol, name FROM elements WHERE atomic_number='$1'")
      # check guess
      if [[ "$USER_GUESS" -gt "$NUMBER" ]];
      then
        echo -e "It's higher than that, guess again:"
      elif [[ "$USER_GUESS" -lt "$NUMBER" ]];
      then
        echo -e "It's lower than that, guess again:"
      elif [[ "$USER_GUESS" -eq "$NUMBER" ]];
      then
        echo -e "You guessed it in $GUESS_COUNT tries. The secret number was $NUMBER. Nice job!"
        INSERT_GAME=$($PSQL "INSERT INTO games(user_id, number_to_guess, guesses) VALUES ($USER_ID, $NUMBER, $GUESS_COUNT)")
        break
      fi
      ;;
      *)
        echo -e "That is not an integer, guess again:"
    esac  
done