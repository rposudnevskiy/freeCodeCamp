#!/bin/bash

PSQL="psql --username=freecodecamp --dbname=periodic_table -t --no-align -c"

if [ "$#" -eq  "0" ];
  then
    echo "Please provide an element as an argument."
  else
    #if exist
    case $1 in
      [0-9]*)
        # get element by atomic number
        ELEMENT=$($PSQL "SELECT atomic_number, symbol, name FROM elements WHERE atomic_number='$1'")
        ;;
      [a-zA-Z]|[a-zA-Z][a-zA-Z])
        # get element by symbol
        ELEMENT=$($PSQL "SELECT atomic_number, symbol, name FROM elements WHERE symbol='$1'")
        ;;
      [a-zA-Z]*)
        # get element by atomic number
        ELEMENT=$($PSQL "SELECT atomic_number, symbol, name FROM elements WHERE name='$1'")
        ;;
      *)
        echo "I could not find that element in the database."
    esac
    # if element not found
    if [[ -z $ELEMENT ]];
      then
        echo "I could not find that element in the database."
      else
        elArray=(${ELEMENT//|/ })
        PROPERTIES=$($PSQL "SELECT t.type, p.atomic_mass, p.melting_point_celsius, p.boiling_point_celsius FROM properties p, types t WHERE p.atomic_number='${elArray[0]}' and p.type_id=t.type_id")
        propArray=(${PROPERTIES//|/ })
        echo "The element with atomic number ${elArray[0]} is ${elArray[2]} (${elArray[1]}). It's a ${propArray[0]}, with a mass of ${propArray[1]} amu. ${elArray[2]} has a melting point of ${propArray[2]} celsius and a boiling point of ${propArray[3]} celsius."
    fi
fi
