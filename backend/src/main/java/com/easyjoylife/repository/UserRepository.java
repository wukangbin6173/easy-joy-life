package com.easyjoylife.repository;

import com.easyjoylife.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
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

    /**
     * 搜索用户（管理后台）
     */
    @Query("select u from User u where " +
            "(:keyword is null or lower(coalesce(u.nickname,'')) like lower(concat('%',:keyword,'%')) " +
            "or lower(coalesce(u.phone,'')) like lower(concat('%',:keyword,'%'))) " +
            "and (:status is null or u.status = :status)")
    Page<User> search(String keyword, String status, Pageable pageable);

    long countByCreatedTimeAfter(LocalDateTime time);

    long countByLastLoginTimeAfter(LocalDateTime time);
}