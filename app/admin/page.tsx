import { getServerSession } from 'next-auth';
import { authOptions } from '../api/[...nextauth]/route';

import { prisma } from '@/lib/prisma';
