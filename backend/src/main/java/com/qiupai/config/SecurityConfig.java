package com.qiupai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * Spring Security配置
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // 禁用CSRF保护
            .csrf().disable()
            // 允许所有请求
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()
            )
            // 禁用表单登录
            .formLogin().disable()
            // 禁用HTTP Basic认证
            .httpBasic().disable();
            
        return http.build();
    }
}