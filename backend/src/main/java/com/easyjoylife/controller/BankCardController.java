package com.easyjoylife.controller;

import com.easyjoylife.entity.BankCard;
import com.easyjoylife.service.BankCardService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/user/bank-cards")
@RequiredArgsConstructor
public class BankCardController {

    private final BankCardService bankCardService;
    private final StringRedisTemplate redisTemplate;
    
    // 开发模式：true=跳过验证码验证，false=需要验证码
    private static final boolean DEV_MODE = true;

    /**
     * 获取用户的所有银行卡
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Map<String, Object>> getBankCards(@PathVariable Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<BankCard> cards = bankCardService.getUserBankCards(userId);
            
            // 转换为前端需要的格式（不返回完整卡号）
            List<Map<String, Object>> cardList = cards.stream().map(card -> {
                Map<String, Object> cardMap = new HashMap<>();
                cardMap.put("id", card.getId());
                cardMap.put("holderName", card.getHolderName());
                
                // 解密卡号并脱敏
                String cardNo = bankCardService.decryptCardNo(card.getCardNo());
                cardMap.put("cardNo", maskCardNo(cardNo));
                
                cardMap.put("bankName", card.getBankName());
                cardMap.put("bankCode", card.getBankCode());
                cardMap.put("cardType", card.getCardType().equals("DEBIT") ? "储蓄卡" : "信用卡");
                cardMap.put("isDefault", card.getIsDefault());
                cardMap.put("status", card.getStatus());
                cardMap.put("createdTime", card.getCreatedTime().toString());
                
                return cardMap;
            }).collect(Collectors.toList());
            
            response.put("success", true);
            response.put("cards", cardList);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("获取银行卡列表失败: userId={}", userId, e);
            response.put("success", false);
            response.put("message", "获取银行卡列表失败: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 添加银行卡
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> addBankCard(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            String holderName = request.get("holderName").toString();
            String cardNo = request.get("cardNo").toString();
            String phone = request.get("phone").toString();
            String code = request.containsKey("code") ? request.get("code").toString() : null;
            Boolean isDefault = request.containsKey("isDefault") ? 
                    (Boolean) request.get("isDefault") : false;
            
            // 验证短信验证码（生产模式）
            if (!DEV_MODE) {
                if (code == null || code.isEmpty()) {
                    response.put("success", false);
                    response.put("message", "请输入验证码");
                    return ResponseEntity.ok(response);
                }
                
                String codeKey = "sms:code:" + phone + ":BIND_CARD";
                String savedCode = redisTemplate.opsForValue().get(codeKey);
                
                if (savedCode == null) {
                    response.put("success", false);
                    response.put("message", "验证码已过期");
                    return ResponseEntity.ok(response);
                }
                
                if (!savedCode.equals(code)) {
                    response.put("success", false);
                    response.put("message", "验证码错误");
                    return ResponseEntity.ok(response);
                }
                
                // 验证成功后删除验证码
                redisTemplate.delete(codeKey);
            } else {
                log.info("【开发模式】跳过验证码验证");
            }
            
            // 识别银行
            Map<String, String> bankInfo = bankCardService.identifyBank(cardNo.substring(0, 6));
            
            BankCard card = bankCardService.addBankCard(
                    userId, holderName, cardNo, phone,
                    bankInfo.get("bankName"),
                    bankInfo.get("bankCode"),
                    bankInfo.get("cardType").equals("储蓄卡") ? "DEBIT" : "CREDIT",
                    isDefault
            );
            
            response.put("success", true);
            response.put("message", "添加成功");
            response.put("cardId", card.getId());
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("添加银行卡失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 设置默认银行卡
     */
    @PostMapping("/set-default")
    public ResponseEntity<Map<String, Object>> setDefaultCard(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Long userId = Long.valueOf(request.get("userId").toString());
            Long cardId = Long.valueOf(request.get("cardId").toString());
            
            bankCardService.setDefaultCard(userId, cardId);
            
            response.put("success", true);
            response.put("message", "设置成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("设置默认银行卡失败", e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 删除银行卡
     */
    @DeleteMapping("/{cardId}")
    public ResponseEntity<Map<String, Object>> deleteBankCard(
            @PathVariable Long cardId,
            @RequestParam Long userId) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            bankCardService.deleteBankCard(userId, cardId);
            
            response.put("success", true);
            response.put("message", "删除成功");
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("删除银行卡失败: cardId={}", cardId, e);
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 识别银行
     */
    @PostMapping("/identify")
    public ResponseEntity<Map<String, Object>> identifyBank(@RequestBody Map<String, Object> request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String cardNoPrefix = request.get("cardNo").toString();
            
            Map<String, String> bankInfo = bankCardService.identifyBank(cardNoPrefix);
            
            response.put("success", true);
            response.putAll(bankInfo);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("识别银行失败", e);
            response.put("success", false);
            response.put("message", "识别失败");
            return ResponseEntity.ok(response);
        }
    }

    /**
     * 脱敏卡号
     */
    private String maskCardNo(String cardNo) {
        if (cardNo == null || cardNo.length() < 8) {
            return cardNo;
        }
        String first4 = cardNo.substring(0, 4);
        String last4 = cardNo.substring(cardNo.length() - 4);
        return first4 + " **** **** " + last4;
    }
}
