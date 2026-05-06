package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {

    Optional<AdminUser> findByUsername(String username);

    boolean existsByUsername(String username);

    @Query("select u from AdminUser u where " +
            "(:keyword is null or lower(u.username) like lower(concat('%', :keyword, '%')) " +
            "or lower(coalesce(u.realName, '')) like lower(concat('%', :keyword, '%')) " +
            "or lower(coalesce(u.phone, '')) like lower(concat('%', :keyword, '%'))) " +
            "and (:status is null or u.status = :status)")
    Page<AdminUser> search(String keyword, String status, Pageable pageable);
}
