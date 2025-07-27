#!/bin/bash

set -e  # Exit if any command fails

APP_DIR="/home/ubuntu/smarty"

# Navigate to app directory
cd "$APP_DIR"

# Install only production dependencies
npm install --production

# Build the Next.js app
npm run build

# Install PM2 globally if not present
if ! command -v pm2 &> /dev/null
then
    npm install -g pm2
fi

# Restart if exists, else start
pm2 describe smarty > /dev/null
if [ $? -eq 0 ]; then
  pm2 restart smarty
else
  pm2 start npm --name "smarty" -- start
fi

# Optional: Save PM2 process list and resurrect on reboot
pm2 save
pm2 startup systemd -u ubuntu --hp /home/ubuntu
