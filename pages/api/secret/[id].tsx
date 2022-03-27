import {gql} from '@apollo/client';
import {NextApiRequest, NextApiResponse} from 'next';
import nextConnect from 'next-connect';
import client from '../../../apollo-client';
import checkAuth from '../../../lib/checkAuth';
import SecretModel from '../../../model/secret.model';

const DELETE_SECRET = gql`
    mutation deleteSecret($id: ID!) {
        deleteSecret(where: { id: $id}) {
            id
        }
    }
`

const UPDATE_SECRET = gql`
    mutation updateSecret($id:ID!, $key: String!, $site: String!){
      updateSecret(where: {id:$id}, data: { key: $key, site: $site}) {
        id
        site
        key
      }
    }
`

export default nextConnect<NextApiRequest, NextApiResponse>({})
    .use(checkAuth)
    .delete(async (req, res) => {
        const {id} = req.query;

        await client.mutate({
            mutation: DELETE_SECRET,
            variables: {
                id
            }
        });

        res.status(200).send('');
    })
    .put(async (req, res) => {
        const {id} = req.query;
        const item: SecretModel = req.body;

        await client.mutate({
            mutation: UPDATE_SECRET,
            variables: {
                id,
                key: item.key,
                site: item.site
            }
        })

        res.status(200).json({id})
    })
