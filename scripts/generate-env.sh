#!/bin/sh

# Generate __ENV.js for next-runtime-env
# This allows runtime environment variables in Next.js

cat > /app/public/__ENV.js << EOF
window.__ENV = {
  NEXT_PUBLIC_API_URL: "${NEXT_PUBLIC_API_URL:-http://localhost:8200}"
};
EOF

echo "✅ Generated /app/public/__ENV.js with NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}"

# Start the Next.js application
exec "$@"
