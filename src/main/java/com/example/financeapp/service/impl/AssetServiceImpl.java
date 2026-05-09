package com.example.financeapp.service.impl;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.entity.User;
import com.example.financeapp.repository.AssetRepository;
import com.example.financeapp.service.AssetService;
import com.example.financeapp.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements AssetService {

    private final AssetRepository assetRepository;
    private final UserService userService;

    @Override
    @Transactional
    public Asset createAsset(Long userId, Asset asset) {
        User user = userService.getUserById(userId);
        asset.setUser(user);
        return assetRepository.save(asset);
    }

    @Override
    @Transactional
    public Asset updateAsset(Long assetId, Asset assetDetails, Long userId) {
        Asset existingAsset = getAssetById(assetId, userId);
        
        existingAsset.setName(assetDetails.getName());
        existingAsset.setType(assetDetails.getType());
        existingAsset.setValue(assetDetails.getValue());
        
        return assetRepository.save(existingAsset);
    }

    @Override
    @Transactional
    public void deleteAsset(Long assetId, Long userId) {
        Asset asset = getAssetById(assetId, userId);
        assetRepository.delete(asset);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Asset> getUserAssets(Long userId) {
        return assetRepository.findByUserId(userId);
    }

    @Override
    @Transactional(readOnly = true)
    public Asset getAssetById(Long assetId, Long userId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new RuntimeException("Asset not found"));
        
        if (!asset.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to access this asset");
        }
        
        return asset;
    }
}
