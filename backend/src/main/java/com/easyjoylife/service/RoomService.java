package com.easyjoylife.service;

import com.easyjoylife.entity.Room;
import com.easyjoylife.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * 房间服务类
 */
@Service
public class RoomService {
    
    @Autowired
    private RoomRepository roomRepository;
    
    /**
     * 根据门店ID获取有效房间
     */
    public List<Room> getRoomsByStoreId(Long storeId) {
        return roomRepository.findByStoreIdAndStatus(storeId, 1);
    }
    
    /**
     * 根据门店ID获取所有房间（包括禁用的）- 用于管理后台
     */
    public List<Room> getAllRoomsByStoreId(Long storeId) {
        return roomRepository.findByStoreId(storeId);
    }
    
    /**
     * 根据ID获取房间
     */
    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }
    
    /**
     * 获取所有有效房间
     */
    public List<Room> getAllActiveRooms() {
        return roomRepository.findByStatus(1);
    }
    
    /**
     * 创建房间
     */
    public Room createRoom(Room room) {
        return roomRepository.save(room);
    }
    
    /**
     * 更新房间
     */
    public Room updateRoom(Long id, Room roomDetails) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setStoreId(roomDetails.getStoreId());
            room.setRoomNo(roomDetails.getRoomNo());
            room.setName(roomDetails.getName());
            room.setType(roomDetails.getType());
            room.setCapacity(roomDetails.getCapacity());
            room.setArea(roomDetails.getArea());
            room.setHourlyRate(roomDetails.getHourlyRate());
            room.setImage(roomDetails.getImage());
            room.setFacilities(roomDetails.getFacilities());
            room.setStatus(roomDetails.getStatus());
            return roomRepository.save(room);
        }
        return null;
    }
    
    /**
     * 删除房间（软删除）
     */
    public boolean deleteRoom(Long id) {
        Optional<Room> optionalRoom = roomRepository.findById(id);
        if (optionalRoom.isPresent()) {
            Room room = optionalRoom.get();
            room.setStatus(0); // 软删除
            roomRepository.save(room);
            return true;
        }
        return false;
    }
    
    /**
     * 获取所有房间（包括禁用的）- 用于管理后台
     */
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
}