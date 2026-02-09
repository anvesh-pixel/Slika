const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const pins = await prisma.pin.findMany({
            orderBy: { id: 'desc' },
            take: 5
        });
        console.log('Latest Pins:', JSON.stringify(pins, null, 2));

        // For Postgres (Neon), we can check and reset the sequence
        const result = await prisma.$queryRaw`SELECT last_value FROM "Pin_id_seq"`;
        console.log('Current sequence value:', result);
    } catch (error) {
        console.error('Diagnostic failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
