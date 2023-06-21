# API란?

Application Programming Interface

- 좀 바보 같은 이름..
- 의미 연상이 안됨

Interface : 무언가와 상호작용하는 방법

- 리모컨 버튼 : 시청자가 텔레비전과 상호작용
- 드론 컨트롤러 : 드론 운전자와 드론 상호작용
- 브라우저 배터리 API : 브라우저 사용자에게 충전 관련 정보 제공, 즉 브라우저의 기능을 사용할 수 있도록 제공하는 방법
- 웹사이트 API : 웹사이트의 사용자가 그 사이트와 상호작용하는 방법

# REST + HTTP

프로그램의 상호작용을 요청하거나 요청 받을 때 API가 필요하다. REST는 API를 표현하는 방법 중 하나이다.

REST API는 **URL**을 통해 통신한다. URL은 Uniform Resource Locator의 약어로, 필요로 하는 리소스의 주소를 나타낸다. 가령 [nomadmovies.co/api/movies/1](http://nomadmovies.co/api/movies/1) 이렇게 URL을 작성하면 nomadmovies.co의 리소스인 movies 중 1번을 의미한다. 

리소스에 대한 동작은 **HTTP의 메소드**로 정의하는데, GET, POST, PUT, DELETE 등 리소스로 어떤 작업을 할지 구체적으로 넘겨준다. POST나 PUT 등 추가적으로 넘겨줄 데이터가 필요하다면 HTTP 패킷의 **메시지 바디**를 사용한다.

REST api 예시

- GET domain/users
- POST domain/products {”name”:”생강”,”price”:3000}
- DELETE products/1

REST api가 대중적인 이유는 무엇일까? 관례 덕분에 이해하기 쉽고, 조직화되어있고, 간단하고, 전세계의 거의 모든 디바이스들이 URL로 요청을 보낼 수 있다는 장점 때문이다.

# REST API 규약

[REST API 모범 사례 – REST 엔드포인트 설계 예시](https://www.freecodecamp.org/korean/news/rest-api-mobeom-sarye-rest-endeupointeu-seolgye-yesi/)

개인적인 궁금증, **URL에 형용사**를 사용해도 될까?

→ 가능하다! 중요한 것은 URL이 리소스를 명확하게 식별하는 것. 형용사를 사용하여 URL에 구체적인 의미를 부여하는 것은 REST 규약에 어긋나지 않는다.

예를 들어 특정 사용자가 차단한 사용자 목록을 불러오는 REST api는 다음과 같은 URL로 표현할 수 있다.

- `GET /users/{userId}/blocked`
