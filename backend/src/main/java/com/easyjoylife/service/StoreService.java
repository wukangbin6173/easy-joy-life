package com.easyjoylife.service;

import com.easyjoylife.entity.Store;
import com.easyjoylife.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 门店服务类
 */
@Service
public class StoreService {
    
    @Autowired
    private StoreRepository storeRepository;
    
    /**
     * 获取所有有效门店
     * 缓存10分钟，提高查询性能
     */
    @Cacheable(value = "stores", key = "'all_active'")
    public List<Store> getAllActiveStores() {
        return storeRepository.findByStatus(1);
    }
    
    /**
     * 根据ID获取门店
     * 缓存单个门店信息
     */
    @Cacheable(value = "stores", key = "'store_' + #id")
    public Optional<Store> getStoreById(Long id) {
        return storeRepository.findById(id);
    }
    
    /**
     * 搜索门店
     * 缓存搜索结果
     */
    @Cacheable(value = "stores", key = "'search_' + #keyword")
    public List<Store> searchStores(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllActiveStores();
        }
        return storeRepository.findByKeywordAndStatus(keyword.trim(), 1);
    }
    
    /**
     * 创建门店
     * 清除相关缓存
     */
    @CacheEvict(value = "stores", allEntries = true)
    public Store createStore(Store store) {
        return storeRepository.save(store);
    }
    
    /**
     * 更新门店
     * 清除相关缓存
     */
    @CacheEvict(value = "stores", allEntries = true)
    public Store updateStore(Long id, Store storeDetails) {
        Optional<Store> optionalStore = storeRepository.findById(id);
        if (optionalStore.isPresent()) {
            Store store = optionalStore.get();
            store.setName(storeDetails.getName());
            store.setAddress(storeDetails.getAddress());
            store.setLongitude(storeDetails.getLongitude());
            store.setLatitude(storeDetails.getLatitude());
            store.setPhone(storeDetails.getPhone());
            store.setDescription(storeDetails.getDescription());
            store.setImage(storeDetails.getImage());
            store.setBusinessHours(storeDetails.getBusinessHours());
            store.setFacilities(storeDetails.getFacilities());
            store.setStatus(storeDetails.getStatus());
            return storeRepository.save(store);
        }
        return null;
    }
    
    /**
     * 删除门店（软删除）
     * 清除相关缓存
     */
    @CacheEvict(value = "stores", allEntries = true)
    public boolean deleteStore(Long id) {
        Optional<Store> optionalStore = storeRepository.findById(id);
        if (optionalStore.isPresent()) {
            Store store = optionalStore.get();
            store.setStatus(0); // 软删除
            storeRepository.save(store);
            return true;
        }
        return false;
    }
    
    /**
     * 获取所有门店（包括禁用的）- 用于管理后台
     * 管理后台数据不缓存，保证实时性
     */
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }
}