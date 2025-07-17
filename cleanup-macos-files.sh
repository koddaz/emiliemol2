#!/bin/bash

# Clean up macOS system files from the project
echo "Cleaning up macOS system files..."

# Remove .DS_Store files
find . -name ".DS_Store" -type f -delete

# Remove resource fork files
find . -name "._*" -type f -delete

# Remove Spotlight index files
find . -name ".Spotlight-V100" -type d -exec rm -rf {} + 2>/dev/null

# Remove Trash folder
find . -name ".Trashes" -type d -exec rm -rf {} + 2>/dev/null

echo "Cleanup complete!"
