package com.qiupai.config;

import com.qiupai.entity.Room;
import com.qiupai.entity.Store;
import com.qiupai.repository.RoomRepository;
import com.qiupai.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * 数据初始化组件 - MySQL版本
 */
@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private RoomRepository roomRepository;

    @Override
    public void run(String... args) throws Exception {
        // 检查是否已有数据，避免重复初始化
        if (storeRepository.count() > 0) {
            System.out.println("MySQL数据库已有数据，跳过初始化");
            System.out.println("门店数量: " + storeRepository.count());
            System.out.println("房间数量: " + roomRepository.count());
            return;
        }

        System.out.println("开始初始化MySQL数据库测试数据...");

        try {
            // 创建门店数据
            Store store1 = createStore("雀胜棋牌室(万达店)", "北京市朝阳区建国路93号万达广场3层", 
                new BigDecimal("116.447587"), new BigDecimal("39.937075"), "010-12345678", 
                "环境优雅，设施齐全的高端棋牌室", "/images/store-logo-1.jpg", 
                "09:00-02:00", "智能门锁,中央空调,免费WiFi,茶水服务,停车位");

            Store store2 = createStore("雀胜棋牌室(中心店)", "北京市海淀区中关村大街27号中关村大厦", 
                new BigDecimal("116.310316"), new BigDecimal("39.983424"), "010-87654321", 
                "科技感十足的智能棋牌室", "/images/store-logo-2.jpg", 
                "24小时营业", "智能门锁,新风系统,高速WiFi,咖啡机,充电桩");

            Store store3 = createStore("雀胜棋牌室(西单店)", "北京市西城区西单北大街120号西单商场", 
                new BigDecimal("116.366794"), new BigDecimal("39.906901"), "010-11223344", 
                "交通便利，停车方便", "/images/store-logo-3.jpg", 
                "10:00-24:00", "智能门锁,空气净化,免费WiFi,小食服务");

            Store store4 = createStore("雀胜棋牌室(国贸店)", "北京市朝阳区建国门外大街1号国贸大厦", 
                new BigDecimal("116.458564"), new BigDecimal("39.908347"), "010-55667788", 
                "商务人士首选，高端大气", "/images/store-logo-4.jpg", 
                "09:00-01:00", "智能门锁,商务设施,高速WiFi,会议室,秘书服务");

            Store store5 = createStore("雀胜棋牌室(三里屯店)", "北京市朝阳区三里屯路19号三里屯太古里", 
                new BigDecimal("116.456621"), new BigDecimal("39.937456"), "010-99887766", 
                "时尚潮流，年轻人聚集地", "/images/store-logo-5.jpg", 
                "12:00-03:00", "智能门锁,音响系统,免费WiFi,调酒服务,夜宵");

            // 创建房间数据
            // 万达店房间
            createRoom(store1.getId(), "101", "梅花厅", "麻将房", 4, new BigDecimal("80.00"), "自动麻将机,空调,茶水");
            createRoom(store1.getId(), "102", "兰花厅", "麻将房", 4, new BigDecimal("80.00"), "自动麻将机,空调,茶水");
            createRoom(store1.getId(), "103", "竹叶厅", "麻将房", 4, new BigDecimal("100.00"), "豪华自动麻将机,中央空调,高级茶具");
            createRoom(store1.getId(), "104", "菊花厅", "扑克房", 6, new BigDecimal("60.00"), "扑克桌,空调,饮料");

            // 中心店房间
            createRoom(store2.getId(), "201", "VIP包间A", "麻将房", 4, new BigDecimal("120.00"), "豪华自动麻将机,按摩椅,咖啡机");
            createRoom(store2.getId(), "202", "VIP包间B", "麻将房", 4, new BigDecimal("120.00"), "豪华自动麻将机,按摩椅,咖啡机");
            createRoom(store2.getId(), "203", "标准间C", "麻将房", 4, new BigDecimal("90.00"), "自动麻将机,空调,茶水");

            // 西单店房间
            createRoom(store3.getId(), "301", "雅致包间", "麻将房", 4, new BigDecimal("70.00"), "自动麻将机,空调,茶水,小食");
            createRoom(store3.getId(), "302", "温馨包间", "麻将房", 4, new BigDecimal("70.00"), "自动麻将机,空调,茶水,小食");

            // 国贸店房间
            createRoom(store4.getId(), "401", "商务包间A", "麻将房", 4, new BigDecimal("150.00"), "豪华麻将机,商务设施,高级茶具");
            createRoom(store4.getId(), "402", "商务包间B", "麻将房", 4, new BigDecimal("150.00"), "豪华麻将机,商务设施,高级茶具");

            // 三里屯店房间
            createRoom(store5.getId(), "501", "潮流包间", "麻将房", 4, new BigDecimal("100.00"), "智能麻将机,音响系统,调酒台");
            createRoom(store5.getId(), "502", "时尚包间", "麻将房", 4, new BigDecimal("100.00"), "智能麻将机,音响系统,调酒台");

            System.out.println("MySQL数据库测试数据初始化完成！");
            System.out.println("门店数量: " + storeRepository.count());
            System.out.println("房间数量: " + roomRepository.count());
            
        } catch (Exception e) {
            System.err.println("数据初始化失败: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private Store createStore(String name, String address, BigDecimal longitude, BigDecimal latitude, 
                             String phone, String description, String images, String businessHours, String facilities) {
        Store store = new Store();
        store.setName(name);
        store.setAddress(address);
        store.setLongitude(longitude);
        store.setLatitude(latitude);
        store.setPhone(phone);
        store.setDescription(description);
        store.setImages(images);
        store.setBusinessHours(businessHours);
        store.setFacilities(facilities);
        store.setStatus(1);
        return storeRepository.save(store);
    }

    private void createRoom(Long storeId, String roomNo, String name, String type, Integer capacity, 
                           BigDecimal pricePerHour, String facilities) {
        Room room = new Room();
        room.setStoreId(storeId);
        room.setRoomNo(roomNo);
        room.setName(name);
        room.setType(type);
        room.setCapacity(capacity);
        room.setPricePerHour(pricePerHour);
        room.setImages("/images/room-default.jpg");
        room.setFacilities(facilities);
        room.setStatus(1);
        roomRepository.save(room);
    }
}