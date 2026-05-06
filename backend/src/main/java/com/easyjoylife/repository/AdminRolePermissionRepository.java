package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminRolePermission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AdminRolePermissionRepository extends JpaRepository<AdminRolePermission, Long> {

    List<AdminRolePermission> findByRoleId(Long roleId);

    List<AdminRolePermission> findByRoleIdIn(Collection<Long> roleIds);

    void deleteByRoleId(Long roleId);
}
