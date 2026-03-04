package com.movieapp.backend.service;

import com.movieapp.backend.domain.Category;
import com.movieapp.backend.dto.Category.CategoryDTO;
import com.movieapp.backend.dto.Category.CategoryRequest;
import com.movieapp.backend.dto.Meta;
import com.movieapp.backend.dto.ResultPaginationDTO;
import com.movieapp.backend.repository.CategoryRepository;
import com.movieapp.backend.util.error.BadRequestException;
import com.movieapp.backend.util.error.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    // ===============================
    // GET ALL CATEGORY (pagination)
    // ===============================
    public ResultPaginationDTO getAllCategories(
            Specification<Category> spec,
            Pageable pageable) {

        Page<Category> pageCategory = categoryRepository.findAll(spec, pageable);

        ResultPaginationDTO rs = new ResultPaginationDTO();
        Meta mt = new Meta();

        mt.setPage(pageable.getPageNumber() + 1);
        mt.setPageSize(pageable.getPageSize());
        mt.setPages(pageCategory.getTotalPages());
        mt.setTotal(pageCategory.getTotalElements());

        rs.setMeta(mt);

        rs.setResult(pageCategory.map(this::mapToDTO).getContent());

        return rs;
    }

    // ===============================
    // GET CATEGORY BY ID
    // ===============================
    public CategoryDTO getCategoryById(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category id = " + id));

        return mapToDTO(category);
    }

    // ===============================
    // CREATE CATEGORY
    // ===============================
    public CategoryDTO createCategory(CategoryRequest request) {

        Map<String, String> errors = new HashMap<>();

        if (categoryRepository.existsBySlug(request.getSlug())) {
            errors.put("slug", "Slug đã tồn tại");
        }

        if (!errors.isEmpty()) {
            throw new BadRequestException(errors.toString());
        }

        Category category = new Category();

        category.setName(request.getName());
        category.setSlug(request.getSlug());

        return mapToDTO(categoryRepository.save(category));
    }

    // ===============================
    // UPDATE CATEGORY
    // ===============================
    public CategoryDTO updateCategory(Long id, CategoryRequest request) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category id = " + id));

        if (!category.getSlug().equals(request.getSlug())
                && categoryRepository.existsBySlug(request.getSlug())) {

            throw new BadRequestException("Slug đã tồn tại");
        }

        category.setName(request.getName());
        category.setSlug(request.getSlug());

        return mapToDTO(categoryRepository.save(category));
    }

    // ===============================
    // DELETE CATEGORY
    // ===============================
    public void deleteCategory(Long id) {

        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy category id = " + id));

        categoryRepository.delete(category);
    }

    // ===============================
    // MAPPER
    // ===============================
    private CategoryDTO mapToDTO(Category category) {

        return CategoryDTO.builder()
                .id(category.getId())
                .name(category.getName())
                .slug(category.getSlug())
                .build();
    }
}