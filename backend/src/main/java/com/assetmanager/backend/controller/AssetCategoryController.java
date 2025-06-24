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

import com.assetmanager.backend.model.AssetCategory;
import com.assetmanager.backend.service.AssetCategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin/categories")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AssetCategoryController {
    private final AssetCategoryService assetCategoryService;

    @PostMapping
    public ResponseEntity<AssetCategory> create(@Valid @RequestBody AssetCategory category) {
        return ResponseEntity.ok(assetCategoryService.createCategory(category));
    }

    @GetMapping
    public ResponseEntity<List<AssetCategory>> getAllPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(assetCategoryService.getAllCategoriesPaginated(page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        assetCategoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<AssetCategory> updateCategory(@PathVariable Long id,
            @Valid @RequestBody AssetCategory updatedCategory) {
        AssetCategory category = assetCategoryService.updateCategory(id, updatedCategory);
        return ResponseEntity.ok(category);
    }

    

}
