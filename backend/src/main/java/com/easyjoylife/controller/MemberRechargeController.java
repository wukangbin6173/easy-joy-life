package com.easyjoylife.controller;

import com.easyjoylife.sqd.SqdMemberService;
import com.easyjoylife.sqd.SqdResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

/**
 * 商户会员充值控制器
 *
 * 充值流程：
 * 1. 用户先通过微信/支付宝把钱充进小程序钱包（RechargeController 负责）
 * 2. 用户选择商户，用钱包余额充值到商起点对应商户的会员余额
 */
@Slf4j
@RestController
@RequestMapping("/api/member/recharge")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MemberRechargeController {

    private final SqdMemberService sqdMemberService;

    /**
     * 加入商户会员（充值前确保用户是该商户会员）
     * POST /api/member/recharge/join
     * body: { merchantId, externalUserId, storeId(可选) }
     */
    @PostMapping("/join")
    public ResponseEntity<Map<String, Object>> joinMember(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long merchantId = Long.valueOf(request.get("merchantId").toString());
            String externalUserId = request.get("externalUserId").toString();
            Long storeId = request.containsKey("storeId") && request.get("storeId") != null
                    ? Long.valueOf(request.get("storeId").toString()) : null;

            SqdResponse sqd = sqdMemberService.join(merchantId, externalUserId, storeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("加入会员失败", e);
            response.put("success", false);
            response.put("message", "加入会员失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询会员信息
     * GET /api/member/recharge/info?merchantId=&externalUserId=
     */
    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getMemberInfo(
            @RequestParam Long merchantId,
            @RequestParam String externalUserId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMemberService.getMember(merchantId, externalUserId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询会员信息失败", e);
            response.put("success", false);
            response.put("message", "查询会员信息失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 直接充值到商户会员余额（通过商起点收银台）
     * POST /api/member/recharge/to-merchant
     *
     * body: {
     *   memberId,      // 商起点会员ID
     *   merchantId,    // 商户ID
     *   amount,        // 充值金额（分）
     *   returnUrl      // 支付完成跳转地址
     * }
     *
     * 流程：用户 → 商起点收银台 → 商户会员余额（合规，不经过小程序钱包中转）
     */
    @PostMapping("/to-merchant")
    public ResponseEntity<Map<String, Object>> toMerchant(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        try {
            Long memberId = Long.valueOf(request.get("memberId").toString());
            Long merchantId = Long.valueOf(request.get("merchantId").toString());
            Integer amountFen = Integer.valueOf(request.get("amount").toString());
            String returnUrl = request.getOrDefault("returnUrl", "").toString();

            log.info("充值到商户: memberId={}, merchantId={}, amount={}分", memberId, merchantId, amountFen);

            // 1. 创建充值单
            Map<String, Object> rechargeBody = new HashMap<>();
            rechargeBody.put("memberId", memberId);
            rechargeBody.put("merchantId", merchantId);
            rechargeBody.put("amount", amountFen);

            SqdResponse rechargeResp = sqdMemberService.createRecharge(memberId, rechargeBody);
            if (!rechargeResp.isSuccess()) {
                response.put("success", false);
                response.put("message", "创建充值单失败: " + rechargeResp.getMsg());
                return ResponseEntity.ok(response);
            }

            Map<String, Object> rechargeData = rechargeResp.getDataAsMap();
            Long rechargeId = Long.valueOf(rechargeData.get("id").toString());
            log.info("充值单创建成功: rechargeId={}", rechargeId);

            // 2. 唤起收银台
            Map<String, Object> cashierBody = new HashMap<>();
            cashierBody.put("returnUrl", returnUrl);
            cashierBody.put("expireMinutes", 30);

            SqdResponse cashierResp = sqdMemberService.rechargeCashier(rechargeId, cashierBody);
            if (!cashierResp.isSuccess()) {
                response.put("success", false);
                response.put("message", "唤起收银台失败: " + cashierResp.getMsg());
                return ResponseEntity.ok(response);
            }

            Map<String, Object> cashierData = cashierResp.getDataAsMap();
            response.put("success", true);
            response.put("rechargeId", rechargeId);
            response.put("cashierUrl", cashierData.get("cashierUrl"));
            response.put("token", cashierData.get("token"));

            log.info("收银台创建成功: rechargeId={}", rechargeId);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("充值到商户失败", e);
            response.put("success", false);
            response.put("message", "充值失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询充值单状态
     * GET /api/member/recharge/status/{rechargeId}
     */
    @GetMapping("/status/{rechargeId}")
    public ResponseEntity<Map<String, Object>> getRechargeStatus(@PathVariable Long rechargeId) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMemberService.getRecharge(rechargeId);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询充值状态失败: rechargeId={}", rechargeId, e);
            response.put("success", false);
            response.put("message", "查询充值状态失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 查询会员余额流水
     * GET /api/member/recharge/transactions/{memberId}
     */
    @GetMapping("/transactions/{memberId}")
    public ResponseEntity<Map<String, Object>> getTransactions(
            @PathVariable Long memberId,
            @RequestParam(required = false) Integer transactionType,
            @RequestParam(required = false) Integer balanceType,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMemberService.listTransactions(
                    memberId, transactionType, balanceType, pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询余额流水失败: memberId={}", memberId, e);
            response.put("success", false);
            response.put("message", "查询余额流水失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 跨商户会员余额列表（用户在所有商户的余额）
     * GET /api/member/recharge/list?externalUserId=
     */
    @GetMapping("/list")
    public ResponseEntity<Map<String, Object>> listMembers(
            @RequestParam String externalUserId,
            @RequestParam(required = false) String merchantName,
            @RequestParam(defaultValue = "1") Integer pageNo,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        Map<String, Object> response = new HashMap<>();
        try {
            SqdResponse sqd = sqdMemberService.listMembers(
                    externalUserId, merchantName, pageNo, pageSize);
            if (sqd.isSuccess()) {
                response.put("success", true);
                response.put("data", sqd.getData());
            } else {
                response.put("success", false);
                response.put("message", sqd.getMsg());
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("查询会员列表失败", e);
            response.put("success", false);
            response.put("message", "查询会员列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }
}
