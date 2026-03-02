package com.pearlconnect.backend.config;

import com.pearlconnect.backend.entity.Badge;
import com.pearlconnect.backend.entity.School;
import com.pearlconnect.backend.entity.User;
import com.pearlconnect.backend.repository.BadgeRepository;
import com.pearlconnect.backend.repository.SchoolRepository;
import com.pearlconnect.backend.repository.UserRepository;
import com.pearlconnect.backend.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {

        private final SchoolRepository schoolRepository;
        private final UserRepository userRepository;
        private final BadgeRepository badgeRepository;
        private final PasswordEncoder passwordEncoder;

        @Bean
        public CommandLineRunner loadData() {
                return args -> {
                        List<School> schools = new java.util.ArrayList<>();

                        // ── Schools ──
                        if (schoolRepository.count() == 0) {
                                schools.add(schoolRepository.save(School.builder()
                                                .name("LÖSEV Koleji Ankara")
                                                .address("Çankaya, Ankara")
                                                .schoolType("LISE")
                                                .build()));
                                schools.add(schoolRepository.save(School.builder()
                                                .name("LÖSEV Koleji İstanbul")
                                                .address("Kadıköy, İstanbul")
                                                .schoolType("LISE")
                                                .build()));
                                schools.add(schoolRepository.save(School.builder()
                                                .name("LÖSEV Koleji İzmir")
                                                .address("Bornova, İzmir")
                                                .schoolType("ORTAOKUL")
                                                .build()));
                                System.out.println("✓ 3 demo okul oluşturuldu.");
                        } else {
                                schools = schoolRepository.findAll();
                        }

                        // ── HQ (Genel Merkez) ──
                        createUserIfNotExists("kurum@loseven.com", "LÖSEV", "Genel Merkez",
                                        Role.HQ, null);

                        // ── School Principals (Okul İdarecileri) ──
                        String[][] principals = {
                                        { "mudur.ankara@loseven.com", "Ankara Müdür", "" },
                                        { "mudur.istanbul@loseven.com", "İstanbul Müdür", "" },
                                        { "mudur.izmir@loseven.com", "İzmir Müdür", "" },
                        };
                        for (int i = 0; i < principals.length; i++) {
                                createUserIfNotExists(principals[i][0], principals[i][1], principals[i][2],
                                                Role.PRINCIPAL, schools.get(i));
                        }

                        // ── Teachers (2 per school) ──
                        String[][] teachers = {
                                        { "ogretmen1@loseven.com", "Ayşe", "Yılmaz" },
                                        { "ogretmen2@loseven.com", "Mehmet", "Kaya" },
                                        { "ogretmen3@loseven.com", "Fatma", "Demir" },
                                        { "ogretmen4@loseven.com", "Ali", "Çelik" },
                                        { "ogretmen5@loseven.com", "Zeynep", "Şahin" },
                                        { "ogretmen6@loseven.com", "Hasan", "Öztürk" },
                        };
                        for (int i = 0; i < teachers.length; i++) {
                                School school = schools.get(i / 2); // 2 teachers per school
                                createUserIfNotExists(teachers[i][0], teachers[i][1], teachers[i][2],
                                                Role.TEACHER, school);
                        }

                        // ── Students (4 per school = 12 total) ──
                        String[][] students = {
                                        // Ankara
                                        { "ogrenci1@loseven.com", "Ece", "Arslan" },
                                        { "ogrenci2@loseven.com", "Can", "Polat" },
                                        { "ogrenci3@loseven.com", "Elif", "Koç" },
                                        { "ogrenci4@loseven.com", "Burak", "Aydın" },
                                        // İstanbul
                                        { "ogrenci5@loseven.com", "Selin", "Yıldız" },
                                        { "ogrenci6@loseven.com", "Emre", "Tuncer" },
                                        { "ogrenci7@loseven.com", "Nisa", "Erdoğan" },
                                        { "ogrenci8@loseven.com", "Oğuz", "Kurt" },
                                        // İzmir
                                        { "ogrenci9@loseven.com", "Defne", "Aksoy" },
                                        { "ogrenci10@loseven.com", "Kaan", "Özkan" },
                                        { "ogrenci11@loseven.com", "İrem", "Çetin" },
                                        { "ogrenci12@loseven.com", "Barış", "Güneş" },
                        };
                        for (int i = 0; i < students.length; i++) {
                                School school = schools.get(i / 4); // 4 students per school
                                createUserIfNotExists(students[i][0], students[i][1], students[i][2],
                                                Role.STUDENT, school);
                        }

                        System.out.println("✓ Tüm demo kullanıcıları oluşturuldu.");

                        // ── Gamification Badges ──
                        if (badgeRepository.count() == 0) {
                                badgeRepository.save(Badge.builder()
                                                .name("İlk Adım")
                                                .description("Topluluğa katıldın ve ilk puanını kazandın!")
                                                .iconUrl("🌟").requiredPoints(10).requiredHours(0).build());
                                badgeRepository.save(Badge.builder()
                                                .name("Bronz İnci")
                                                .description("25 saat gönüllülük çalışması tamamlandı!")
                                                .iconUrl("🥉").requiredPoints(0).requiredHours(25).build());
                                badgeRepository.save(Badge.builder()
                                                .name("Gümüş İnci")
                                                .description("50 saat gönüllülük çalışması tamamlandı!")
                                                .iconUrl("🥈").requiredPoints(0).requiredHours(50).build());
                                badgeRepository.save(Badge.builder()
                                                .name("Altın İnci")
                                                .description("100 saat gönüllülük çalışması ile altın seviyeye ulaştın!")
                                                .iconUrl("🥇").requiredPoints(0).requiredHours(100).build());
                                badgeRepository.save(Badge.builder()
                                                .name("Platin İnci Lider")
                                                .description("200+ saat ile efsane gönüllü statüsüne ulaştın!")
                                                .iconUrl("💎").requiredPoints(0).requiredHours(200).build());
                                badgeRepository.save(Badge.builder()
                                                .name("Toplum Gönüllüsü").description("2500 puana ulaştın. Harikasın!")
                                                .iconUrl("🏆").requiredPoints(2500).requiredHours(0).build());
                                System.out.println("✓ Rozetler oluşturuldu.");
                        }
                };
        }

        private void createUserIfNotExists(String email, String firstName, String lastName,
                        Role role, School school) {
                if (userRepository.findByEmail(email).isEmpty()) {
                        userRepository.save(User.builder()
                                        .firstName(firstName)
                                        .lastName(lastName)
                                        .email(email)
                                        .password(passwordEncoder.encode("123456"))
                                        .role(role)
                                        .school(school)
                                        .level(1)
                                        .build());
                }
        }
}
