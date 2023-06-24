import { ApolloServer, gql } from "apollo-server";

// fake db
let tweets = [
  {
    id: "1",
    text: "first one!",
    userId: "2",
  },
  {
    id: "2",
    text: "second one",
    userId: "1",
  },
]

let users = [
  {
    id: "1",
    firstName: "nico",
    lastName: "las",
  },
  {
    id: "2",
    firstName: "Elon",
    lastName: "Mask",
  },
];


const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    """
    Is the sum of firstName + lastName
    """
    fullName: String!
  }
  """
  Tweet object represents a resource for a Tweet
  """
  type Tweet {
    id: ID!
    text: String!
    author: User!
  }
  type Query {
    allUsers: [User!]!
    allTweets: [Tweet!]!
    allMovies: [Movie!]!
    tweet(id: ID!): Tweet!
    movie(id: String!): Movie!
    ping: String!
  }
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
    """
    Deletes a Tweet if found, else return false
    """
    deleteTweet(id: ID): Boolean
  }
  type Movie {
    id: Int!
    url: String!
    imdb_code: String!
    title: String!
    title_english: String
    title_long: String
    slug: String
    year: Int
    rating: Int
    runtime: Int
    summary: String
    description_full: String
    synopsis: String
    yt_trailer_code: String
    language: String
    mpa_rating: String
    background_image: String
    background_image_original: String
    small_cover_image: String
    medium_cover_image: String
    large_cover_image: String
    state: String
    date_uploaded: String
    date_uploaded_unix: Int
    genres: [String]!
  }
`;

const resolvers = {
  Query: {
    ping() {
      return "pong";
    },
    tweet(root, { id }) {
      return tweets.find(tweet => tweet.id === id);
    },
    movie(_, {id}) {
      return fetch(`https://yts.torrentbay.net/api/v2/movie_details.json?movie_id=${id}`)
      .then((r) => r.json())
      .then(json => json.data.movie);  
    },
    allTweets() {
      return tweets;
    },
    allUsers() {
      return users;
    },
    allMovies() {
      return fetch("https://yts.torrentbay.net/api/v2/list_movies.json")
      .then((r) => r.json())
      .then(json => json.data.movies);  
    }
  },
  Mutation: {
    postTweet(_, {text, userId}) {
      const user = users.find((user) => user.id === userId);
      if(!user) throw new Error('유저를 찾을 수 없습니다.');
      const newTweet = {
        id: tweets.length+1,
        text,
        userId,
      };
      tweets.push(newTweet);
      return newTweet;
    },
    deleteTweet(_, {id}) {
      const tweet = tweets.find(tweet => tweet.id === id);
      if(!tweet) return false;
      tweets = tweets.filter(tweet => tweet.id !== id);
      return true;
    }
  },
  User: {
    fullName({ firstName, lastName }) {
      return `${firstName} ${lastName}`;
    },
  },
  Tweet: {
    author({ userId }) {
      return users.find((user) => user.id === userId);
    },
  },
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});