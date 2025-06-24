package com.assetmanager.backend.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.assetmanager.backend.exception.CustomException;
import com.assetmanager.backend.model.AssetCategory;
import com.assetmanager.backend.repository.AssetCategoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssetCategoryService {
    private final AssetCategoryRepository repository;

    public AssetCategory createCategory(AssetCategory category) {
        if (repository.existsByName(category.getName()))
            throw new CustomException("Category already exists");
        return repository.save(category);
    }

    public List<AssetCategory> getAllCategoriesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable).getContent();
    }

    public void deleteCategory(Long id) {
        if (!repository.existsById(id))
            throw new CustomException("Category not found" + id);
        repository.deleteById(id);
    }

    public AssetCategory updateCategory(Long id, AssetCategory updatedCategory) {
        AssetCategory existing = repository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category not found"));
        existing.setName(updatedCategory.getName());
        return repository.save(existing);
    }

}
