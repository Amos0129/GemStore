#!/bin/sh

echo "🔄 Waiting for database..."

# 簡單等待資料庫連線
while ! pg_isready -h database -p 5432 -U crystal_user > /dev/null 2>&1; do
  echo "⏳ Database not ready yet, waiting..."
  sleep 2
done

echo "✅ Database is ready!"

echo "🚀 Running database migrations..."
npx prisma db push --skip-generate || echo "⚠️ Migration failed"

echo "🌱 Seeding database..."
if [ -f "prisma/seed.js" ]; then
  npx prisma db seed --skip-generate || echo "⚠️ Seeding failed or already done"
else
  echo "ℹ️ No seed file found, skipping seeding"
fi

echo "✅ Database setup complete!"
echo "🚀 Starting application..."

# 執行傳入的命令
exec "$@"