#!/bin/bash

rm -r eEntry
mkdir eEntry
cp package.json eEntry
cp package-lock.json eEntry

cp -r node_modules eEntry

# TYPES
mkdir -p eEntry/types/dist
cp types/package.json eEntry/types
cp -r types/dist/* eEntry/types/dist

# SERVER
mkdir -p eEntry/server/dist
cp server/package.json eEntry/server
cp -r server/dist/* eEntry/server/dist

# WEB
mkdir -p eEntry/web/dist
cp web/package.json eEntry/web
cp -r web/dist/* eEntry/web/dist
