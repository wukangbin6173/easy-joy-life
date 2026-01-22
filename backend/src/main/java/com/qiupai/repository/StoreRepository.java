package com.qiupai.repository;

import com.qiupai.entity.Store;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 门店数据访问接口
 */
@Repository
public interface StoreRepository extends JpaRepository<Store, Long> {
    
    /**
     * 根据状态查询门店
     */
    List<Store> findByStatus(Integer status);
    
    /**
     * 根据名称模糊查询门店
     */
    List<Store> findByNameContainingAndStatus(String name, Integer status);
    
    /**
     * 根据地址模糊查询门店
     */
    List<Store> findByAddressContainingAndStatus(String address, Integer status);
    
    /**
     * 根据名称或地址模糊查询门店
     */
    @Query("SELECT s FROM Store s WHERE (s.name LIKE %:keyword% OR s.address LIKE %:keyword%) AND s.status = :status")
    List<Store> findByKeywordAndStatus(@Param("keyword") String keyword, @Param("status") Integer status);
}