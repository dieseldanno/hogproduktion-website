import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash('admin123', 10);

  await prisma.account.upsert({
    where: { email: 'admin@hogproduktion.se' },
    update: { password: hashed },
    create: {
      email: 'admin@hogproduktion.se',
      password: hashed,
      name: 'Danno',
      role: 'admin',
    },
  });

  console.log('Admin skapad – lösenord: admin123');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
