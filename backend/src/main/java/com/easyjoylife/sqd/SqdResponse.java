package com.easyjoylife.sqd;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import java.util.List;
import java.util.Map;

/**
 * 商起点统一响应
 */
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class SqdResponse {

    private int code;
    private String msg;
    private Object data;

    public boolean isSuccess() {
        return code == 0;
    }

    /**
     * 获取 data 作为 Map
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object> getDataAsMap() {
        if (data instanceof Map) {
            return (Map<String, Object>) data;
        }
        return null;
    }

    /**
     * 获取分页列表
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> getList() {
        Map<String, Object> map = getDataAsMap();
        if (map != null && map.containsKey("list")) {
            return (List<Map<String, Object>>) map.get("list");
        }
        return null;
    }

    /**
     * 获取分页总数
     */
    public Integer getTotal() {
        Map<String, Object> map = getDataAsMap();
        if (map != null && map.containsKey("total")) {
            return ((Number) map.get("total")).intValue();
        }
        return null;
    }

    public static SqdResponse error(String msg) {
        SqdResponse resp = new SqdResponse();
        resp.setCode(-1);
        resp.setMsg(msg);
        return resp;
    }
}
