# Backend GraphQL API (Node.js + TypeScript + TypeORM + Cognito)

A production‑ready backend template using GraphQL, PostgreSQL and AWS Cognito authentication, fully containerized with Docker and covered by integration tests using Jest.

---

## Tech Stack

- Node.js
- TypeScript
- GraphQL (Apollo Server)
- TypeORM
- PostgreSQL
- AWS Cognito (email + password authentication)
- Jest (integration testing)
- Yarn
- Docker / Docker Compose

---

## Project Structure

```
src/
 ├─ index.ts
 ├─ database/
 │   ├─ entities/
 │   └─ data-source.ts
 ├─ graphql/
 │   ├─ schema/
 │   └─ resolvers/
 ├─ modules/
 │   └─auth/
 ├─ utils/
 │   ├─ cognitoSecretHash.ts
 │   └─ verifyToken.ts
tests/
 ├─ graphql/
 │   └─ user.test.ts
 └─ setup-env.ts
```

---

## Environment Variables

Create a `.env` file:

```
NODE_ENV=development
PORT=4000

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=app_db

COGNITO_USER_POOL_ID=xxxx
COGNITO_CLIENT_ID=xxxx
AWS_REGION=xxxxxx
```

---

## Running with Docker

Start services:

```
docker compose up --build
```

Services:

- API: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- PostgreSQL: port 5432

---

## Database

TypeORM automatically initializes the schema in development mode.

To reset database:

```
docker compose down -v
```

---

## Available Scripts

```
yarn dev        # run with ts-node-dev
yarn build      # compile TypeScript
yarn start      # run compiled app
yarn test       # run integration tests
```

---

## Authentication Flow (Cognito)

1. User registers with email + password
2. Cognito sends verification email
3. User confirms account
4. User logs in and receives JWT
5. JWT is sent in requests:

```
Authorization: Bearer <token>
```

The backend validates the token and injects the user into GraphQL context.

---

## Example GraphQL Operations

### Register User

```
mutation {
  register(name: "benskillet2", email: "user@email.com", password: "Password123!")
}

mutation {
  confirmEmail(email:"user@email.com", code:"578687")
}

```

### Login

```
mutation {
  login(email:"user@email.com", password:"Password123!") {
    accessToken
    idToken
    refreshToken
    user {
      email
      name
      role
      emailConfirmed
      createdAt
    }
  }
}
```

### Authenticated Query

```
query Query {
  emotionalGoals {
    id
    title
  }
  emotionProcessingStyles {
    id
    title
  }
  activePlants {
    id
    name
    represents
    stages {
      id
      imageUrl
      requiredPoints
    }
    season {
      id
      startDate
      endDate
      isActive
    }
  }
}
```

---

## Testing

Tests are integration tests running against the real GraphQL server.

Run tests:

```
yarn test
```

Tests include:

- Authorization validation
- Mutation flows
- Full create → query lifecycle

---

## Development Notes

- Path aliases configured via `tsconfig` and `ts-jest`
- Context-based authentication middleware
- No credentials stored in source code
- Dockerized DB for consistent environments

---

## Production Recommendations

- Disable `synchronize` in TypeORM
- Use migrations
- Use Secrets Manager for environment variables
- Enable HTTPS behind a reverse proxy
- Configure Cognito domain + refresh tokens

---

## License

Internal project template.
