package com.easyjoylife.repository;

import com.easyjoylife.entity.SystemConfig;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {

    Optional<SystemConfig> findByConfigKey(String configKey);

    boolean existsByConfigKey(String configKey);

    @Query("select c from SystemConfig c where " +
            "(:keyword is null or lower(c.configKey) like lower(concat('%', :keyword, '%')) " +
            "or lower(coalesce(c.description, '')) like lower(concat('%', :keyword, '%')))")
    Page<SystemConfig> search(String keyword, Pageable pageable);
}
