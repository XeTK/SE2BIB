#!/bin/bash

# Author Tom Rosier (XeTK)

# Directories
RESOURCES_PATH="."
CSS_PATH="$RESOURCES_PATH/css"

# CSS Stuff
BS_CSS_PATH="$CSS_PATH/bootstrap.css"
BS_MIN_CSS_PATH="$CSS_PATH/bootstrap.min.css"

# Choose the boot Swatch Theme that you want to use.
BS_THEME="superhero"

BS_CSS_URL="http://bootswatch.com/$BS_THEME/bootstrap.css"
BS_MIN_CSS_URL="http://bootswatch.com/$BS_THEME/bootstrap.min.css"

if ! type "wget" >/dev/null
then
	echo "Please ensure wget is installed!"
	exit 0
fi

# See if Dirs exist.
if [ ! -d $RESOURCES_PATH ] 
then
	echo "Creating $RESOURCES_PATH dir!"
	mkdir $RESOURCES_PATH
else
	echo "$RESOURCES_PATH dir already exists!"
fi

if [ ! -d $CSS_PATH ]
then
	echo "Creating $CSS_PATH dir!"
	mkdir $CSS_PATH
else 
	echo "$CSS_PATH dir already exists!"
fi

if [ ! -f $BS_CSS_PATH ]
then
	echo "Downloading CSS"
	wget -O $BS_CSS_PATH $BS_CSS_URL
else
	echo "CSS Already exists"
fi

if [ ! -f $BS_MIN_CSS_PATH ]
then
	echo "Downloading min CSS"
	wget -O $BS_MIN_CSS_PATH $BS_MIN_CSS_URL
else
	echo "Min CSS Already exists"
fi


if ! type "bower" >/dev/null
then
	if type "node" >/dev/null &&  type "npm" >/dev/null && type "git" >/dev/null
	then
		echo "Installing Bower"
		sudo npm install -g bower
	else
		echo "Bower dependancies not installed, please check that node.js, npm and git are installed."
		exit 0
	fi
else
	echo "Bower already installed"
fi

bower install
