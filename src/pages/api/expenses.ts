import { NextApiRequest, NextApiResponse } from 'next';

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
    }
}