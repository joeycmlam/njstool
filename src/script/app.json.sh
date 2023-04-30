#!/bin/bash

# Check if ts-node is installed
if ! command -v ts-node &> /dev/null
then
  echo "ts-node could not be found. Please install it as a dev dependency."
  exit 1
fi

# Run the TypeScript file
ts-node src/app/app-json/app.json.ts
