package com.qiupai.controller;

import com.qiupai.common.ApiResponse;
import com.qiupai.entity.Room;
import com.qiupai.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * 房间控制器
 */
@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") // 允许跨域
public class RoomController {
    
    @Autowired
    private RoomService roomService;
    
    /**
     * 根据门店ID获取房间列表
     */
    @GetMapping("/store/{storeId}")
    public ApiResponse<List<Room>> getRoomsByStoreId(@PathVariable Long storeId) {
        try {
            List<Room> rooms = roomService.getRoomsByStoreId(storeId);
            return ApiResponse.success(rooms);
        } catch (Exception e) {
            return ApiResponse.error("获取房间列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 根据ID获取房间详情
     */
    @GetMapping("/{id}")
    public ApiResponse<Room> getRoomById(@PathVariable Long id) {
        try {
            Optional<Room> room = roomService.getRoomById(id);
            if (room.isPresent()) {
                return ApiResponse.success(room.get());
            } else {
                return ApiResponse.notFound("房间不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("获取房间详情失败: " + e.getMessage());
        }
    }
    
    /**
     * 获取所有有效房间
     */
    @GetMapping
    public ApiResponse<List<Room>> getAllActiveRooms() {
        try {
            List<Room> rooms = roomService.getAllActiveRooms();
            return ApiResponse.success(rooms);
        } catch (Exception e) {
            return ApiResponse.error("获取房间列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 创建房间
     */
    @PostMapping
    public ApiResponse<Room> createRoom(@RequestBody Room room) {
        try {
            Room createdRoom = roomService.createRoom(room);
            return ApiResponse.success("房间创建成功", createdRoom);
        } catch (Exception e) {
            return ApiResponse.error("创建房间失败: " + e.getMessage());
        }
    }
    
    /**
     * 更新房间
     */
    @PutMapping("/{id}")
    public ApiResponse<Room> updateRoom(@PathVariable Long id, @RequestBody Room room) {
        try {
            Room updatedRoom = roomService.updateRoom(id, room);
            if (updatedRoom != null) {
                return ApiResponse.success("房间更新成功", updatedRoom);
            } else {
                return ApiResponse.notFound("房间不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("更新房间失败: " + e.getMessage());
        }
    }
    
    /**
     * 删除房间
     */
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteRoom(@PathVariable Long id) {
        try {
            boolean deleted = roomService.deleteRoom(id);
            if (deleted) {
                return ApiResponse.success("房间删除成功");
            } else {
                return ApiResponse.notFound("房间不存在");
            }
        } catch (Exception e) {
            return ApiResponse.error("删除房间失败: " + e.getMessage());
        }
    }
    
    /**
     * 管理后台：获取所有房间（包括禁用的）
     */
    @GetMapping("/admin/all")
    public ApiResponse<List<Room>> getAllRoomsForAdmin() {
        try {
            List<Room> rooms = roomService.getAllRooms();
            return ApiResponse.success(rooms);
        } catch (Exception e) {
            return ApiResponse.error("获取房间列表失败: " + e.getMessage());
        }
    }
    
    /**
     * 管理后台：根据门店ID获取所有房间（包括禁用的）
     */
    @GetMapping("/admin/store/{storeId}")
    public ApiResponse<List<Room>> getAllRoomsByStoreIdForAdmin(@PathVariable Long storeId) {
        try {
            List<Room> rooms = roomService.getAllRoomsByStoreId(storeId);
            return ApiResponse.success(rooms);
        } catch (Exception e) {
            return ApiResponse.error("获取房间列表失败: " + e.getMessage());
        }
    }
}