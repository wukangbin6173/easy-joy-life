package com.qiupai.repository;

import com.qiupai.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * 房间数据访问接口
 */
@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {
    
    /**
     * 根据门店ID查询房间
     */
    List<Room> findByStoreIdAndStatus(Long storeId, Integer status);
    
    /**
     * 根据门店ID查询所有房间（包括禁用的）
     */
    List<Room> findByStoreId(Long storeId);
    
    /**
     * 根据状态查询房间
     */
    List<Room> findByStatus(Integer status);
    
    /**
     * 根据房间类型查询
     */
    List<Room> findByTypeAndStatus(String type, Integer status);
}