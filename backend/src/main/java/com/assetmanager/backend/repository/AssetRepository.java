package com.assetmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assetmanager.backend.model.Asset;
import com.assetmanager.backend.model.User;

public interface AssetRepository extends JpaRepository<Asset, Long> {
    org.springframework.data.domain.Page<Asset> findByUser(User user,
            org.springframework.data.domain.Pageable pageable);

    long countByUser(User user);

    boolean existsByCategoryId(Long categoryId);

}
