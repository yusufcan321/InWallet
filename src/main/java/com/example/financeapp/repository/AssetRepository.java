package com.example.financeapp.repository;

import com.example.financeapp.entity.Asset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {
    List<Asset> findByUserId(Long userId);
    List<Asset> findByUserIdAndType(Long userId, Asset.AssetType type);
}
