목차
- Setup
- Type Query
- Scalar Type
- 사용자 정의 Type
- Mutation Type
- Non Nullable Fields

# Setup

Apollo 서버를 사용해 graphQL API를 사용해보자. Apollo 서버는 node js 서버인데 graphQL을 이해할 수 있도록 기능을 구현하였다. 

세팅 명령어

- npm init -y : package.json 생성
- npm install apollo-server graphql
- npm install nodemon -D : 개발자 경험 향상
- touch server.js
- touch .gitignore : node_modules/ 입력

package.json

```
{
	"scripts": {
		"dev": "nodemon server.js"
	},
		"type": "module"
}
```

서버 실행

- npm run dev
- server.js를 수정하고 저장하면 서버가 자동으로 재시작됨

server.js

```jsx
import { ApolloServer, gql } from "apollo-server";

const server = new ApolloServer({})

server.listen().then(({url}) => {
    console.log('Running on ${url}');
});
```

서버를 실행해보면 다음과 같은 오류가 나는데, graphql을 쓰려면 스키마가 필요하다는 내용이다.

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/886e7ee3-310a-4bd4-bcb2-5867ff4eada8)


# Type Query

모든 GraphQL 서버(Apollo Server 포함)는 스키마를 사용하여 클라이언트가 쿼리할 수 있는 데이터 구조를 정의한다. 

그중 쿼리는 데이터를 조회하기 위해 사용되는 루트 타입이다.  필수로 정의해야 한다. 사용자가 request할 수 있는 모든 것은 type query 안에 정의되어야 한다. ApolloServer의 인스턴스를 만들 때 파라미터로 넘겨준다.

Query 타입 안에 text, hello 등의 필드를 넣을 수 있는데 이들은 마치 REST GET을 사용하는 것과 같다. 이 요청을 REST 스타일로 썼다면 GET /text, GET /hello 등일 것이다.

```jsx
import { ApolloServer, gql } from "apollo-server";

// gql : graphql schema definition language
// Query : 필수 타입. 사용자가 request할 수 있는 모든 것은 type query 안에 있어야함
// Query 타입 안의 필드는 마치 REST GET과 같다
const typeDefs = gql`
  type Query {
    text: String
    hello: String
  }
`;

const server = new ApolloServer({typeDefs})

server.listen().then(({url}) => {
    console.log(`Running on ${url}`);
});
```

서버를 실행하면 Polar Studio가 나온다. 여기에서 우리가 정의한 graphQL API를 탐색할 수 있다.
![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/dcc655cf-622e-4134-8013-694b4eaea521)

# Scalar Type

단일 값(Scalar Value)을 나타내는 타입. 스키마에서 기본적으로 제공하는 타입으로, 사용자 정의 타입이 아니라 내장되어 있는 타입이다.

1. `**I**nt`: 정수 값
2. `Float`: 부동 소수점 숫자 값
3. `String`: 문자열 값
4. `Boolean`: 참(True) 또는 거짓(False) 값을
5. `ID`: 고유 식별자. 주로 문자열로 표현되지만, GraphQL에서는 특별한 의미를 갖는 타입으로 처리된다. ID는 문자열, 숫자 등 다양한 형식의 식별자를 사용할 수 있다.

# 사용자 정의 타입

스칼라 타입을 조합해서 사용자 정의 타입을 만들 수 있다. 예를 들어 id와 text 정보의 리스트를 조회 가능하도록 타입을 짜면 다음과 같다. Query 안에 배열을 포함하는 경우, 이름은 allXXXs로 붙이는게 관례이다.

```jsx
const typeDefs = gql`
  type Tweet {
    id: ID
    text: String
  }
  type Query {
    allTweets: [Tweet] # 이름!
  }
`;
```

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/4e070df4-3fbb-477e-a29d-aacf9d2a0595)


중첩 타입을 만들어서 타입을 연결할 수 있다.

```jsx
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
    allTweets: [Tweet]
  }
`;
```

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/90e241cb-77a4-4f58-a15d-dccba06cf9df)


이번엔 개별 Tweet을 조회하는 타입을 넣어보자. 개별 조회에는 식별자가 필요하므로 다음과 같이 타입을 정의한다.

```jsx
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
    allTweets: [Tweet]
    tweet(id: ID): Tweet # id 식별자
  }
`;
```

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/8b2c5a5b-a417-4937-978c-eded764088ad)

# Mutation 타입

Mutation은 데이터를 변경하기 위해 사용되는 루트 타입이다. 클라이언트가 서버에게 데이터를 변경하거나 추가하거나 삭제할 때는 주로 뮤테이션을 사용한다. REST 세상에서 CREATE, PUT, DELETE를 Mutation으로 표현한다.

- `postTweet(text: String, userId: ID): Tweet` : text, userId를 받아서 create 하고 Tweet 반환
- `deleteTweet(id: ID): Boolean` : id를 받아서 delete하고 Boolean 반환

```jsx
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
  type Mutation {
    postTweet(text: String, userId: ID): Tweet
		deleteTweet(id: ID): Boolean
  }
`;
```

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/c5425f85-20b4-4d17-8881-87394bb466a1)


Mutation을 사용할 때는 Mutation이라고 키워드를 줘야한다. postTweet 필드를 사용해 매개변수를 넘기고, Tweet에서 받아오기를 기대하는 필드를 적는다. 

# Non Nullable Fields

GraphQL에 정의하는 필드의 타입은 기본적으로 null을 허용한다. 만약 필드 값으로 null을 허용하고 싶지 않다면 !를 붙인다. 매개변수 식별자에 붙이면 반드시 id를 전달하라는 것이고, 반환 타입에 붙이면 반드시 Tweet을 반환한다고 확실히하는 것이다. required를 사용해 null 여부를 설정할 수 있다. 

```jsx
const typeDefs = gql`
  type Query {
    tweet(id: ID!): Tweet!
  }
`;
```

식별자를 넘기지 않은 상태로 쿼리를 작성하면 오류가 뜬다.

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/15bcbba9-ae49-4696-944d-0bf732063e84)


서버 api에 Tweet을 반환하는 로직을 추가하지 않고 쿼리를 요청하면 오류 응답이 뜬다.

![image](https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/7323483c-2f79-4b3f-821a-0ca1eace6e61)


배열에 required를 사용할 수 있다. 이렇게 쓰면 반드시 리스트를 반환하며, 이 리스트는 반드시 Tweet 타입의 아이템을 가짐을 보장한다.

```graphql
type Query {
	allTweets: [Tweet!]!
}
```

