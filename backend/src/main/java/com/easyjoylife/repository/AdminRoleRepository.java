package com.easyjoylife.repository;

import com.easyjoylife.entity.AdminRole;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRoleRepository extends JpaRepository<AdminRole, Long> {

    Optional<AdminRole> findByRoleCode(String roleCode);

    boolean existsByRoleCode(String roleCode);

    List<AdminRole> findByIdIn(Collection<Long> ids);

    @Query("select r from AdminRole r where " +
            "(:keyword is null or lower(r.roleCode) like lower(concat('%', :keyword, '%')) " +
            "or lower(r.roleName) like lower(concat('%', :keyword, '%'))) " +
            "and (:status is null or r.status = :status)")
    Page<AdminRole> search(String keyword, String status, Pageable pageable);
}
