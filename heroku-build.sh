#!/bin/bash

npm install --prefix web
npm install --prefix api 
npm run build --prefix web
npm run build --prefix api
