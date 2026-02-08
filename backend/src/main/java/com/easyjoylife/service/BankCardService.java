package com.easyjoylife.service;

import com.easyjoylife.entity.BankCard;
import com.easyjoylife.repository.BankCardRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BankCardService {

    private final BankCardRepository bankCardRepository;
    
    // AES加密密钥（实际应该从配置文件读取）
    private static final String AES_KEY = "EasyJoyLife12345"; // 16字节密钥
    
    /**
     * 获取用户的所有银行卡
     */
    public List<BankCard> getUserBankCards(Long userId) {
        return bankCardRepository.findByUserIdOrderByIsDefaultDescCreatedTimeDesc(userId);
    }
    
    /**
     * 添加银行卡
     */
    @Transactional
    public BankCard addBankCard(Long userId, String holderName, String cardNo, 
                                 String phone, String bankName, String bankCode, 
                                 String cardType, Boolean isDefault) {
        
        // 检查银行卡数量限制（最多5张）
        long count = bankCardRepository.countByUserId(userId);
        if (count >= 5) {
            throw new RuntimeException("最多只能添加5张银行卡");
        }
        
        // 加密卡号
        String encryptedCardNo = encryptCardNo(cardNo);
        
        // 检查卡号是否已存在
        Optional<BankCard> existing = bankCardRepository.findByCardNo(encryptedCardNo);
        if (existing.isPresent()) {
            throw new RuntimeException("该银行卡已添加");
        }
        
        // 如果是第一张卡或设置为默认，需要处理默认卡逻辑
        if (isDefault || count == 0) {
            // 取消其他默认卡
            Optional<BankCard> currentDefault = bankCardRepository.findByUserIdAndIsDefaultTrue(userId);
            currentDefault.ifPresent(card -> {
                card.setIsDefault(false);
                bankCardRepository.save(card);
            });
            isDefault = true;
        }
        
        // 创建银行卡
        BankCard bankCard = new BankCard();
        bankCard.setUserId(userId);
        bankCard.setHolderName(holderName);
        bankCard.setCardNo(encryptedCardNo);
        bankCard.setBankName(bankName);
        bankCard.setBankCode(bankCode);
        bankCard.setCardType(cardType);
        bankCard.setPhone(phone);
        bankCard.setIsDefault(isDefault);
        bankCard.setStatus(BankCard.Status.ACTIVE);
        
        return bankCardRepository.save(bankCard);
    }
    
    /**
     * 设置默认银行卡
     */
    @Transactional
    public void setDefaultCard(Long userId, Long cardId) {
        // 检查卡是否属于该用户
        BankCard card = bankCardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new RuntimeException("银行卡不存在"));
        
        // 取消其他默认卡
        Optional<BankCard> currentDefault = bankCardRepository.findByUserIdAndIsDefaultTrue(userId);
        currentDefault.ifPresent(defaultCard -> {
            if (!defaultCard.getId().equals(cardId)) {
                defaultCard.setIsDefault(false);
                bankCardRepository.save(defaultCard);
            }
        });
        
        // 设置新的默认卡
        card.setIsDefault(true);
        bankCardRepository.save(card);
    }
    
    /**
     * 删除银行卡
     */
    @Transactional
    public void deleteBankCard(Long userId, Long cardId) {
        BankCard card = bankCardRepository.findByIdAndUserId(cardId, userId)
                .orElseThrow(() -> new RuntimeException("银行卡不存在"));
        
        // 如果是默认卡，需要先设置其他卡为默认
        if (card.getIsDefault()) {
            List<BankCard> otherCards = bankCardRepository.findByUserIdOrderByIsDefaultDescCreatedTimeDesc(userId);
            if (otherCards.size() > 1) {
                // 找到第一张非当前卡的卡，设为默认
                otherCards.stream()
                        .filter(c -> !c.getId().equals(cardId))
                        .findFirst()
                        .ifPresent(c -> {
                            c.setIsDefault(true);
                            bankCardRepository.save(c);
                        });
            }
        }
        
        bankCardRepository.delete(card);
    }
    
    /**
     * 识别银行（根据卡号前6位）
     */
    public Map<String, String> identifyBank(String cardNoPrefix) {
        Map<String, String> result = new HashMap<>();
        
        // 简单的银行识别逻辑（实际应该查询银行卡BIN库）
        Map<String, String[]> bankMap = new HashMap<>();
        bankMap.put("622202", new String[]{"工商银行", "ICBC"});
        bankMap.put("622200", new String[]{"工商银行", "ICBC"});
        bankMap.put("621226", new String[]{"农业银行", "ABC"});
        bankMap.put("622848", new String[]{"农业银行", "ABC"});
        bankMap.put("622700", new String[]{"建设银行", "CCB"});
        bankMap.put("436742", new String[]{"建设银行", "CCB"});
        bankMap.put("621098", new String[]{"中国银行", "BOC"});
        bankMap.put("621790", new String[]{"中国银行", "BOC"});
        bankMap.put("622588", new String[]{"招商银行", "CMB"});
        bankMap.put("621286", new String[]{"招商银行", "CMB"});
        
        String[] bankInfo = bankMap.get(cardNoPrefix);
        if (bankInfo != null) {
            result.put("bankName", bankInfo[0]);
            result.put("bankCode", bankInfo[1]);
            result.put("cardType", "储蓄卡");
        } else {
            result.put("bankName", "未知银行");
            result.put("bankCode", "UNKNOWN");
            result.put("cardType", "储蓄卡");
        }
        
        return result;
    }
    
    /**
     * 加密卡号
     */
    private String encryptCardNo(String cardNo) {
        try {
            SecretKeySpec key = new SecretKeySpec(AES_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.ENCRYPT_MODE, key);
            byte[] encrypted = cipher.doFinal(cardNo.getBytes());
            return Base64.getEncoder().encodeToString(encrypted);
        } catch (Exception e) {
            log.error("加密卡号失败", e);
            throw new RuntimeException("加密失败");
        }
    }
    
    /**
     * 解密卡号
     */
    public String decryptCardNo(String encryptedCardNo) {
        try {
            SecretKeySpec key = new SecretKeySpec(AES_KEY.getBytes(), "AES");
            Cipher cipher = Cipher.getInstance("AES");
            cipher.init(Cipher.DECRYPT_MODE, key);
            byte[] decrypted = cipher.doFinal(Base64.getDecoder().decode(encryptedCardNo));
            return new String(decrypted);
        } catch (Exception e) {
            log.error("解密卡号失败", e);
            throw new RuntimeException("解密失败");
        }
    }
}
