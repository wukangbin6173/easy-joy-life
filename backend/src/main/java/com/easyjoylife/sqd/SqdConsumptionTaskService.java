package com.easyjoylife.sqd;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * 商起点 - 消费任务模块
 */
@Service
@RequiredArgsConstructor
public class SqdConsumptionTaskService {

    private final SqdClient client;

    /** 查询商户已上架的消费任务列表（支持门店过滤） */
    public SqdResponse listTasks(Long merchantId, Long storeId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("storeId", storeId);
        return client.get("/v1/consumption-tasks", params);
    }

    /** 查询消费任务详情 */
    public SqdResponse getTask(Long taskId, String externalUserId, Long merchantId) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("merchantId", merchantId);
        return client.get("/v1/consumption-tasks/" + taskId, params);
    }

    /** 查询用户跨商户的任务记录列表 */
    public SqdResponse myTasks(String externalUserId, Integer status) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("status", status);
        return client.get("/v1/consumption-tasks/my-tasks", params);
    }

    /** 查询门店任务统计 */
    public SqdResponse storeStats(Long merchantId, Long storeId) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("storeId", storeId);
        return client.get("/v1/consumption-tasks/store-stats", params);
    }

    /** 分页查询门店任务参与会员记录 */
    public SqdResponse storeParticipants(Long merchantId, Long storeId, Long taskId,
                                         Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("merchantId", merchantId);
        params.put("storeId", storeId);
        params.put("taskId", taskId);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/consumption-tasks/store-participants", params);
    }

    /** 领取任务 */
    public SqdResponse claimTask(Map<String, Object> body) {
        return client.post("/v1/consumption-tasks/claim", body);
    }

    /** 查询用户的任务记录列表（分页 + 状态筛选） */
    public SqdResponse listRecords(String externalUserId, Long merchantId, Integer status,
                                   Integer pageNo, Integer pageSize) {
        Map<String, Object> params = new HashMap<>();
        params.put("externalUserId", externalUserId);
        params.put("merchantId", merchantId);
        params.put("status", status);
        params.put("pageNo", pageNo);
        params.put("pageSize", pageSize);
        return client.get("/v1/consumption-tasks/records", params);
    }

    /** 领取任务奖励 */
    public SqdResponse claimReward(Long recordId, String externalUserId, Long merchantId) {
        return client.post("/v1/consumption-tasks/records/" + recordId
                + "/claim-reward?externalUserId=" + externalUserId
                + "&merchantId=" + merchantId, null);
    }
}
