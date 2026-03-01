package com.pearlconnect.backend.config;

import com.pearlconnect.backend.entity.Badge;
import com.pearlconnect.backend.entity.School;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.BadgeRepository;
import com.pearlconnect.backend.repository.SchoolRepository;
import com.pearlconnect.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

    private final SchoolRepository schoolRepository;
    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;

    @Bean
    public CommandLineRunner loadData() {
        return args -> {
            School demoSchool;
            if (schoolRepository.count() == 0) {
                demoSchool = School.builder()
                        .name("LÖSEV Koleji Ankara")
                        .address("Çankaya, Ankara")
                        .build();
                demoSchool = schoolRepository.save(demoSchool);
                System.out.println("Demo school created: LÖSEV Koleji Ankara");
            } else {
                demoSchool = schoolRepository.findAll().get(0);
            }

            // Create initial Gamification Badges
            if (badgeRepository.count() == 0) {
                badgeRepository.save(Badge.builder()
                        .name("İlk Adım")
                        .description("Topluluğa katıldın ve ilk puanını kazandın!")
                        .iconUrl("🌟") // Emoji as temporary icon
                        .requiredPoints(10)
                        .build());
                        
                badgeRepository.save(Badge.builder()
                        .name("Gönüllü Çırağı")
                        .description("10 saatlik gönüllülük barajını aştın.")
                        .iconUrl("🥉")
                        .requiredPoints(500) // 10 hours * 50 points
                        .build());
                        
                badgeRepository.save(Badge.builder()
                        .name("Toplum Gönüllüsü")
                        .description("50 saatlik dev baraj! Harikasın.")
                        .iconUrl("🥇")
                        .requiredPoints(2500) // 50 hours * 50 points
                        .build());
                System.out.println("Default Gamification Badges created.");
            }

            // Fix old users that don't have a school
            List<User> usersWithoutSchool = userRepository.findAll().stream()
                    .filter(u -> u.getSchool() == null)
                    .toList();
            
            for (User user : usersWithoutSchool) {
                user.setSchool(demoSchool);
                userRepository.save(user);
                System.out.println("Assigned Demo School to existing user: " + user.getEmail());
            }
        };
    }
}
