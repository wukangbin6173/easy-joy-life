package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 商起点 - 测试接口
 */
@Service
@RequiredArgsConstructor
public class SqdTestService {

    private final SqdClient client;

    /** 连通性测试 */
    public SqdResponse ping() {
        return client.get("/test/ping", null);
    }
}
