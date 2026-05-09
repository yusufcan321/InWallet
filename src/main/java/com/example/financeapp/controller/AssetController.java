package com.example.financeapp.controller;

import com.example.financeapp.entity.Asset;
import com.example.financeapp.service.AssetService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users/{userId}/assets")
@RequiredArgsConstructor
public class AssetController {

    private final AssetService assetService;

    @PostMapping
    public ResponseEntity<Asset> createAsset(@PathVariable Long userId, @RequestBody Asset asset) {
        return new ResponseEntity<>(assetService.createAsset(userId, asset), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Asset>> getUserAssets(@PathVariable Long userId) {
        return ResponseEntity.ok(assetService.getUserAssets(userId));
    }

    @GetMapping("/{assetId}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long assetId, @PathVariable Long userId) {
        return ResponseEntity.ok(assetService.getAssetById(assetId, userId));
    }

    @PutMapping("/{assetId}")
    public ResponseEntity<Asset> updateAsset(@PathVariable Long assetId, @PathVariable Long userId, @RequestBody Asset asset) {
        return ResponseEntity.ok(assetService.updateAsset(assetId, asset, userId));
    }

    @DeleteMapping("/{assetId}")
    public ResponseEntity<Void> deleteAsset(@PathVariable Long assetId, @PathVariable Long userId) {
        assetService.deleteAsset(assetId, userId);
        return ResponseEntity.noContent().build();
    }
}
