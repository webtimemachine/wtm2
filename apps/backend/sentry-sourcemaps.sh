#!/bin/sh

# Load environment variables from .env file
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Check if SENTRY_AUTH_TOKEN is set
if [ -n "$SENTRY_AUTH_TOKEN" ]; then
  sentry-cli sourcemaps inject --org webtimemachinedev --project wtm-back ./dist
  sentry-cli sourcemaps upload --org webtimemachinedev --project wtm-back ./dist
else
  echo "SENTRY_AUTH_TOKEN is not set"
fi
