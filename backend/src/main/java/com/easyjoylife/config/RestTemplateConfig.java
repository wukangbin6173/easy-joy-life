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

/**
 * RestTemplate 配置
 * 解决微信API返回 text/plain 但内容是 JSON 的问题
 */
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
            MediaType.TEXT_PLAIN,  // 添加 text/plain 支持
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
