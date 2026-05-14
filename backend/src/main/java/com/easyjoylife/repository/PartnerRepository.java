package com.easyjoylife.repository;

import com.easyjoylife.entity.Partner;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartnerRepository extends JpaRepository<Partner, Long> {

    Optional<Partner> findByMerchantId(Long merchantId);

    boolean existsByMerchantId(Long merchantId);

    @Query("select p from Partner p where " +
            "(:keyword is null or lower(coalesce(p.merchantName,'')) like lower(concat('%',:keyword,'%'))) " +
            "and (:status is null or p.status = :status) " +
            "and (:industry is null or p.industry = :industry) " +
            "and (:salesPerson is null or p.salesPerson = :salesPerson) " +
            "order by p.createdTime desc")
    Page<Partner> search(String keyword, String status, String industry, String salesPerson, Pageable pageable);

    long countByStatus(String status);
}
