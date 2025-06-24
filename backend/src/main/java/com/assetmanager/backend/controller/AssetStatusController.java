package com.assetmanager.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assetmanager.backend.model.AssetStatus;
import com.assetmanager.backend.service.AssetStatusService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/statuses")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AssetStatusController {
    private final AssetStatusService assetStatusService;

    @PostMapping
    public ResponseEntity<AssetStatus> create(@Valid @RequestBody AssetStatus status) {
        return ResponseEntity.ok(assetStatusService.createStatus(status));
    }

    @GetMapping
    public ResponseEntity<List<AssetStatus>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(assetStatusService.getAllStatusesPaginated(page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assetStatusService.deleteStatus(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetStatus> updateStatus(@PathVariable Long id,
            @Valid @RequestBody AssetStatus updatedStatus) {
        AssetStatus status = assetStatusService.updateStatus(id, updatedStatus);
        return ResponseEntity.ok(status);
    }

}
