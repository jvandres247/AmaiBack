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
COGNITO_CLIENT_SECRET=xxxx
COGNITO_REGION=xxxxxx
```

---

## Running with Docker

Start services:

```
cp .env.example .env
docker compose up --build
```

Services:

- API: [http://localhost:4000/graphql](http://localhost:4000/graphql)
- PostgreSQL: port 5432
- AWS/Cognito (Floci): [http://localhost:4566](http://localhost:4566)

Docker Compose automatically creates a local User Pool and App Client:

```text
User Pool ID: us-east-1_amaiback
App Client ID: amaiback-local-client
```

Confirmation and password recovery codes are available in the Floci logs:

```bash
docker compose logs -f floci
```

### Cognito emails in development

Floci emulates Amazon SES, but it **does not send emails over the Internet** by
default. A message such as `SES email sent` in the logs means that the email was
accepted and stored in the local mailbox, not delivered to Gmail or another
email provider.

All captured emails, including Cognito confirmation and password recovery
codes, can be inspected at:

- Local SES mailbox: [http://localhost:4566/_aws/ses](http://localhost:4566/_aws/ses)

To retrieve the most recent email from PowerShell:

```powershell
(Invoke-RestMethod http://localhost:4566/_aws/ses).messages |
  Sort-Object Timestamp -Descending |
  Select-Object -First 1
```

The verification code is available in `Body.text_part`. If a new code is
requested, always use the most recent message.

For a visual inbox during development, connect
[Mailpit](https://mailpit.axllent.org/) as an SMTP relay and open its UI at
`http://localhost:8025`. Configure Floci with:

```yaml
environment:
  FLOCI_SERVICES_SES_SMTP_HOST: mailpit
  FLOCI_SERVICES_SES_SMTP_PORT: 1025
```

To deliver real emails, configure an external SMTP relay using
`FLOCI_SERVICES_SES_SMTP_HOST`, `FLOCI_SERVICES_SES_SMTP_PORT`,
`FLOCI_SERVICES_SES_SMTP_USER`, `FLOCI_SERVICES_SES_SMTP_PASS`, and
`FLOCI_SERVICES_SES_SMTP_STARTTLS`. Keep credentials in environment variables
and never commit them to the repository.

Floci is free and does not require an account, license, or token. The real AWS
configuration remains unchanged: outside Docker, omit `COGNITO_ENDPOINT`,
`COGNITO_ISSUER`, and `COGNITO_JWKS_URI`.

---

## Plant stage images (S3 in Floci)

Compose enables S3 and creates the persistent `amaiback-plant-images` bucket
automatically. The initialization hook uses the [Floci S3 API](https://floci.io/floci/services/s3/)
to allow public reads under `plants/` for these catalog images.

Place the actual images under `assets/plants/`, matching the paths stored in
`PlantStage.imageUrl`. For example:

```text
assets/plants/loto-sereno/stage-1.png
assets/plants/loto-sereno/stage-2.png
assets/plants/loto-sereno/stage-3.png
assets/plants/loto-sereno/stage-4.png
```

Run `docker compose up -d --build` to apply the configuration. At each Floci
startup, PNG, JPG, JPEG, WebP, GIF and AVIF files (lowercase extensions) are
synced to `s3://amaiback-plant-images/plants/`. Existing objects are preserved.
No image files are bundled: add your images before expecting their URLs to work.

To upload added or changed images without restarting Floci:

```bash
docker compose exec floci sh /etc/floci/init/ready.d/01-init-aws.sh
```

Store `/plants/loto-sereno/stage-1.png` (or `plants/loto-sereno/stage-1.png`)
in `PlantStage.imageUrl`, as the existing seed already does. The GraphQL
`PlantStage.imageUrl` field resolves it to:

```text
http://localhost:4566/amaiback-plant-images/plants/loto-sereno/stage-1.png
```

Existing absolute HTTP(S) image URLs are preserved. The resolver applies to
both plant stages and the current stage returned in a user's progress.

Optional `.env` settings for Compose:

```dotenv
S3_BUCKET=amaiback-plant-images
S3_PUBLIC_ENDPOINT=http://localhost:4566
```

Use your computer's LAN address for `S3_PUBLIC_ENDPOINT` when the client runs
on a phone or another device. The URL must be reachable by the client.
When running Node outside Compose, set `S3_PUBLIC_BASE_URL` to the complete
bucket URL, e.g. `http://localhost:4566/amaiback-plant-images`.
Without that variable, GraphQL returns the stored image paths unchanged.

The files persist in the `floci_data` volume. `docker compose down -v` removes
that volume; the next startup reuploads files from `assets/plants/`.

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
