#!/bin/bash

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
  echo "Creating .env.local from .env.example..."
  if [ -f .env.example ]; then
    cp .env.example .env.local
  else
    echo "APP_URL=\"http://localhost:3000\"" > .env.local
    echo "DATABASE_URL=\"postgresql://postgres:postgres@localhost:5432/postgres\"" >> .env.local
    echo "AUTH_SECRET=\"$(openssl rand -base64 32)\"" >> .env.local
  fi
  echo ".env.local created. Please update it with your Google OAuth credentials."
fi

# Start the database container
echo "Starting PostgreSQL container..."
docker compose up -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
until docker exec ngantriwoy-db pg_isready -U user -d antrian_db; do
  sleep 1
done

echo "Database is ready!"

# Run drizzle-kit push to sync schema
echo "Syncing database schema..."
bun run db:push

echo "Setup complete! You can now run 'npm run dev' to start the application."
