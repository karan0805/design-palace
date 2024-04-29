import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import sha256 from 'crypto-js/sha256';

const hashPassword = (password: string) => {
  return sha256(password).toString();
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    await handlePOST(req, res);
  } else {
    res
      .status(400)
      .json(`The HTTP ${req.method} method is not supported at this route.`);
  }
}

async function handlePOST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    } else {
      const newUser = {
        ...req.body,
        password: hashPassword(req.body.password),
      };

      const user = await prisma.user.create({
        data: newUser,
      });

      res.json(user);
    }
  } catch (error) {
    console.error('Error during user creation:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
