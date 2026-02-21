package com.movieapp.backend.service;

import com.movieapp.backend.domain.Category;
import com.movieapp.backend.dto.Category.CategoryDTO;
import com.movieapp.backend.dto.Category.CategoryRequest;
import com.movieapp.backend.repository.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();

        // Chuyển đổi Entity sang DTO
        return categories.stream()
                .map(category -> CategoryDTO.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .slug(category.getSlug())
                        .build())
                .collect(Collectors.toList());
    }

    private CategoryDTO mapToDTO(Category category) {
        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }

    public CategoryDTO createCategory(CategoryRequest request) {
        Category category = new Category();
        category.setName(request.getName());
        category.setSlug(request.getSlug());

        Category savedCategory = categoryRepository.save(category);

        return mapToDTO(savedCategory);
    }

    public CategoryDTO updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không ..." + id));

        category.setName(request.getName());
        category.setSlug(request.getSlug());

        Category updateCategory = categoryRepository.save(category);

        return mapToDTO(updateCategory);
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("d" + id));
        categoryRepository.delete(category);
    }
}