import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD!, 12);

  await prisma.account.upsert({
    where: { email: 'admin@hogproduktion.se' },
    update: { password: hashed },
    create: {
      email: 'admin@hogproduktion.se',
      password: hashed,
      name: 'Admin',
      role: 'admin',
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
