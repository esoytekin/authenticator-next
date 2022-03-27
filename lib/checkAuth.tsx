import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { NextHandler } from 'next-connect';

export default async function (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextHandler
) {
    const session = await getSession({ req });

    if (!session) {
        res.status(401).json({ message: 'user not authenticated' });
        return;
    }

    next();
}
