#!/bin/bash

cd /home/ubuntu/smarty
npm install --omit=dev
npm run build
npm install -g pm2
pm2 restart smarty || pm2 start npm --name "smarty" -- start
pm2 save
