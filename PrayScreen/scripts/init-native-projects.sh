#!/bin/bash

# Script to initialize iOS and Android native projects for PrayScreen
# This script creates a temporary React Native project and copies the native folders

set -e

echo "🚀 Initializing PrayScreen Native Projects..."
echo ""

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TEMP_DIR="/tmp/prayscreen-temp-$$"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0;m' # No Color

echo -e "${BLUE}Step 1: Creating temporary React Native project...${NC}"
mkdir -p "$TEMP_DIR"
cd "$TEMP_DIR"

# Create a temporary RN project with the same version
npx react-native init TempPrayScreen --version 0.76.3 --skip-install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to create temporary project${NC}"
    echo "Please ensure you have internet connection and try again"
    exit 1
fi

echo -e "${GREEN}✅ Temporary project created${NC}"
echo ""

echo -e "${BLUE}Step 2: Copying iOS project...${NC}"
# Remove existing iOS folder if any
rm -rf "$PROJECT_ROOT/ios"
# Copy iOS folder
cp -R "$TEMP_DIR/TempPrayScreen/ios" "$PROJECT_ROOT/"

# Customize iOS project
echo -e "${BLUE}Step 3: Customizing iOS project for PrayScreen...${NC}"
cd "$PROJECT_ROOT/ios"

# Replace all instances of TempPrayScreen with PrayScreen
find . -type f -name "*.h" -o -name "*.m" -o -name "*.mm" | xargs sed -i '' 's/TempPrayScreen/PrayScreen/g'
find . -type f -name "*.pbxproj" | xargs sed -i '' 's/TempPrayScreen/PrayScreen/g'

# Rename directories
if [ -d "TempPrayScreen" ]; then
    mv TempPrayScreen PrayScreen
fi

if [ -d "TempPrayScreen.xcodeproj" ]; then
    mv TempPrayScreen.xcodeproj PrayScreen.xcodeproj
fi

if [ -d "TempPrayScreen.xcworkspace" ]; then
    mv TempPrayScreen.xcworkspace PrayScreen.xcworkspace
fi

if [ -d "TempPrayScreenTests" ]; then
    mv TempPrayScreenTests PrayScreenTests
fi

echo -e "${GREEN}✅ iOS project configured${NC}"
echo ""

echo -e "${BLUE}Step 4: Copying Android project...${NC}"
# Remove existing Android folder if any
rm -rf "$PROJECT_ROOT/android"
# Copy Android folder
cp -R "$TEMP_DIR/TempPrayScreen/android" "$PROJECT_ROOT/"

# Customize Android project
echo -e "${BLUE}Step 5: Customizing Android project for PrayScreen...${NC}"
cd "$PROJECT_ROOT/android"

# Replace package name and app name
find . -type f \( -name "*.gradle" -o -name "*.xml" -o -name "*.java" -o -name "*.kt" \) -exec sed -i '' 's/TempPrayScreen/PrayScreen/g' {} \;
find . -type f \( -name "*.gradle" -o -name "*.xml" -o -name "*.java" -o -name "*.kt" \) -exec sed -i '' 's/tempprayscreen/prayscreen/g' {} \;

# Rename Java/Kotlin package directories if needed
find . -type d -name "tempprayscreen" | while read dir; do
    mv "$dir" "$(dirname "$dir")/prayscreen"
done

echo -e "${GREEN}✅ Android project configured${NC}"
echo ""

echo -e "${BLUE}Step 6: Cleaning up temporary files...${NC}"
rm -rf "$TEMP_DIR"
echo -e "${GREEN}✅ Cleanup complete${NC}"
echo ""

echo -e "${GREEN}🎉 Native projects initialized successfully!${NC}"
echo ""
echo "Next steps:"
echo "1. iOS: cd ios && pod install"
echo "2. Run iOS: npm run ios"
echo "3. Run Android: npm run android"
echo ""
