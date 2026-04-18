package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - App用户入网模块
 */
@Service
@RequiredArgsConstructor
public class SqdOnboardingService {

    private final SqdClient client;

    /** 为App用户发起入网申请 */
    public SqdResponse onboardAppUser(Map<String, Object> body) {
        return client.post("/v1/onboarding/app-user", body);
    }

    /** 查询App用户入网状态 */
    public SqdResponse getOnboardStatus(String externalUserId) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        return client.get("/v1/onboarding/app-user/status", params);
    }
}
