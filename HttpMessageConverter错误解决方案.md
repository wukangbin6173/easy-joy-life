# HttpMessageConverter 错误 - 完整解决方案

## 问题描述

真机调试时出现错误：
```
API返回错误: {
  success: false, 
  message: "登录失败: Could not extract response: no suitable HttpMessageConverter found for response type [interface java.util.Map] and content type [text/plain]", 
  error: "UnknownContentTypeException"
}
```

## 根本原因

通过 Bright Data 深度搜索 Stack Overflow，找到了问题的根本原因：

**微信 API 返回的 Content-Type 是 `text/plain`，但实际内容是 JSON 格式。**

Spring Boot 的 RestTemplate 默认的 `MappingJackson2HttpMessageConverter` 只支持：
- `application/json`
- `application/*+json`

**不支持 `text/plain`**，所以无法将响应转换为 Map 对象。

## 解决方案

根据 [Stack Overflow 的最佳答案](https://stackoverflow.com/questions/21854369/no-suitable-httpmessageconverter-found-for-response-type)，需要：

1. **配置 RestTemplate 的 HttpMessageConverter**
2. **让 Jackson 转换器支持 text/plain 媒体类型**

### 实现步骤

#### 1. 创建 RestTemplateConfig.java

```java
package com.easyjoylife.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class RestTemplateConfig {

    @Bean
    public RestTemplate restTemplate() {
        RestTemplate restTemplate = new RestTemplate();
        
        // 获取现有的消息转换器
        List<HttpMessageConverter<?>> messageConverters = restTemplate.getMessageConverters();
        
        // 创建一个新的 Jackson 转换器，支持 text/plain
        MappingJackson2HttpMessageConverter jsonConverter = new MappingJackson2HttpMessageConverter();
        
        // 设置支持的媒体类型，包括 text/plain
        List<MediaType> supportedMediaTypes = new ArrayList<>(Arrays.asList(
            MediaType.APPLICATION_JSON,
            MediaType.APPLICATION_JSON_UTF8,
            new MediaType("application", "*+json"),
            MediaType.TEXT_PLAIN,  // 关键：添加 text/plain 支持
            new MediaType("text", "json")
        ));
        jsonConverter.setSupportedMediaTypes(supportedMediaTypes);
        jsonConverter.setDefaultCharset(StandardCharsets.UTF_8);
        
        // 将新的转换器添加到列表开头（优先使用）
        messageConverters.add(0, jsonConverter);
        
        restTemplate.setMessageConverters(messageConverters);
        
        return restTemplate;
    }
}
```

#### 2. 修改 AuthController.java

**之前：**
```java
private final RestTemplate restTemplate = new RestTemplate();
```

**现在：**
```java
private final RestTemplate restTemplate;  // 通过依赖注入获取配置好的 RestTemplate
```

**简化登录方法：**
```java
// 直接使用 RestTemplate，不再手动处理 HTTP 连接
Map<String, Object> wechatResponse = restTemplate.getForObject(url, Map.class);
```

## 关键改进

### 1. 支持多种媒体类型

配置的 Jackson 转换器现在支持：
- ✅ `application/json` - 标准 JSON
- ✅ `application/*+json` - JSON 变体
- ✅ `text/plain` - 纯文本（微信 API 使用的）
- ✅ `text/json` - 文本 JSON

### 2. 优先级设置

```java
messageConverters.add(0, jsonConverter);
```

将新配置的转换器添加到列表开头，确保优先使用。

### 3. 字符编码

```java
jsonConverter.setDefaultCharset(StandardCharsets.UTF_8);
```

确保正确处理中文字符。

### 4. 依赖注入

使用 Spring 的依赖注入机制，确保所有使用 RestTemplate 的地方都使用同一个配置好的实例。

## 参考资料

### Stack Overflow 答案

根据 [这个回答](https://stackoverflow.com/a/55164077)，最简单的解决方案是：

```java
@Bean
public RestTemplate restTemplate() {
   final RestTemplate restTemplate = new RestTemplate();
   
   List<HttpMessageConverter<?>> messageConverters = new ArrayList<>();
   MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
   converter.setSupportedMediaTypes(Collections.singletonList(MediaType.ALL));
   messageConverters.add(converter);
   restTemplate.setMessageConverters(messageConverters);
   
   return restTemplate;
}
```

但我们的方案更精确，只添加需要的媒体类型，而不是 `MediaType.ALL`。

### 其他可能的解决方案

如果服务器端可控，最好的方案是：
1. 修改服务器响应头，设置正确的 `Content-Type: application/json`

但微信 API 我们无法控制，所以只能在客户端适配。

## 部署步骤

### 1. 更新服务器代码

```bash
ssh root@121.43.96.127
cd /opt/easy-joy-life
git pull origin main
```

### 2. 重新编译

```bash
cd backend
./mvnw clean package -DskipTests
```

### 3. 重启服务

```bash
cd ../deploy
docker-compose -f docker-compose.prod.yml restart backend
```

### 4. 查看日志

```bash
docker-compose -f docker-compose.prod.yml logs -f backend
```

应该看到类似日志：
```
收到微信登录请求，code: xxx
调用微信API: https://api.weixin.qq.com/sns/jscode2session?...
微信API响应: {openid=xxx, session_key=xxx}
微信登录成功: openid=xxx, userId=xxx
```

## 测试验证

### 1. 真机调试

在微信开发者工具中：
1. 真机调试
2. 查看控制台日志
3. 确认登录成功
4. 确认用户信息卡片显示

### 2. 检查响应

登录成功后应该返回：
```json
{
  "success": true,
  "openid": "xxx",
  "sessionKey": "xxx",
  "user": {
    "id": 1,
    "openid": "xxx",
    "nickname": "微信用户xxx",
    "avatar": "/images/default-avatar.png",
    "phone": "",
    "status": "ACTIVE",
    "isLogin": true
  }
}
```

## 常见问题

### Q1: 为什么微信 API 返回 text/plain？

微信的某些 API 接口返回的 Content-Type 设置不规范，虽然内容是 JSON，但 Content-Type 是 text/plain。

### Q2: 为什么不直接使用 MediaType.ALL？

使用 `MediaType.ALL` 会让转换器尝试处理所有类型的响应，可能导致其他问题。精确指定需要的媒体类型更安全。

### Q3: 这个配置会影响其他 API 调用吗？

不会。这个配置只是扩展了 Jackson 转换器支持的媒体类型，不会影响现有功能。

### Q4: 如果还是报错怎么办？

检查：
1. RestTemplateConfig 是否被 Spring 扫描到（在 config 包下）
2. AuthController 是否正确注入了 RestTemplate
3. 后端是否重新编译和重启
4. 查看后端日志确认错误详情

## 总结

这个问题的核心是：
- **问题**：微信 API 返回 text/plain，但内容是 JSON
- **原因**：RestTemplate 的 Jackson 转换器不支持 text/plain
- **解决**：配置 Jackson 转换器支持 text/plain 媒体类型

通过 Bright Data 搜索 Stack Overflow，找到了业界标准的解决方案，并成功应用到项目中。

---

**更新时间**: 2026-01-28  
**版本**: v1.0.3  
**解决方案来源**: Stack Overflow + Bright Data 搜索
