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

                schoolRepository.save(School.builder()
                        .name("LÖSEV Koleji İstanbul")
                        .address("Kadıköy, İstanbul")
                        .build());

                schoolRepository.save(School.builder()
                        .name("LÖSEV Koleji İzmir")
                        .address("Bornova, İzmir")
                        .build());

                System.out.println("Demo schools created.");
            } else {
                demoSchool = schoolRepository.findAll().get(0);
            }

            // Create Gamification Badges (Points-based + Hour-based Pearl Badges)
            if (badgeRepository.count() == 0) {
                // Points-based badges
                badgeRepository.save(Badge.builder()
                        .name("İlk Adım")
                        .description("Topluluğa katıldın ve ilk puanını kazandın!")
                        .iconUrl("🌟")
                        .requiredPoints(10)
                        .requiredHours(0)
                        .build());

                // ---- Pearl Badges (Hour-based from Promp.md) ----
                badgeRepository.save(Badge.builder()
                        .name("Bronz İnci")
                        .description("25 saat gönüllülük çalışması tamamlandı!")
                        .iconUrl("🥉")
                        .requiredPoints(0)
                        .requiredHours(25)
                        .build());

                badgeRepository.save(Badge.builder()
                        .name("Gümüş İnci")
                        .description("50 saat gönüllülük çalışması tamamlandı!")
                        .iconUrl("🥈")
                        .requiredPoints(0)
                        .requiredHours(50)
                        .build());

                badgeRepository.save(Badge.builder()
                        .name("Altın İnci")
                        .description("100 saat gönüllülük çalışması ile altın seviyeye ulaştın!")
                        .iconUrl("🥇")
                        .requiredPoints(0)
                        .requiredHours(100)
                        .build());

                badgeRepository.save(Badge.builder()
                        .name("Platin İnci Lider")
                        .description("200+ saat ile efsane gönüllü statüsüne ulaştın!")
                        .iconUrl("💎")
                        .requiredPoints(0)
                        .requiredHours(200)
                        .build());

                // Points-based milestones
                badgeRepository.save(Badge.builder()
                        .name("Toplum Gönüllüsü")
                        .description("2500 puana ulaştın. Harikasın!")
                        .iconUrl("🏆")
                        .requiredPoints(2500)
                        .requiredHours(0)
                        .build());

                System.out.println("Gamification Badges created (including Pearl hour-based badges).");
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
