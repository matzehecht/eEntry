#!/bin/bash

out.zip
zip -r out.zip package.json package-lock.json node_modules types/package.json types/dist package.json server/dist package.json web/dist
