import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
// import { getToken } from 'next-auth/jwt';
import nextConnect from 'next-connect';
import { gql } from '@apollo/client';
import client from '../../../apollo-client';
import { query } from '.keystone/api';
import SecretModel from '../../../model/secret.model';
import checkAuth from '../../../lib/checkAuth';

const getUserTokens = gql`
    query getUserTokens($userID: ID!) {
        secrets(where: { owner: { id: { equals: $userID } } }) {
            id
            site
            key
        }
    }
`;

const SAVE_SECRET = gql`
    mutation createSecret($site: String!, $key: String!, $owner: ID) {
        createSecret(
            data: { site: $site, key: $key, owner: { connect: { id: $owner } } }
        ) {
            id
        }
    }
`;

const secret = process.env.NEXTAUTH_SECRET;

export default nextConnect<NextApiRequest, NextApiResponse>({})
    .use(checkAuth)
    .get(async (req, res) => {
        const session = await getSession({ req });
        //const token = await getToken({ req, secret });

        if (!session) {
            res.status(401).json({ message: 'user not authenticated' });
            return;
        }

        const { user } = session;

        const { id } = user as any;

        const secrets = await query.Secret.findMany({
            where: {
                owner: {
                    id: {
                        equals: id,
                    },
                },
            },
            query: 'id site key',
        });

        res.status(200).json(secrets);
    })
    .post(async (req, res) => {
        const item: SecretModel = req.body;

        const session = await getSession({ req });

        if (!session) {
            res.status(401).json({ message: 'user not authenticated' });
            return;
        }

        const { user } = session;

        const { id } = user as any;

        const response = await client.mutate({
            mutation: SAVE_SECRET,
            variables: {
                ...item,
                owner: id,
            },
        });

        res.status(200).json({ id: response.data.createSecret.id });
    });
