#!/bin/bash

# receive the project name as the first argument
PROJECT_NAME=$1

# check if the pc is connected to the internet
echo "[build script] - Checking internet connection..."
ping -c 1 google.com > /dev/null 2>&1 || (echo "No internet connection" && exit 1)
echo "[build script] - Internet connection is available"

# check if the project name is provided
if [ -z "$PROJECT_NAME" ]
then
	echo "[build script] - Project name is not provided"
	exit 1
fi

# check if pc has npm installed or not.
echo "[build script] - Checking if npm is installed..."
npm -v > /dev/null 2>&1 || (echo "npm is not installed" && exit 1)

# check if pc has yarn installed or not, if no try to install it through npm and if it fails exit the script
echo "[build script] - Checking if yarn is installed..."
yarn -v > /dev/null 2>&1 || (echo "yarn is not installed, installing it through npm..." && npm install -g yarn || exit 1)
echo "[build script] - yarn is installed"

# set the current working directory to the project directory
CWD=$(pwd)/$PROJECT_NAME
echo "[build script] - Current working directory set to $CWD"
# bash to build the project
cd $CWD || exit 1

echo "[build script] - Removing the old build for $PROJECT_NAME..."
rm -rf build || exit 1
echo "[build script] - Old build removed for $PROJECT_NAME"

# run "yarn install" to install the dependencies
echo "[build script] - Installing dependencies for $PROJECT_NAME..."
echo "[build script] - Dependencies installed for $PROJECT_NAME"
yarn install || exit 1

echo "[build script] - Building the project $PROJECT_NAME..."

# run "yarn build" to build the project if there is an error, exit the script
yarn build || exit 1

echo "[build script] - Build completed for $PROJECT_NAME"

echo "[build script] - Exiting the build script (some asynchronus tasks may still be running)"