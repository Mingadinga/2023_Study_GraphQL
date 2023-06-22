import { ApolloServer, gql } from "apollo-server";

// gql : graphql schema definition language
// Query : 필수 타입. 사용자가 request할 수 있는 모든 것은 type query 안에 있어야함
// Query 타입 안의 필드는 마치 REST GET과 같다
const typeDefs = gql`
  type User {
    id: ID
    username: String
  }
  type Tweet {
    id: ID
    text: String
    author: User
  }
  type Query {
    allTweets: [Tweet!]!
    tweet(id: ID!): Tweet!
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    deleteTweet(id: ID): Boolean
  }
`;

const server = new ApolloServer({typeDefs})

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});