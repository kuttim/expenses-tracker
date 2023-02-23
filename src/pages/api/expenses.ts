import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from '@prisma/client';
import { getSession } from "next-auth/react";


const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send("Unauthorized");
    }

    if (req.method === "POST") {
      const { title, description, amount, date, category } = req.body;

      if (!title || !amount || !date || !category) {
        return res
          .status(400)
          .send("Title, amount, date, and category are required");
      }

      const result = await prisma.expense.create({
        data: {
          title,
          description,
          amount,
          date,
          category,
          user: { connect: { id: session?.user?.email } },
        },
      });

      res.json(result);
    } else if (req.method === "DELETE") {
      const id = parseInt(req.query.id as string);

      const expense = await prisma.expense.findUnique({
        where: { id },
      });

      if (!expense) {
        return res.status(404).send("Expense not found");
      }

      if (expense.email !== session?.user?.email) {
        return res.status(401).send("Unauthorized");
      }

      const result = await prisma.expense.delete({
        where: { id },
      });

      res.json(result);
    } else {
      res.status(405).send("Method not allowed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
}
