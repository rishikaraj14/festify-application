# Festify Backend - Spring Boot REST API

This is the Spring Boot backend for the Festify event management platform, connecting to the same Supabase PostgreSQL database as the Next.js frontend.

## Project Structure

```
backend/
├── src/main/java/com/example/backend/
│   ├── entity/                    # JPA entities
│   │   ├── enums/                 # Enum types (UserRole, EventStatus, ParticipationType)
│   │   ├── College.java
│   │   ├── Category.java
│   │   ├── Profile.java
│   │   └── Event.java
│   ├── repository/                # Spring Data JPA repositories
│   │   ├── CollegeRepository.java
│   │   ├── CategoryRepository.java
│   │   ├── ProfileRepository.java
│   │   └── EventRepository.java
│   ├── controller/                # REST controllers
│   │   ├── CollegeController.java     # /api/colleges
│   │   ├── CategoryController.java    # /api/categories
│   │   ├── ProfileController.java     # /api/profiles
│   │   ├── EventController.java       # /api/events
│   │   └── HelloController.java       # /api/health
│   └── BackendApplication.java    # Main Spring Boot application
└── src/main/resources/
    └── application.properties     # Database configuration
```

## Technologies

- **Spring Boot 3.2.12**
- **Java 17**
- **Spring Data JPA** - ORM with Hibernate
- **PostgreSQL** - Supabase PostgreSQL database
- **Spring Security** - Authentication & authorization
- **JWT (JJWT 0.11.5)** - Token-based authentication
- **Lombok 1.18.34** - Boilerplate code generation
- **Maven** - Build tool

## Database Configuration

The backend connects to Supabase PostgreSQL. Database credentials are configured in `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
spring.datasource.username=postgres.pnekjnwarkpgrlsntaor
spring.datasource.password=festify@4578
```

## API Endpoints

### Colleges (`/api/colleges`)
- `GET /api/colleges` - List all colleges
- `GET /api/colleges/{id}` - Get college by ID
- `POST /api/colleges` - Create new college
- `PUT /api/colleges/{id}` - Update college
- `DELETE /api/colleges/{id}` - Delete college

### Categories (`/api/categories`)
- `GET /api/categories` - List all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create new category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Profiles (`/api/profiles`)
- `GET /api/profiles` - List all profiles
- `GET /api/profiles/{id}` - Get profile by ID
- `GET /api/profiles/user/{userId}` - Get profile by Supabase user ID
- `GET /api/profiles/email/{email}` - Get profile by email
- `POST /api/profiles` - Create new profile
- `PUT /api/profiles/{id}` - Update profile
- `DELETE /api/profiles/{id}` - Delete profile

### Events (`/api/events`)
- `GET /api/events` - List all events
- `GET /api/events/{id}` - Get event by ID
- `GET /api/events/college/{collegeId}` - Get events by college
- `GET /api/events/category/{categoryId}` - Get events by category
- `GET /api/events/organizer/{organizerId}` - Get events by organizer
- `GET /api/events/status/{status}` - Get events by status
- `GET /api/events/upcoming` - Get upcoming published events
- `POST /api/events` - Create new event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event

## ⚠️ Important: Lombok Configuration Issue

**There is currently a Lombok annotation processing incompatibility with the javac compiler in this environment.** This causes Maven compilation failures with error:

```
Fatal error compiling: java.lang.ExceptionInInitializerError: com.sun.tools.javac.code.TypeTag :: UNKNOWN
```

### Solutions:

#### Option 1: Use IDE with Lombok Plugin (Recommended)
1. Install Lombok plugin in your IDE (IntelliJ IDEA, Eclipse, VS Code with Java extensions)
2. Enable annotation processing in IDE settings
3. Build and run from IDE - this will work correctly

#### Option 2: Remove Lombok Dependency
If Maven builds are critical, you can:
1. Remove the Lombok dependency from `pom.xml`
2. Manually add getters, setters, constructors to all entity classes
3. Remove `@Data`, `@NoArgsConstructor`, `@AllArgsConstructor` annotations from entities

#### Option 3: Use Delombok
Run Lombok's delombok tool to generate plain Java code:
```bash
mvn lombok:delombok
```

## Building and Running

###Using Maven (if Lombok is working):
```bash
# Build
./mvnw clean install

# Run
./mvnw spring-boot:run
```

### Using IDE:
1. Import project as Maven project
2. Install Lombok plugin
3. Enable annotation processing
4. Run `BackendApplication.java`

## CORS Configuration

All controllers are configured with:
```java
@CrossOrigin(origins = "http://localhost:3000")
```

This allows the Next.js frontend (running on port 3000) to make API calls to this backend.

## Next Steps

1. **Fix Lombok issue** - Install IDE Lombok plugin or remove Lombok dependency
2. **Implement authentication** - Add JWT token validation with Supabase
3. **Add service layer** - Create service classes between controllers and repositories
4. **Add validation** - Use `@Valid` and Bean Validation annotations
5. **Add exception handling** - Create `@ControllerAdvice` for global exception handling
6. **Add tests** - Write unit and integration tests
7. **Configure security** - Set up Spring Security with Supabase JWT validation
8. **Add DTOs** - Create Data Transfer Objects to separate API contracts from entities

## Dependencies Included

- `spring-boot-starter-web` - REST API support
- `spring-boot-starter-data-jpa` - JPA/Hibernate ORM
- `spring-boot-starter-security` - Security framework
- `spring-boot-starter-validation` - Bean validation
- `spring-boot-starter-mail` - Email support
- `spring-boot-starter-cache` - Caching support
- `spring-boot-starter-actuator` - Production monitoring
- `postgresql` - PostgreSQL JDBC driver
- `jjwt` - JWT token library
- `lombok` - Code generation (note: has compilation issue in Maven)

## License

[Your License Here]
