import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

process.on('SIGNT', async () => {
    await prisma.$disconnect();
    console.log('Prisma disconnected');
    process.exit(0);
});

export default prisma;