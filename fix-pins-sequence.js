const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        // 1. Get the max ID from the Pin table
        const maxIdResult = await prisma.pin.aggregate({
            _max: { id: true }
        });
        const maxId = maxIdResult._max.id || 0;
        console.log('Current max ID:', maxId);

        // 2. Reset the sequence for Postgres (Neon)
        // We increment maxId by 1 to set the start value for the next insert
        await prisma.$executeRawUnsafe(`SELECT setval('"Pin_id_seq"', ${maxId})`);

        console.log(`Successfully reset Pin_id_seq to ${maxId}`);

        // Verify
        const verify = await prisma.$queryRaw`SELECT last_value FROM "Pin_id_seq"`;
        console.log('New sequence value:', verify);

    } catch (error) {
        console.error('Fix failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
