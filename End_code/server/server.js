const { ApolloServer } = require('apollo-server');

const schema = require('./graphql/graphqlUserSchema');

const server = new ApolloServer({
    typeDefs: schema.typeDefs,
    resolvers: schema.resolvers
});

server.listen({port: 8000}).then(({url}) => console.log(`Server running at ${url}`));
