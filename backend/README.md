# catgpt-server

Spring Boot 3.5.7 / Java 21 REST API for the CatGPT virtual pet simulator.

## Stack

| Concern | Technology |
|---|---|
| Framework | Spring Boot 3.5.7 |
| Language | Java 21 |
| Database | PostgreSQL 16 via Spring Data JPA |
| Auth | JWT (JJWT 0.13.0) + Google OAuth 2.0 |
| AI Chat | Groq API — `qwen/qwen3.6-27b` |
| Breed Data | The Cat API |
| Validation | Jakarta Bean Validation (`@Valid`, `@NotBlank`, `@Min`/`@Max`) |
| Logging | Lombok `@Slf4j` |
| Testing | JUnit 5 + Mockito (140 unit tests) |
| Build | Maven Wrapper |

## Architecture

The project follows a layered package structure per domain:

```
com.codecool.catgpt/
├── cats/       api · app · domain · infra
├── items/      api · app · domain · infra
├── users/      api · app · domain · infra
├── friends/    api · app · domain          # friend requests + relationships
├── borrow/     api · app                  # cat borrowing between friends
├── sse/        SseService · SseController # Server-Sent Events push notifications
├── chat/       api · app
├── breeds/     api · app
├── security/   JwtService · JwtAuthFilter · AppUserDetails(Service) ·
│               CurrentUser · OAuth2Login(Success|Failure)Handler
├── config/     SecurityConfig · CorsConfig · AppConfig · StatsConfig
└── common/     BaseEntity · StatsLimits · GlobalExceptionHandler · ErrorResponse
```

- **`api`** — controllers and request/response DTOs  
- **`app`** — service classes (business logic)  
- **`domain`** — JPA entities  
- **`infra`** — Spring Data JPA repositories  

## Running Locally

```bash
# copy and populate
cp .env.example .env

./mvnw spring-boot:run
# API available at http://localhost:8080
```

## Running Tests

```bash
./mvnw test
```

Tests use Mockito strict mode (`@ExtendWith(MockitoExtension.class)`) — any unnecessary stub causes a test failure.

## Key API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | ✗ | Create account |
| POST | `/api/auth/login` | ✗ | Get JWT token |
| GET | `/api/cats` | ✓ | List all cats for the authenticated user |
| POST | `/api/cats` | ✓ | Adopt a new cat |
| DELETE | `/api/cats/{id}` | ✓ | Release a cat |
| PATCH | `/api/cats/{id}` | ✓ | Rename a cat |
| POST | `/api/cats/{id}/decrement/{stat}` | ✓ | Decrement a stat (`hunger`/`mood`/`health`) |
| POST | `/api/cats/{id}/items/{itemId}` | ✓ | Apply an item to a cat |
| POST | `/api/cats/{id}/borrow` | ✓ | Borrow a friend's cat as active companion |
| DELETE | `/api/cats/{id}/borrow` | ✓ | Return a borrowed cat |
| GET | `/api/items` | ✓ | List owned items |
| POST | `/api/items/catch` | ✓ | Catch a randomly generated item |
| GET | `/api/friends` | ✓ | List approved friends |
| POST | `/api/friends/request` | ✓ | Send a friend request by username |
| GET | `/api/friends/requests/incoming` | ✓ | List incoming pending requests |
| GET | `/api/friends/requests/outgoing` | ✓ | List outgoing pending requests |
| PATCH | `/api/friends/{id}/approve` | ✓ | Approve a friend request |
| PATCH | `/api/friends/{id}/decline` | ✓ | Decline a friend request |
| DELETE | `/api/friends/{id}` | ✓ | Remove a friend |
| GET | `/api/friends/{id}/cats` | ✓ | List a friend's cats (with borrow availability) |
| GET | `/api/user/me` | ✓ | Get current user profile |
| PATCH | `/api/user/me/nickname` | ✓ | Update display name |
| PATCH | `/api/user/me/password` | ✓ | Change password |
| GET | `/api/sse/events` | ✓ | Subscribe to real-time push events (SSE) |
| POST | `/api/chat/{catId}` | ✓ | Send a chat message to a cat |
| GET | `/api/breeds` | ✓ | List available breeds |
| GET | `/actuator/health` | ✗ | Health check (used by frontend wakeup probe) |

## Environment Variables

See `.env.example` for the full list. Required keys:

```
SPRING_DATASOURCE_URL
SPRING_DATASOURCE_USERNAME
SPRING_DATASOURCE_PASSWORD
JWT_SECRET          # minimum 32 characters
GROQ_API_KEY
FRONTEND_URL        # used for OAuth redirect (e.g. http://localhost:5173)
```

Optional:

```
JWT_EXPIRATION          # default 3600000 (1 hour in ms)
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
THE_CAT_API_KEY         # raises rate limits on The Cat API
```
