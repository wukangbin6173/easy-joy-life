FROM openjdk:11-jre-slim

LABEL maintainer="easy-joy-life-system"

# 设置时区
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 创建应用目录
WORKDIR /app

# 复制jar包
COPY target/easy-joy-life-system-1.0.0.jar app.jar

# 创建上传目录
RUN mkdir -p /data/uploads

# 暴露端口
EXPOSE 8080

# 启动应用
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]