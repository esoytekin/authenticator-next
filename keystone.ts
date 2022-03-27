import { createAuth } from '@keystone-6/auth';
import { config, list } from '@keystone-6/core';
import { statelessSessions } from '@keystone-6/core/session';
import {
    checkbox,
    password,
    relationship,
    text,
} from '@keystone-6/core/fields';

const { withAuth } = createAuth({
    // Required options
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',

    // Additional options
    sessionData: 'id email isAdmin',
    initFirstItem: {
        fields: ['email', 'password'],
        itemData: { isAdmin: true },
        skipKeystoneWelcome: false,
    },
    passwordResetLink: {
        sendToken: async ({ itemId, identity, token, context }) => {
            /* ... */
        },
        tokensValidForMins: 60,
    },
    magicAuthLink: {
        sendToken: async ({ itemId, identity, token, context }) => {
            /* ... */
        },
        tokensValidForMins: 60,
    },
});

const lists = {
    User: list({
        fields: {
            email: text({
                validation: {
                    isRequired: true,
                },
                isIndexed: 'unique',
            }),
            password: password({
                validation: {
                    isRequired: true,
                },
            }),
            isAdmin: checkbox(),
            secrets: relationship({ ref: 'Secret', many: true }),
        },
    }),
    Secret: list({
        fields: {
            site: text({
                validation: {
                    isRequired: true,
                },
            }),
            key: text({
                validation: {
                    isRequired: true,
                },
            }),
            owner: relationship({ ref: 'User', many: false }),
        },
    }),
};

const c = config({
    db: {
        provider: 'sqlite',
        url: 'file:./keystone.db',
    },
    lists,
    experimental: {
        generateNextGraphqlAPI: true,
        generateNodeAPI: true,
    },
    session: statelessSessions({
        secret: 'ABCDEFGH1234567887654321AGFEDCBH',
    }),
});

export default withAuth(c);
