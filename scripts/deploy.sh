#!/bin/bash
cd /home/jitesh/smarty
npm install --production
npm run build
npm install -g pm2
pm2 restart all || pm2 start npm --name "smarty" -- start
