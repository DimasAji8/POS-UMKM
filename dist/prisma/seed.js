"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new client_1.PrismaClient();
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
//# sourceMappingURL=seed.js.map