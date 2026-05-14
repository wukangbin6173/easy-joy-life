package com.easyjoylife.controller;

import com.easyjoylife.common.ApiResponse;
import com.easyjoylife.entity.Partner;
import com.easyjoylife.repository.PartnerRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

/**
 * 管理后台 - 商家拓展管理
 */
@Slf4j
@RestController
@RequestMapping("/api/admin/partners")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AdminPartnerController {

    private final PartnerRepository partnerRepository;

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String industry,
            @RequestParam(required = false) String salesPerson,
            @RequestParam(defaultValue = "1") int pageNo,
            @RequestParam(defaultValue = "20") int pageSize) {
        Page<Partner> page = partnerRepository.search(
                emptyToNull(keyword), emptyToNull(status), emptyToNull(industry), emptyToNull(salesPerson),
                PageRequest.of(Math.max(pageNo - 1, 0), pageSize));
        return ResponseEntity.ok(ApiResponse.success(pageData(page)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Partner>> create(@RequestBody Map<String, Object> request) {
        try {
            Long merchantId = requiredLong(request, "merchantId");
            if (partnerRepository.existsByMerchantId(merchantId)) {
                return ResponseEntity.ok(ApiResponse.badRequest("该商户已录入"));
            }
            Partner partner = new Partner();
            partner.setMerchantId(merchantId);
            fillPartner(partner, request);
            Partner saved = partnerRepository.save(partner);
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @PutMapping("/{merchantId}")
    public ResponseEntity<ApiResponse<Partner>> update(
            @PathVariable Long merchantId,
            @RequestBody Map<String, Object> request) {
        try {
            Partner partner = partnerRepository.findByMerchantId(merchantId)
                    .orElseThrow(() -> new IllegalArgumentException("合作商家不存在"));
            fillPartner(partner, request);
            Partner saved = partnerRepository.save(partner);
            return ResponseEntity.ok(ApiResponse.success(saved));
        } catch (Exception e) {
            return ResponseEntity.ok(ApiResponse.badRequest(e.getMessage()));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> statistics() {
        Map<String, Object> data = new HashMap<>();
        data.put("total", partnerRepository.count());
        data.put("active", partnerRepository.countByStatus("active"));
        data.put("pending", partnerRepository.countByStatus("pending"));
        data.put("suspended", partnerRepository.countByStatus("suspended"));
        return ResponseEntity.ok(ApiResponse.success(data));
    }

    private void fillPartner(Partner partner, Map<String, Object> request) {
        if (request.containsKey("merchantName")) partner.setMerchantName(readText(request, "merchantName"));
        if (request.containsKey("industry")) partner.setIndustry(readText(request, "industry"));
        if (request.containsKey("storeCount")) partner.setStoreCount(readInt(request, "storeCount"));
        if (request.containsKey("status")) partner.setStatus(readText(request, "status"));
        if (request.containsKey("salesPerson")) partner.setSalesPerson(readText(request, "salesPerson"));
        if (request.containsKey("commissionRate")) partner.setCommissionRate(readInt(request, "commissionRate"));
        if (request.containsKey("contractStartDate")) partner.setContractStartDate(readDate(request, "contractStartDate"));
        if (request.containsKey("contractEndDate")) partner.setContractEndDate(readDate(request, "contractEndDate"));
        if (request.containsKey("contactName")) partner.setContactName(readText(request, "contactName"));
        if (request.containsKey("contactPhone")) partner.setContactPhone(readText(request, "contactPhone"));
        if (request.containsKey("remark")) partner.setRemark(readText(request, "remark"));
    }

    private Map<String, Object> pageData(Page<?> page) {
        Map<String, Object> data = new HashMap<>();
        data.put("list", page.getContent());
        data.put("pageNo", page.getNumber() + 1);
        data.put("pageSize", page.getSize());
        data.put("total", page.getTotalElements());
        data.put("totalPages", page.getTotalPages());
        return data;
    }

    private Long requiredLong(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null) throw new IllegalArgumentException(key + "不能为空");
        return Long.valueOf(value.toString().trim());
    }

    private String readText(Map<String, Object> request, String key) {
        Object value = request.get(key);
        return value == null ? null : value.toString().trim();
    }

    private Integer readInt(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null) return null;
        return Integer.valueOf(value.toString().trim());
    }

    private LocalDate readDate(Map<String, Object> request, String key) {
        Object value = request.get(key);
        if (value == null || value.toString().trim().isEmpty()) return null;
        return LocalDate.parse(value.toString().trim());
    }

    private String emptyToNull(String value) {
        return value == null || value.trim().isEmpty() ? null : value.trim();
    }
}
