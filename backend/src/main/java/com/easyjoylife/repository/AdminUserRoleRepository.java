package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminUserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AdminUserRoleRepository extends JpaRepository<AdminUserRole, Long> {

    List<AdminUserRole> findByAdminUserId(Long adminUserId);

    List<AdminUserRole> findByAdminUserIdIn(Collection<Long> adminUserIds);

    void deleteByAdminUserId(Long adminUserId);
}
