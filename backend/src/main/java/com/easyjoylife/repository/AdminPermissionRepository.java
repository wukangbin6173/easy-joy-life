package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminPermission;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminPermissionRepository extends JpaRepository<AdminPermission, Long> {

    Optional<AdminPermission> findByPermissionCode(String permissionCode);

    boolean existsByPermissionCode(String permissionCode);

    List<AdminPermission> findByIdIn(Collection<Long> ids);

    @Query("select p from AdminPermission p where " +
            "(:keyword is null or lower(p.permissionCode) like lower(concat('%', :keyword, '%')) " +
            "or lower(p.permissionName) like lower(concat('%', :keyword, '%'))) " +
            "and (:module is null or p.module = :module) " +
            "and (:status is null or p.status = :status)")
    Page<AdminPermission> search(String keyword, String module, String status, Pageable pageable);
}
