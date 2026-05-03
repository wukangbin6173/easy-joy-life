package com.easyjoylife.controller;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.TimeUnit;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/**
 * 文件上传接口
 * POST /api/upload/image
 * 返回可访问的图片 URL
 */
@Slf4j
@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
public class UploadController {

    @Value("${upload.base-path:/opt/uploads}")
    private String basePath;

    @Value("${upload.base-url:https://www.quexitai.com/api/upload/files}")
    private String baseUrl;

    private static final long MAX_SIZE = 10 * 1024 * 1024; // 10MB
    private static final String[] ALLOWED_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif"};
    private static final String[] ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".heic", ".heif"};

    /**
     * 上传图片
     * POST /api/upload/image
     * form-data: file=图片文件
     */
    @PostMapping("/image")
    public ResponseEntity<Map<String, Object>> uploadImage(
            @RequestParam("file") MultipartFile file) {
        Map<String, Object> response = new HashMap<>();

        // 校验文件
        if (file.isEmpty()) {
            response.put("success", false);
            response.put("message", "文件不能为空");
            return ResponseEntity.ok(response);
        }

        if (file.getSize() > MAX_SIZE) {
            response.put("success", false);
            response.put("message", "文件大小不能超过10MB");
            return ResponseEntity.ok(response);
        }

        String contentType = file.getContentType();
        String originalName = file.getOriginalFilename();
        boolean allowed = isAllowedImage(contentType, originalName);
        if (!allowed) {
            response.put("success", false);
            response.put("message", "只支持 JPG、PNG、GIF、WebP、HEIC 格式");
            return ResponseEntity.ok(response);
        }

        try {
            // 按日期分目录存储
            String dateDir = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String dir = basePath + "/" + dateDir;
            File folder = new File(dir);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            // 生成唯一文件名
            String ext = originalName != null && originalName.contains(".")
                    ? originalName.substring(originalName.lastIndexOf("."))
                    : ".jpg";
            String fileName = UUID.randomUUID().toString().replace("-", "") + ext;

            // 保存文件
            File dest = new File(dir + "/" + fileName);
            file.transferTo(dest);

            String url = baseUrl + "/" + dateDir + "/" + fileName;
            log.info("文件上传成功: {}", url);

            response.put("success", true);
            response.put("url", url);
            response.put("fileName", fileName);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("文件上传失败", e);
            response.put("success", false);
            response.put("message", "上传失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 读取已上传图片。
     * 通过后端读取 basePath，避免 nginx 静态目录和后端上传目录不一致导致 404。
     */
    @GetMapping("/files/{dateDir}/{fileName:.+}")
    public ResponseEntity<Resource> getUploadedFile(
            @PathVariable String dateDir,
            @PathVariable String fileName) {
        try {
            if (!dateDir.matches("\\d{8}") || fileName.contains("..") || fileName.contains("/") || fileName.contains("\\")) {
                return ResponseEntity.notFound().build();
            }

            Path root = Paths.get(basePath).toAbsolutePath().normalize();
            Path file = root.resolve(dateDir).resolve(fileName).normalize();
            if (!file.startsWith(root)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(file.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok()
                    .contentType(resolveMediaType(fileName))
                    .cacheControl(CacheControl.maxAge(30, TimeUnit.DAYS).cachePublic())
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                    .body(resource);
        } catch (MalformedURLException e) {
            log.warn("读取上传文件失败: {}/{}", dateDir, fileName, e);
            return ResponseEntity.notFound().build();
        }
    }

    private MediaType resolveMediaType(String fileName) {
        String lowerName = fileName.toLowerCase();
        if (lowerName.endsWith(".png")) {
            return MediaType.IMAGE_PNG;
        }
        if (lowerName.endsWith(".gif")) {
            return MediaType.IMAGE_GIF;
        }
        if (lowerName.endsWith(".webp")) {
            return MediaType.parseMediaType("image/webp");
        }
        if (lowerName.endsWith(".heic")) {
            return MediaType.parseMediaType("image/heic");
        }
        if (lowerName.endsWith(".heif")) {
            return MediaType.parseMediaType("image/heif");
        }
        return MediaType.IMAGE_JPEG;
    }

    private boolean isAllowedImage(String contentType, String originalName) {
        if (contentType != null) {
            for (String type : ALLOWED_TYPES) {
                if (type.equalsIgnoreCase(contentType)) {
                    return true;
                }
            }
        }

        if (originalName == null) {
            return false;
        }

        String lowerName = originalName.toLowerCase();
        for (String ext : ALLOWED_EXTENSIONS) {
            if (lowerName.endsWith(ext)) {
                return true;
            }
        }
        return false;
    }
}
