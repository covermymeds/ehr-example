#!/bin/sh

# echo "Converting .less to .css"
node_modules/less/bin/lessc assets/stylesheets/main.less > assets/stylesheets/main.css

# Concatenate the project files
node tools/r.js -o build.js

# echo "Optimizing .js source with Closure Compiler"
# java -jar tools/compiler.jar --js build/src/main.js --js_output_file build/src/main-compiled.js

echo "Removing .DS_Store files"
rm -rf `find ./build -type f -name .DS_Store`

echo "Copying to 'dist' folder"
rm -rf dist
mkdir -p dist/src
cp build/src/main.js dist/src/ehr-example.js
cp -R build/assets dist

echo "Removing build directory"
rm -rf build

echo 'Done!'