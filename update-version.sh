#!/bin/bash

# Check if a version number is passed
if [ -z "$1" ]; then
  echo "Please provide a version number. Usage: sh update-version.sh <version>"
  exit 1
fi

NEW_VERSION=$1

# Update version in package.json files
files_to_update=(
  "package.json"
  "apps/webpage/package.json"
  "apps/extension/package.json"
  "apps/backend/package.json"
)

for file in "${files_to_update[@]}"; do
  if [ -f "$file" ]; then
    # Use jq to safely update the version in JSON files
    jq --arg new_version "$NEW_VERSION" '.version = $new_version' "$file" > tmp.json && mv tmp.json "$file"
    echo "Updated $file -> $NEW_VERSION"
  else
    echo "$file does not exist."
  fi
done

# Update version in manifest-chrome.ts
sed -i '' "s/version: '[0-9]*\.[0-9]*\.[0-9]*'/version: '$NEW_VERSION'/" apps/extension/manifest-chrome.ts
echo "Updated apps/extension/manifest-chrome.ts -> $NEW_VERSION"

# Update version in manifest-firefox.ts
sed -i '' "s/version: '[0-9]*\.[0-9]*\.[0-9]*'/version: '$NEW_VERSION'/" apps/extension/manifest-firefox.ts
echo "Updated apps/extension/manifest-firefox.ts -> $NEW_VERSION"

# Update version in manifest-web.ts
sed -i '' "s/version: '[0-9]*\.[0-9]*\.[0-9]*'/version: '$NEW_VERSION'/" apps/webpage/src/manifest-web.ts
echo "Updated apps/webpage/src/manifest-web.ts -> $NEW_VERSION"

# Update version in apps/backend/src/getVersion.ts
sed -i '' "s/return '[0-9]*\.[0-9]*\.[0-9]*'/return '$NEW_VERSION'/" apps/backend/src/getVersion.ts
echo "Updated apps/backend/src/getVersion.ts -> $NEW_VERSION"

# Update marketing version in project.pbxproj
sed -i '' "s/MARKETING_VERSION = [0-9]*\.[0-9]*\.[0-9]*/MARKETING_VERSION = $NEW_VERSION/" native/app_ios/wtm/wtm.xcodeproj/project.pbxproj
echo "Updated native/app_ios/wtm/wtm.xcodeproj/project.pbxproj -> $NEW_VERSION"


echo "Version updated to $NEW_VERSION in all files."
