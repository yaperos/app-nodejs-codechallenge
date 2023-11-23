
#!/bin/bash

# Define the directory patterns to clean
directories_to_clean=(
  "node_modules"
  "dist"
  "build"
  ".next"
)

# Loop through each pattern and remove the directories
for pattern in "${directories_to_clean[@]}"; do
  echo "Removing directories named $pattern"
  rm -rf $pattern */$pattern */*/$pattern
done

# Clean Yarn cache
yarn cache clean --force

echo "Cleanup completed."
# to allow this file to be executed directly: chmod +x clean.sh
