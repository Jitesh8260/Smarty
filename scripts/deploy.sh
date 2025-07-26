#!/bin/bash
cd /home/ubuntu/smarty
npm install --production
npm run build
pm2 restart all || pm2 start npm --name "smarty" -- start
