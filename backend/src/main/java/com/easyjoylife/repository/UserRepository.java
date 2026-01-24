package com.easyjoylife.repository;

import com.easyjoylife.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * 用户Repository
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 根据openid查找用户
     */
    Optional<User> findByOpenid(String openid);

    /**
     * 根据手机号查找用户
     */
    Optional<User> findByPhone(String phone);
}