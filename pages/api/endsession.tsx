import { gql } from '@apollo/client';
import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';
import client from '../../apollo-client';

const END_SESSION = gql`
    mutation {
        endSession
    }
`;

export default nextConnect<NextApiRequest, NextApiResponse>({}).post(
    async (req, res) => {
        const response = await client.mutate({
            mutation: END_SESSION,
        });

        console.log('end session', response);

        res.status(200).end();
    }
);
