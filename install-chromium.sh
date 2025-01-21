#!/bin/bash
echo "Updating package lists..."
apt-get update

echo "Installing Chromium..."
apt-get install -y chromium-browser

echo "Chromium installed successfully!"
