목차
- GraphQL이란?
- Over Fetching
- Under Fetching
- Try GraphQL!

# GraphQL이란?

[GraphQL: API를 위한 쿼리 언어](https://graphql-kr.github.io/)

GraphQL은 API를 위한 쿼리 언어이다.

[GitHub - graphql/graphql-spec: GraphQL is a query language and execution engine tied to any backend service.](https://github.com/graphql/graphql-spec)

GraphQL은 하나의 아이디어이자 스펙이다. 

GraphQL은 API 요청을 메시지가 아닌 데이터 중심으로 구성하여, 클라이언트 입장에서 더 유연하고 효율적인 API를 제공한다.

# Over Fetching

GraphQL이 해결하는 REST의 문제로 두 가지가 있는데, 첫번째는 over fetching이다.

클라이언트가 실제 사용할 데이터가 아니어도, 특정 요청에 대한 전체 데이터를 받는다. 필요한 것보다 더 많은 data를 fetch한다. 즉, 쓸데 없는 데이터를 받는다.

API 클라이언트는 3번 아이디를 가진 영화의 제목, 이미지 url, 평점 정보만 필요하다. 하지만 REST api를 사용하여 /movies/3을 요청하면 API 개발자가 정의해둔 3번 아이디를 가진 영화의 모든 상세정보를 끌어온다. API 클라이언트 입장에서는 데이터가 아닌 서버에 의존하므로, 서버가 API로 내려주는 데이터에 의존해야한다. 

GraphQL은 서버가 내려주는 API가 아닌 서버의 데이터를 제어한다. 위의 상황에서 GraphQL을 사용하면 서버에게 3번 아이디를 가진 영화의 제목, 이미지 url, 평점 정보를 달라고 직접 요청하면 된다. 

```graphql
// 요청
{
  movie(id: "3") {
    name
    image_url
		ratings
  }
}

// 응답
{
	"data": {
	  "movie": {
	    "name": "바람과 함께 사라지다",
	    "image_url": "http://...",
			"ratings": 4.5
	  }
	}
}

```

# Under Fetching

GraphQL이 해결하는 REST의 문제로 두 가지가 있는데, 두번째는 Under Fetching이다. Unfer Fetching은 우리가 필요한 것보다 덜 받는 문제이다. 

<img width="638" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202023-06-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209 09 06" src="https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/dd092069-2a0d-429b-b00c-289cd233cdcd">
<img width="352" alt="%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202023-06-21%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%209 18 21" src="https://github.com/Mingadinga/2023_Study_GraphQL/assets/53958188/34052aad-2f02-4644-92ae-752a007bfc53">



api 응답으로 영화에 대한 상세정보를 받았고, 화면에 뿌려주려고 한다. 그런데 장르 정보를 보니 화면에 뿌려줄 장르 문자열이 아닌 식별자 정보가 들어있다. 그래서 화면에 장르 문자열까지 뿌려주려면 추가적인 요청이 필요하다. 

하지만 GraphQL API는 한번의 요청으로 앱에 필요한 모든 데이터를 가져온다. 필요한 데이터가 무엇인지 schema를 직접 구성해서 전달하기 때문이다. 추가적인 요청이 필요하지 않으므로,  GraphQL을 사용하는 앱은 느린 모바일 네트워크 연결에서도 빠르게 수행할 수 있다.

위의 영화 장르를 가져오는 GraphQL API는 다음과 같이 만들 수 있다.

```graphql
// 요청
movie {
	// ..
	genres {
		name
	}
}

// 응답
{
	"data": {
		"movie": {
			// ..
			"genres": [
				{
					"name": "romance"
				},			
				{
					"name": "thriller"
				},
			]
		}
}		
```

# Try GraphQL

이번엔 GraphQL API로부터 data를 request해보자. 

이 사이트는 스타워즈 정보를 API로 제공하며 QueryDSL로 요청하는 기능이 있다. 사용해보자.

[Apollo Studio](https://studio.apollographql.com/public/star-wars-swapi/variant/current/explorer)

스키마를 보면 다음과 같다. root 아래에 다양한 것들이 있고.. allFilms를 보면 이런 스키마를 갖는다. root 안에서 여러 all로 시작하는 스키마를 호출할 수 있다. 이런 all로 시작하는 애들은 REST에서는 각각 별도의 요청을 날려야 얻을 수 있다.

```graphql
type Root {
  allFilms(after: String, before: String, first: Int, last: Int): FilmsConnection
  allPeople(after: String, before: String, first: Int, last: Int): PeopleConnection
  allPlanets(after: String, before: String, first: Int, last: Int): PlanetsConnection
  allSpecies(after: String, before: String, first: Int, last: Int): SpeciesConnection
  allStarships(after: String, before: String, first: Int, last: Int): StarshipsConnection
  allVehicles(after: String, before: String, first: Int, last: Int): VehiclesConnection
  film(filmID: ID, id: ID): Film

  """Fetches an object given its ID"""
  node(
    """The ID of an object"""
    id: ID!
  ): Node
  person(id: ID, personID: ID): Person
  planet(id: ID, planetID: ID): Planet
  species(id: ID, speciesID: ID): Species
  starship(id: ID, starshipID: ID): Starship
  vehicle(id: ID, vehicleID: ID): Vehicle
}

type FilmsConnection {
  """A list of edges."""
  edges: [FilmsEdge]

  """
  A list of all of the objects returned in the connection. This is a convenience
  field provided for quickly exploring the API; rather than querying for
  "{ edges { node } }" when no edge data is needed, this field can be be used
  instead. Note that when clients like Relay need to fetch the "cursor" field on
  the edge to enable efficient pagination, this shortcut cannot be used, and the
  full "{ edges { node } }" version should be used instead.
  """
  films: [Film]

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """
  A count of the total number of objects in this connection, ignoring pagination.
  This allows a client to fetch the first five objects by passing "5" as the
  argument to "first", then fetch the total count so it could display "5 of 83",
  for example.
  """
  totalCount: Int
}
```

allFilms에서 원하는 정보만 가져와보자. (over fetching 해결)

```graphql
# root
{
  # overfetching
  allFilms {
    totalCount
    films {
      title
    }
  }
}
```

이번엔 화면을 뿌리는데 필요한 allPeople도 같이 요청해보자. (under fetching 해결)

```graphql
# root
{
  # overfetching
  allFilms {
    totalCount
    films {
      title
    }
  }
  # underfetching
  allPeople {
    people {
      name
      hairColor
    }
  }
}
```
