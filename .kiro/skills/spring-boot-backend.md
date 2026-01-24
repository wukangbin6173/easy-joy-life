---
name: "Spring Boot Backend Development"
description: "Complete Spring Boot backend development knowledge including REST API, JPA, Security"
tags: ["spring-boot", "java", "rest-api", "jpa", "mysql", "backend"]
version: "1.0.0"
---

# Spring Boot 后端开发技能

## 项目架构

### 标准目录结构
```
src/main/java/com/company/project/
├── controller/     # 控制器层
├── service/        # 业务逻辑层
├── repository/     # 数据访问层
├── entity/         # 实体类
├── config/         # 配置类
├── utils/          # 工具类
└── Application.java # 启动类
```

### 分层架构
- **Controller**: 处理HTTP请求
- **Service**: 业务逻辑处理
- **Repository**: 数据库操作
- **Entity**: 数据模型

## 核心注解

### 基础注解
```java
@SpringBootApplication  // 启动类
@RestController        // REST控制器
@Service              // 服务层
@Repository           // 数据访问层
@Entity               // JPA实体
@Configuration        // 配置类
```

### 请求映射
```java
@GetMapping("/api/users")
@PostMapping("/api/users")
@PutMapping("/api/users/{id}")
@DeleteMapping("/api/users/{id}")
@RequestParam String name
@PathVariable Long id
@RequestBody User user
```

## 数据库集成

### JPA配置
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/database
    username: root
    password: password
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
```

### 实体类定义
```java
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @CreationTimestamp
    private LocalDateTime createdTime;
}
```

### Repository接口
```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContaining(String name);
    
    @Query("SELECT u FROM User u WHERE u.age > :age")
    List<User> findUsersOlderThan(@Param("age") int age);
}
```

## REST API设计

### 控制器实现
```java
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    
    private final UserService userService;
    
    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.findAll();
        return ResponseEntity.ok(users);
    }
    
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User savedUser = userService.save(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }
}
```

### 统一响应格式
```java
public class ApiResponse<T> {
    private boolean success;
    private String message;
    private T data;
    
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(true, "操作成功", data);
    }
    
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
```

## 异常处理

### 全局异常处理器
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(EntityNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(e.getMessage()));
    }
    
    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(ValidationException e) {
        return ResponseEntity.badRequest()
                .body(ApiResponse.error(e.getMessage()));
    }
}
```

### 自定义异常
```java
public class BusinessException extends RuntimeException {
    private final int code;
    
    public BusinessException(int code, String message) {
        super(message);
        this.code = code;
    }
}
```

## 配置管理

### 配置文件
```yaml
# application.yml
server:
  port: 8080

spring:
  profiles:
    active: dev

# 自定义配置
app:
  name: MyApplication
  version: 1.0.0
```

### 配置类
```java
@ConfigurationProperties(prefix = "app")
@Data
public class AppConfig {
    private String name;
    private String version;
}
```

## 安全配置

### Spring Security
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/public/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2ResourceServer(OAuth2ResourceServerConfigurer::jwt);
        return http.build();
    }
}
```

### JWT集成
```java
@Service
public class JwtService {
    
    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }
}
```

## 测试

### 单元测试
```java
@ExtendWith(MockitoExtension.class)
class UserServiceTest {
    
    @Mock
    private UserRepository userRepository;
    
    @InjectMocks
    private UserService userService;
    
    @Test
    void shouldCreateUser() {
        // Given
        User user = new User("John");
        when(userRepository.save(any(User.class))).thenReturn(user);
        
        // When
        User result = userService.createUser(user);
        
        // Then
        assertThat(result.getName()).isEqualTo("John");
    }
}
```

### 集成测试
```java
@SpringBootTest
@AutoConfigureTestDatabase
@Transactional
class UserControllerIntegrationTest {
    
    @Autowired
    private TestRestTemplate restTemplate;
    
    @Test
    void shouldCreateUser() {
        User user = new User("John");
        ResponseEntity<User> response = restTemplate.postForEntity(
                "/api/users", user, User.class);
        
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    }
}
```

## 性能优化

### 数据库优化
```java
// 批量操作
@Modifying
@Query("UPDATE User u SET u.status = :status WHERE u.id IN :ids")
int updateUserStatus(@Param("status") String status, @Param("ids") List<Long> ids);

// 分页查询
Pageable pageable = PageRequest.of(0, 10, Sort.by("createdTime").descending());
Page<User> users = userRepository.findAll(pageable);
```

### 缓存配置
```java
@EnableCaching
@Configuration
public class CacheConfig {
    
    @Bean
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("users", "products");
    }
}

@Cacheable("users")
public User findById(Long id) {
    return userRepository.findById(id).orElse(null);
}
```

## 监控和日志

### Actuator配置
```yaml
management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics
  endpoint:
    health:
      show-details: always
```

### 日志配置
```java
@Slf4j
@Service
public class UserService {
    
    public User createUser(User user) {
        log.info("Creating user: {}", user.getName());
        try {
            User savedUser = userRepository.save(user);
            log.info("User created successfully: {}", savedUser.getId());
            return savedUser;
        } catch (Exception e) {
            log.error("Failed to create user: {}", e.getMessage(), e);
            throw new BusinessException(500, "创建用户失败");
        }
    }
}
```

## 部署配置

### Docker配置
```dockerfile
FROM openjdk:11-jre-slim
COPY target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 生产环境配置
```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DB_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

logging:
  level:
    com.company.project: INFO
  file:
    name: /var/log/app.log
```