package com.example.financeapp.service;

import com.example.financeapp.entity.Asset;
import java.util.List;

public interface AssetService {
    Asset createAsset(Long userId, Asset asset);
    Asset updateAsset(Long assetId, Asset asset, Long userId);
    void deleteAsset(Long assetId, Long userId);
    List<Asset> getUserAssets(Long userId);
    Asset getAssetById(Long assetId, Long userId);
}
