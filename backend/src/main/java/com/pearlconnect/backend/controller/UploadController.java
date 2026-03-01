package com.pearlconnect.backend.controller;

import com.pearlconnect.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Map;
import java.util.UUID;

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
            String boundary = UUID.randomUUID().toString();
            String cloudinaryUrl = "https://api.cloudinary.com/v1_1/" + cloudName + "/image/upload";

            URL url = new URL(cloudinaryUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setDoOutput(true);
            conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);

            OutputStream os = conn.getOutputStream();
            PrintWriter writer = new PrintWriter(new OutputStreamWriter(os, "UTF-8"), true);

            // Upload preset field
            writer.append("--").append(boundary).append("\r\n");
            writer.append("Content-Disposition: form-data; name=\"upload_preset\"\r\n\r\n");
            writer.append(uploadPreset).append("\r\n");

            // File field
            writer.append("--").append(boundary).append("\r\n");
            writer.append("Content-Disposition: form-data; name=\"file\"; filename=\"")
                    .append(file.getOriginalFilename()).append("\"\r\n");
            writer.append("Content-Type: ").append(file.getContentType()).append("\r\n\r\n");
            writer.flush();

            os.write(file.getBytes());
            os.flush();

            writer.append("\r\n");
            writer.append("--").append(boundary).append("--\r\n");
            writer.flush();
            writer.close();

            int responseCode = conn.getResponseCode();
            StringBuilder response = new StringBuilder();
            BufferedReader reader;

            if (responseCode >= 200 && responseCode < 300) {
                reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));
            } else {
                reader = new BufferedReader(new InputStreamReader(conn.getErrorStream()));
            }

            String line;
            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            if (responseCode >= 200 && responseCode < 300) {
                // Parse the secure_url from JSON response (simple string extraction)
                String jsonResponse = response.toString();
                String secureUrl = extractJsonValue(jsonResponse, "secure_url");

                return ResponseEntity.ok(Map.of(
                        "url", secureUrl != null ? secureUrl : "",
                        "message", "Dosya başarıyla yüklendi."
                ));
            } else {
                return ResponseEntity.status(responseCode)
                        .body(Map.of("error", "Cloudinary yükleme hatası: " + response.toString()));
            }

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Dosya yüklenirken hata oluştu: " + e.getMessage()));
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
