package com.movieapp.backend.service;

import com.movieapp.backend.dto.file.UploadFileResponse;
import com.movieapp.backend.util.error.BadRequestException;
import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import java.util.stream.Stream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Service
public class FileStorageService {

    private static final List<String> ALLOWED_IMAGE_TYPES = List.of(
            "image/jpeg",
            "image/png",
            "image/webp",
            "image/gif");

    private final Path uploadRootPath;

    public FileStorageService(@Value("${luoifilix.upload-file.base-path}") String basePath) {
        this.uploadRootPath = resolveBasePath(basePath);
    }

    public UploadFileResponse storeImage(MultipartFile file, String folder) {
        validateImage(file);

        try {
            String safeFolder = sanitizeFolder(folder);
            String extension = getExtension(file.getOriginalFilename());
            String fileName = UUID.randomUUID() + extension;

            Path targetDirectory = uploadRootPath.resolve(safeFolder).normalize();
            Files.createDirectories(targetDirectory);

            Path targetFile = targetDirectory.resolve(fileName).normalize();
            if (!targetFile.startsWith(uploadRootPath)) {
                throw new BadRequestException("Thu muc upload khong hop le");
            }

            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetFile, StandardCopyOption.REPLACE_EXISTING);
            }

            String relativePath = safeFolder.isBlank()
                    ? fileName
                    : safeFolder.replace("\\", "/") + "/" + fileName;

            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath()
                    .path("/storage/")
                    .path(relativePath)
                    .toUriString();

            return new UploadFileResponse(fileName, fileUrl, relativePath);
        } catch (IOException ex) {
            throw new BadRequestException("Khong the luu file upload");
        }
    }

    public void deleteManagedFile(String fileUrl) {
        String relativePath = extractRelativePath(fileUrl);
        if (relativePath == null) {
            return;
        }

        try {
            Path targetFile = uploadRootPath.resolve(relativePath).normalize();
            if (!targetFile.startsWith(uploadRootPath)) {
                return;
            }

            Files.deleteIfExists(targetFile);
            cleanupEmptyDirectories(targetFile.getParent());
        } catch (IOException ignored) {
            // Ignore delete failures to avoid blocking successful entity updates.
        }
    }

    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Vui long chon file can upload");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new BadRequestException("Chi ho tro upload file anh jpeg, png, webp hoac gif");
        }
    }

    private String sanitizeFolder(String folder) {
        if (!StringUtils.hasText(folder)) {
            return "";
        }

        String normalized = folder.trim().replace("\\", "/");

        if (normalized.startsWith("/") || normalized.contains("..")) {
            throw new BadRequestException("Thu muc upload khong hop le");
        }

        for (String segment : normalized.split("/")) {
            if (!segment.matches("[a-zA-Z0-9_-]+")) {
                throw new BadRequestException("Thu muc upload khong hop le");
            }
        }

        return normalized;
    }

    private String getExtension(String originalFileName) {
        if (!StringUtils.hasText(originalFileName) || !originalFileName.contains(".")) {
            return "";
        }

        String extension = originalFileName.substring(originalFileName.lastIndexOf('.'));
        return extension.replaceAll("[^a-zA-Z0-9.]", "");
    }

    private String extractRelativePath(String fileUrl) {
        if (!StringUtils.hasText(fileUrl)) {
            return null;
        }

        String normalized = fileUrl.trim().replace("\\", "/");
        String marker = "/storage/";

        int markerIndex = normalized.indexOf(marker);
        if (markerIndex >= 0) {
            String relativePath = normalized.substring(markerIndex + marker.length());
            return relativePath.isBlank() || relativePath.contains("..") ? null : relativePath;
        }

        if (normalized.startsWith("storage/")) {
            String relativePath = normalized.substring("storage/".length());
            return relativePath.isBlank() || relativePath.contains("..") ? null : relativePath;
        }

        return null;
    }

    private void cleanupEmptyDirectories(Path directory) {
        Path current = directory;

        while (current != null && !current.equals(uploadRootPath) && current.startsWith(uploadRootPath)) {
            try (Stream<Path> children = Files.list(current)) {
                if (children.findAny().isPresent()) {
                    break;
                }
            } catch (IOException ex) {
                break;
            }

            try {
                Files.deleteIfExists(current);
            } catch (IOException ex) {
                break;
            }

            current = current.getParent();
        }
    }

    private Path resolveBasePath(String basePath) {
        if (!StringUtils.hasText(basePath)) {
            throw new IllegalStateException("Upload base path is not configured");
        }

        if (basePath.startsWith("file:")) {
            return Paths.get(URI.create(basePath));
        }

        return Paths.get(basePath);
    }
}
