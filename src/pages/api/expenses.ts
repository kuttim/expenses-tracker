import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


interface ExpenseInput {
    title: string;
    description: string;
    amount: number;
    date: string;
    category: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, amount, date, category } = req.body as ExpenseInput;

    const expense = await prisma.expense.create({
      data: {
        title,
        description,
        amount,
        date: new Date(date),
        category,
      },
    });

    res.status(201).json(expense);
  } else if (req.method === 'DELETE') {
    const id = Number(req.query.id);

    await prisma.expense.delete({
      where: {
        id,
      },
    });

    res.status(204).end();
  }
}

