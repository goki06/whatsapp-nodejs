#!/bin/bash
echo "Updating package lists..."
apt-get update -y

echo "Installing Chromium..."
apt-get install -y chromium-browser

echo "Chromium installed successfully!"
chromium-browser --version
