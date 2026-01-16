#!/bin/bash

# ============================================
# Setup Script untuk Backend Kasir UMKM di VPS
# ============================================

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PM2
sudo npm install -g pm2

# 4. Install Nginx
sudo apt install -y nginx

# 5. Install Certbot untuk SSL
sudo apt install -y certbot python3-certbot-nginx

# 6. Clone repository (ganti dengan repo Anda)
cd ~
git clone <URL_REPO_ANDA> kasir-umkm
cd kasir-umkm/POS-UMKM

# 7. Install dependencies
npm install

# 8. Setup environment variables
cat > .env << 'EOF'
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
EOF

# 9. Generate Prisma client & migrate
npx prisma generate
npx prisma migrate deploy

# 10. Build aplikasi
npm run build

# 11. Start dengan PM2
pm2 start dist/main.js --name kasir-api
pm2 save
pm2 startup

echo "Backend sudah berjalan di port 3000"
echo "Selanjutnya setup Nginx untuk reverse proxy"
