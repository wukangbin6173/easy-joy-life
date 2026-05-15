package com.easyjoylife.repository;

import com.easyjoylife.entity.Promotion;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {

    @Query("select p from Promotion p where " +
            "(:status is null or p.status = :status) " +
            "and (:type is null or p.type = :type) " +
            "order by p.createdTime desc")
    Page<Promotion> search(Integer status, String type, Pageable pageable);
}
