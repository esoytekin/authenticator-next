const { ApolloClient, InMemoryCache } = require('@apollo/client');

export default new ApolloClient({
    uri:
        process.env.APOLLO_CLIENT_GRAPHQL_URI ||
        'http://localhost:3000/api/graphql',
    cache: new InMemoryCache(),
});
