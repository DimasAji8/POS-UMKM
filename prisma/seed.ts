import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashKataSandi = await bcrypt.hash('admin123', 10);
  
  await prisma.pengguna.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      nama: 'Administrator',
      username: 'admin',
      hashKataSandi,
      role: 'ADMIN',
    },
  });

  console.log('Seed selesai');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
