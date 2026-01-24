package com.easyjoylife.utils;

import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ClassPathResource;

import java.io.InputStream;
import java.math.BigInteger;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;

/**
 * 证书工具类
 */
@Slf4j
public class CertificateUtils {

    /**
     * 获取证书序列号
     */
    public static String getCertificateSerialNumber(String certPath) {
        try {
            ClassPathResource resource = new ClassPathResource(certPath);
            try (InputStream inputStream = resource.getInputStream()) {
                CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
                X509Certificate certificate = (X509Certificate) certificateFactory.generateCertificate(inputStream);
                
                BigInteger serialNumber = certificate.getSerialNumber();
                String serialHex = serialNumber.toString(16).toUpperCase();
                
                log.info("证书序列号: {}", serialHex);
                log.info("证书主题: {}", certificate.getSubjectDN().getName());
                log.info("证书颁发者: {}", certificate.getIssuerDN().getName());
                log.info("证书有效期: {} 至 {}", certificate.getNotBefore(), certificate.getNotAfter());
                
                return serialHex;
            }
        } catch (Exception e) {
            log.error("读取证书序列号失败", e);
            return null;
        }
    }

    /**
     * 验证证书是否有效
     */
    public static boolean validateCertificate(String certPath) {
        try {
            ClassPathResource resource = new ClassPathResource(certPath);
            if (!resource.exists()) {
                log.error("证书文件不存在: {}", certPath);
                return false;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                CertificateFactory certificateFactory = CertificateFactory.getInstance("X.509");
                X509Certificate certificate = (X509Certificate) certificateFactory.generateCertificate(inputStream);
                
                // 检查证书是否过期
                certificate.checkValidity();
                
                log.info("证书验证通过: {}", certPath);
                return true;
            }
        } catch (Exception e) {
            log.error("证书验证失败: {}", certPath, e);
            return false;
        }
    }

    public static void main(String[] args) {
        // 测试获取证书序列号
        String serialNumber = getCertificateSerialNumber("cert/apiclient_cert.pem");
        System.out.println("商户证书序列号: " + serialNumber);
        
        // 验证证书
        boolean isValid = validateCertificate("cert/apiclient_cert.pem");
        System.out.println("证书是否有效: " + isValid);
    }
}