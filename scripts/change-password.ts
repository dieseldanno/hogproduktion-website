// // scripts/change-password.ts
// import { prisma } from '@/lib/prisma';
// import bcrypt from 'bcryptjs';

// async function main() {
//   const hashed = await bcrypt.hash('newStrongPassword123!', 10);
//   await prisma.account.update({
//     where: { email: 'admin@hogproduktion.se' },
//     data: { password: hashed },
//   });
//   console.log('Password updated!');
// }

// main().finally(() => prisma.$disconnect());
