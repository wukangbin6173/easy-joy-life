package com.easyjoylife.repository;

import com.easyjoylife.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    @Query("select n from Notification n where " +
            "(:type is null or n.type = :type) " +
            "order by n.createdTime desc")
    Page<Notification> search(String type, Pageable pageable);
}
