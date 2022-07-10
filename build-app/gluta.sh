#!/bin/sh
cd ../
npm run pack
sleep 2

cd ./build-app
# colors n shit
red='\033[0;31m'
green='\033[0;32m'
white='\033[0;37m'
noclr='\033[0m' # noclr

# remove mac restrictions
src=../dist/mac-arm64

codesign --force --deep --sign - $src/Gluta.app
xattr -cr $src/Gluta.app 
echo "${green}Successfully removed restrictions from ${white}Gluta.app"

file=./Gluta-.*
if [[ -e "$file" ]]; then
    rm $file
fi

# script to create dmg
version=$(grep -o '"version": "[^"]*' ../package.json | grep -o '[^"]*$')
echo "${green}Creating DMG for ${red}Gluta ${white}v$version"

create-dmg \
    --volname "Gluta-$version" \
    --volicon ".././assets/icon.icns" \
    --background "background.png" \
    --window-pos 540 360 \
    --window-size 540 370 \
    --text-size 16 \
    --icon-size 80 \
    --icon "Gluta.app" 130 230 \
    --hide-extension "Gluta.app" \
    --app-drop-link 411 230 \
    "Gluta-$version.dmg" \
    "$src"