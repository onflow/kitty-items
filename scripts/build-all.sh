#!/bin/bash

npx lerna exec npm install --scope api --scope web
npx lerna exec npm run build --scope api --scope web
