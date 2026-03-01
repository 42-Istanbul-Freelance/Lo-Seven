package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.UUID;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

/**
 * Simple Cloudinary upload controller.
 * Uses the unsigned upload preset approach for simplicity.
 * Requires CLOUDINARY_CLOUD_NAME and CLOUDINARY_UPLOAD_PRESET in application.properties.
 */
@RestController
@RequestMapping("/api/v1/upload")
public class UploadController {

    @Value("${cloudinary.cloud-name:demo}")
    private String cloudName;

    @Value("${cloudinary.upload-preset:ml_default}")
    private String uploadPreset;

    @PostMapping
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails userDetails) {

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dosya seçilmedi."));
        }

        // Max 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dosya boyutu 10MB'ı aşamaz."));
        }

        try {
            // Create uploads directory if it doesn't exist at the project root
            Path uploadDir = Paths.get(System.getProperty("user.dir"), "uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;
            
            // Save file absolutely
            Path targetLocation = uploadDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct local full URL
            String fileUrl = ServletUriComponentsBuilder.fromCurrentContextPath().path("/uploads/").path(uniqueFilename).toUriString();

            return ResponseEntity.ok(Map.of(
                    "url", fileUrl,
                    "message", "Dosya başarıyla yüklendi."
            ));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Dosya kaydedilirken hata oluştu: " + e.getMessage()));
        }
    }

    private String extractJsonValue(String json, String key) {
        String searchKey = "\"" + key + "\":\"";
        int startIndex = json.indexOf(searchKey);
        if (startIndex == -1) return null;
        startIndex += searchKey.length();
        int endIndex = json.indexOf("\"", startIndex);
        if (endIndex == -1) return null;
        return json.substring(startIndex, endIndex);
    }
}
