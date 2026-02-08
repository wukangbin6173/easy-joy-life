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
        
        // 完整的银行卡BIN码识别
        Map<String, String[]> bankMap = new HashMap<>();
        
        // 工商银行 ICBC
        bankMap.put("622202", new String[]{"工商银行", "icbc"});
        bankMap.put("622200", new String[]{"工商银行", "icbc"});
        bankMap.put("621226", new String[]{"工商银行", "icbc"});
        bankMap.put("621225", new String[]{"工商银行", "icbc"});
        bankMap.put("621558", new String[]{"工商银行", "icbc"});
        bankMap.put("621559", new String[]{"工商银行", "icbc"});
        bankMap.put("621722", new String[]{"工商银行", "icbc"});
        bankMap.put("621723", new String[]{"工商银行", "icbc"});
        bankMap.put("620058", new String[]{"工商银行", "icbc"});
        bankMap.put("620059", new String[]{"工商银行", "icbc"});
        
        // 建设银行 CCB
        bankMap.put("436742", new String[]{"建设银行", "ccb"});
        bankMap.put("622280", new String[]{"建设银行", "ccb"});
        bankMap.put("621080", new String[]{"建设银行", "ccb"});
        bankMap.put("621081", new String[]{"建设银行", "ccb"});
        bankMap.put("620060", new String[]{"建设银行", "ccb"});
        bankMap.put("620061", new String[]{"建设银行", "ccb"});
        
        // 农业银行 ABC
        bankMap.put("622848", new String[]{"农业银行", "abc"});
        bankMap.put("622849", new String[]{"农业银行", "abc"});
        bankMap.put("621336", new String[]{"农业银行", "abc"});
        bankMap.put("621619", new String[]{"农业银行", "abc"});
        bankMap.put("620062", new String[]{"农业银行", "abc"});
        
        // 中国银行 BOC
        bankMap.put("621660", new String[]{"中国银行", "boc"});
        bankMap.put("621661", new String[]{"中国银行", "boc"});
        bankMap.put("621662", new String[]{"中国银行", "boc"});
        bankMap.put("621663", new String[]{"中国银行", "boc"});
        bankMap.put("621665", new String[]{"中国银行", "boc"});
        bankMap.put("621667", new String[]{"中国银行", "boc"});
        bankMap.put("621668", new String[]{"中国银行", "boc"});
        bankMap.put("621669", new String[]{"中国银行", "boc"});
        bankMap.put("456351", new String[]{"中国银行", "boc"});
        bankMap.put("601382", new String[]{"中国银行", "boc"});
        bankMap.put("621256", new String[]{"中国银行", "boc"});
        bankMap.put("621212", new String[]{"中国银行", "boc"});
        bankMap.put("621283", new String[]{"中国银行", "boc"});
        
        // 招商银行 CMB
        bankMap.put("621286", new String[]{"招商银行", "cmb"});
        bankMap.put("621483", new String[]{"招商银行", "cmb"});
        bankMap.put("621485", new String[]{"招商银行", "cmb"});
        bankMap.put("621486", new String[]{"招商银行", "cmb"});
        bankMap.put("621299", new String[]{"招商银行", "cmb"});
        bankMap.put("621498", new String[]{"招商银行", "cmb"});
        bankMap.put("622580", new String[]{"招商银行", "cmb"});
        bankMap.put("622588", new String[]{"招商银行", "cmb"});
        bankMap.put("622598", new String[]{"招商银行", "cmb"});
        bankMap.put("622609", new String[]{"招商银行", "cmb"});
        bankMap.put("621439", new String[]{"招商银行", "cmb"});
        bankMap.put("621478", new String[]{"招商银行", "cmb"});
        bankMap.put("621479", new String[]{"招商银行", "cmb"});
        bankMap.put("621480", new String[]{"招商银行", "cmb"});
        bankMap.put("621481", new String[]{"招商银行", "cmb"});
        bankMap.put("621482", new String[]{"招商银行", "cmb"});
        bankMap.put("621487", new String[]{"招商银行", "cmb"});
        bankMap.put("621488", new String[]{"招商银行", "cmb"});
        bankMap.put("621489", new String[]{"招商银行", "cmb"});
        bankMap.put("620520", new String[]{"招商银行", "cmb"});
        
        // 交通银行 COMM
        bankMap.put("622260", new String[]{"交通银行", "comm"});
        bankMap.put("622261", new String[]{"交通银行", "comm"});
        bankMap.put("621002", new String[]{"交通银行", "comm"});
        bankMap.put("621069", new String[]{"交通银行", "comm"});
        bankMap.put("620013", new String[]{"交通银行", "comm"});
        bankMap.put("620014", new String[]{"交通银行", "comm"});
        
        // 邮储银行 PSBC
        bankMap.put("622188", new String[]{"邮储银行", "psbc"});
        bankMap.put("621096", new String[]{"邮储银行", "psbc"});
        bankMap.put("621098", new String[]{"邮储银行", "psbc"});
        bankMap.put("621285", new String[]{"邮储银行", "psbc"});
        bankMap.put("621798", new String[]{"邮储银行", "psbc"});
        bankMap.put("621799", new String[]{"邮储银行", "psbc"});
        bankMap.put("621797", new String[]{"邮储银行", "psbc"});
        bankMap.put("620529", new String[]{"邮储银行", "psbc"});
        bankMap.put("621622", new String[]{"邮储银行", "psbc"});
        bankMap.put("621599", new String[]{"邮储银行", "psbc"});
        bankMap.put("621674", new String[]{"邮储银行", "psbc"});
        bankMap.put("623218", new String[]{"邮储银行", "psbc"});
        bankMap.put("623219", new String[]{"邮储银行", "psbc"});
        
        // 兴业银行 CIB
        bankMap.put("622909", new String[]{"兴业银行", "cib"});
        bankMap.put("622908", new String[]{"兴业银行", "cib"});
        bankMap.put("622906", new String[]{"兴业银行", "cib"});
        
        // 浦发银行 SPDB
        bankMap.put("622516", new String[]{"浦发银行", "spdb"});
        bankMap.put("622517", new String[]{"浦发银行", "spdb"});
        bankMap.put("622518", new String[]{"浦发银行", "spdb"});
        bankMap.put("622521", new String[]{"浦发银行", "spdb"});
        bankMap.put("622522", new String[]{"浦发银行", "spdb"});
        bankMap.put("622523", new String[]{"浦发银行", "spdb"});
        bankMap.put("621352", new String[]{"浦发银行", "spdb"});
        bankMap.put("621793", new String[]{"浦发银行", "spdb"});
        bankMap.put("621795", new String[]{"浦发银行", "spdb"});
        bankMap.put("621796", new String[]{"浦发银行", "spdb"});
        bankMap.put("621351", new String[]{"浦发银行", "spdb"});
        bankMap.put("621390", new String[]{"浦发银行", "spdb"});
        bankMap.put("621792", new String[]{"浦发银行", "spdb"});
        bankMap.put("621791", new String[]{"浦发银行", "spdb"});
        bankMap.put("620530", new String[]{"浦发银行", "spdb"});
        
        // 中信银行 CITIC
        bankMap.put("622690", new String[]{"中信银行", "citic"});
        bankMap.put("622691", new String[]{"中信银行", "citic"});
        bankMap.put("622692", new String[]{"中信银行", "citic"});
        bankMap.put("622696", new String[]{"中信银行", "citic"});
        bankMap.put("622698", new String[]{"中信银行", "citic"});
        bankMap.put("622998", new String[]{"中信银行", "citic"});
        bankMap.put("622999", new String[]{"中信银行", "citic"});
        bankMap.put("433670", new String[]{"中信银行", "citic"});
        bankMap.put("433680", new String[]{"中信银行", "citic"});
        bankMap.put("442729", new String[]{"中信银行", "citic"});
        bankMap.put("442730", new String[]{"中信银行", "citic"});
        bankMap.put("620082", new String[]{"中信银行", "citic"});
        bankMap.put("621771", new String[]{"中信银行", "citic"});
        bankMap.put("621767", new String[]{"中信银行", "citic"});
        bankMap.put("621768", new String[]{"中信银行", "citic"});
        bankMap.put("621770", new String[]{"中信银行", "citic"});
        bankMap.put("621772", new String[]{"中信银行", "citic"});
        bankMap.put("621773", new String[]{"中信银行", "citic"});
        
        String[] bankInfo = bankMap.get(cardNoPrefix);
        if (bankInfo != null) {
            result.put("bankName", bankInfo[0]);
            result.put("bankCode", bankInfo[1]);
            result.put("cardType", "储蓄卡");
        } else {
            result.put("bankName", "未知银行");
            result.put("bankCode", "unknown");
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
