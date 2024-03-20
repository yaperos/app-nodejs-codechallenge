#!/bin/bash

# Change to the Prisma project directory
change_dir() {
  cd "./apps/$1/"

  echo "Changing directory to apps/$1/"

  npx prisma migrate dev 

  echo "Running prisma migrate"
}

change_dir "financial-tracking"