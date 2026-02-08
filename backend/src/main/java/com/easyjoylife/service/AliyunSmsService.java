package com.easyjoylife.service;

import com.aliyun.dysmsapi20170525.Client;
import com.aliyun.dysmsapi20170525.models.SendSmsRequest;
import com.aliyun.dysmsapi20170525.models.SendSmsResponse;
import com.aliyun.teaopenapi.models.Config;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AliyunSmsService {

    @Value("${aliyun.sms.access-key-id}")
    private String accessKeyId;

    @Value("${aliyun.sms.access-key-secret}")
    private String accessKeySecret;

    @Value("${aliyun.sms.sign-name}")
    private String signName;

    @Value("${aliyun.sms.template-code}")
    private String templateCode;

    @Value("${aliyun.sms.region-id:cn-hangzhou}")
    private String regionId;

    private Client client;

    /**
     * 初始化客户端
     */
    private Client getClient() throws Exception {
        if (client == null) {
            Config config = new Config()
                    .setAccessKeyId(accessKeyId)
                    .setAccessKeySecret(accessKeySecret)
                    .setEndpoint("dysmsapi.aliyuncs.com");
            client = new Client(config);
        }
        return client;
    }

    /**
     * 发送短信验证码
     * @param phone 手机号
     * @param code 验证码
     * @return 是否发送成功
     */
    public boolean sendSms(String phone, String code) {
        try {
            SendSmsRequest request = new SendSmsRequest()
                    .setPhoneNumbers(phone)
                    .setSignName(signName)
                    .setTemplateCode(templateCode)
                    .setTemplateParam("{\"code\":\"" + code + "\"}");

            SendSmsResponse response = getClient().sendSms(request);
            
            if ("OK".equals(response.getBody().getCode())) {
                log.info("短信发送成功: phone={}, requestId={}", 
                        phone, response.getBody().getRequestId());
                return true;
            } else {
                log.error("短信发送失败: phone={}, code={}, message={}", 
                        phone, response.getBody().getCode(), 
                        response.getBody().getMessage());
                return false;
            }
            
        } catch (Exception e) {
            log.error("短信发送异常: phone={}", phone, e);
            return false;
        }
    }
}
