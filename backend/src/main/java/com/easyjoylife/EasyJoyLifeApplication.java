package com.easyjoylife;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * 易享生活无人棋牌室管理系统启动类
 */
@SpringBootApplication
@MapperScan("com.easyjoylife.mapper")
@EnableAsync
@EnableScheduling
public class EasyJoyLifeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EasyJoyLifeApplication.class, args);
        System.out.println("=================================");
        System.out.println("易享生活无人棋牌室管理系统启动成功！");
        System.out.println("接口文档地址: http://localhost:8080/api/swagger-ui/index.html");
        System.out.println("=================================");
    }
}