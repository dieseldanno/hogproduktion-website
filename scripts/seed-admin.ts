import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);
  await prisma.account.upsert({
    where: { email: 'admin@hogproduktion.se' },
    update: {},
    create: {
      email: 'admin@hogproduktion.se',
      password: hashed,
      name: 'Admin User',
    },
  });
  console.log('Admin user seeded');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
