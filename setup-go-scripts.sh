#!/bin/bash
# ================================================================
# File: setup-go-scripts.sh
# Description: Setup script to make go scripts executable
# Project: EasyJoyLife
# ================================================================

echo "Setting up Go scripts..."

# Make all go scripts executable
chmod +x go.sh
chmod +x go.lib.sh
chmod +x go.0.sh
chmod +x go.1.sh
chmod +x go.2.sh
chmod +x go.3.sh

echo "✅ All go scripts are now executable"
echo ""
echo "You can now run:"
echo "  ./go.sh     - Interactive menu"
echo "  ./go.sh 0   - Start local development"
echo "  ./go.sh 1   - Deploy to server"
echo "  ./go.sh 2   - Build backend"
echo "  ./go.sh 3   - Clean cache"
