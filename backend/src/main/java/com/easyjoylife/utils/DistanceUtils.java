package com.easyjoylife.utils;

/**
 * 距离计算工具类
 */
public class DistanceUtils {

    private static final double EARTH_RADIUS = 6371000; // 地球半径，单位：米

    /**
     * 计算两点间距离（单位：米）
     * 使用Haversine公式
     */
    public static double getDistance(double lat1, double lng1, double lat2, double lng2) {
        double radLat1 = Math.toRadians(lat1);
        double radLat2 = Math.toRadians(lat2);
        double a = radLat1 - radLat2;
        double b = Math.toRadians(lng1) - Math.toRadians(lng2);
        
        double s = 2 * Math.asin(Math.sqrt(
                Math.pow(Math.sin(a / 2), 2) + 
                Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
        ));
        
        return s * EARTH_RADIUS;
    }

    /**
     * 格式化距离显示
     */
    public static String formatDistance(double distance) {
        if (distance < 1000) {
            return Math.round(distance) + "m";
        } else {
            return String.format("%.1fkm", distance / 1000);
        }
    }
}