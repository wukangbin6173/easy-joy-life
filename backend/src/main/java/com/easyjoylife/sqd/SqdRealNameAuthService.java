package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 实名认证模块
 */
@Service
@RequiredArgsConstructor
public class SqdRealNameAuthService {

    private final SqdClient client;

    /** 提交身份证进行 OCR 识别 */
    public SqdResponse submitIdCard(String idCardFrontUrl, String idCardBackUrl) {
        Map<String, Object> body = new HashMap<>();
        body.put("idCardFrontUrl", idCardFrontUrl);
        body.put("idCardBackUrl", idCardBackUrl);
        return client.post("/v1/real-name-auth/submit-id-card", body);
    }

    /** 获取人脸核身 SDK 参数 */
    public SqdResponse getFaceAuthParams(String idCardNumber) {
        Map<String, Object> params = new HashMap<>();
        params.put("idCardNumber", idCardNumber);
        return client.get("/v1/real-name-auth/face-auth-params", params);
    }

    /** 查询人脸核身结果 */
    public SqdResponse getFaceAuthResult(String orderNo) {
        Map<String, Object> params = new HashMap<>();
        params.put("orderNo", orderNo);
        return client.get("/v1/real-name-auth/face-auth-result", params);
    }

    /** 根据身份证号查询认证状态 */
    public SqdResponse getAuthStatus(String idCardNumber) {
        Map<String, Object> params = new HashMap<>();
        params.put("idCardNumber", idCardNumber);
        return client.get("/v1/real-name-auth/status", params);
    }
}
