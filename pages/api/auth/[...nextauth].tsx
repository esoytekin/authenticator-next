import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { query } from '.keystone/api';
import { gql } from '@apollo/client';
import axios from 'axios';
import client from '../../../apollo-client';

const AUTH_USER = gql`
    mutation Auth($email: String!, $password: String!) {
        authenticateUserWithPassword(email: $email, password: $password) {
            ... on UserAuthenticationWithPasswordSuccess {
                item {
                    id
                }
            }
            ... on UserAuthenticationWithPasswordFailure {
                message
            }
        }
    }
`;


async function refreshAccessToken(tokenObject: any) {
    try {
        // Get a new set of tokens with a refreshToken
        const tokenResponse = await axios.post('/auth/refreshToken', {
            token: tokenObject.refreshToken
        });

        return {
            ...tokenObject,
            accessToken: tokenResponse.data.accessToken,
            accessTokenExpiry: tokenResponse.data.accessTokenExpiry,
            refreshToken: tokenResponse.data.refreshToken
        }
    } catch (error) {
        return {
            ...tokenObject,
            error: "RefreshAccessTokenError",
        }
    }
}

export default NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            name: 'Sign in with...',
            credentials: {
                email: {
                    type: 'email',
                },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                const {
                    data: { authenticateUserWithPassword },
                } = await client.mutate({
                    mutation: AUTH_USER,
                    variables: credentials,
                });

                if (authenticateUserWithPassword.message) {
                    throw new Error(authenticateUserWithPassword.message);
                }

                const {
                    item: { id },
                } = authenticateUserWithPassword;

                const u = await query.User.findOne({
                    where: {
                        id,
                    },
                    query: 'id email',
                });

                return u;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user, account, profile }) {
             // Initial sign in

              if (account && user) {
                return {
                  accessToken: account.access_token,
                  accessTokenExpires: Date.now() + ( account as any ).expires_at * 1000,
                  refreshToken: account.refresh_token,
                  user,
                }
              }

              // Return previous token if the access token has not expired yet
              if (Date.now() < ( token as any ).exp) {
                return token
              }

              // Access token has expired, try to update it
              console.log('access token is expired need to update');
              return token
        },
        session({ session, user, token  }){
            return {...session, user: ( token as any ).user}
        }
    },
});
