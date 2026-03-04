#!/bin/sh
# Replace the build-time placeholder with the runtime environment variable.
# This allows NEXT_PUBLIC_API_URL to be set in docker-compose.yml or via -e.
find /app -type f \( -name "*.js" -o -name "*.html" -o -name "*.json" \) \
  -exec sed -i "s|__NEXT_PUBLIC_API_URL__|${NEXT_PUBLIC_API_URL}|g" {} +

exec node server.js
