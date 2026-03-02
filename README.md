# 🌟 LoSeven — Sosyal Etki Ağı (PearlConnect)

LÖSEV gönüllü öğrencileri için **sosyal etki takip platformu**. Gönüllülük etkinlikleri oluşturma, onaylama, topluluk paylaşımları ve gamification (rozet/puan sistemi) içerir.

---

## 🛠 Teknoloji Yığını

| Katman     | Teknoloji                          |
|------------|-------------------------------------|
| **Frontend** | Next.js 16, React, Tailwind CSS    |
| **Backend**  | Java 17, Spring Boot 3.5, Hibernate |
| **Veritabanı** | SQLite (dosya tabanlı)            |
| **Auth**     | JWT + NextAuth.js                  |

---

## 🚀 Hızlı Başlangıç (Yerel Geliştirme)

### Gereksinimler
- **Java 17+** (backend)
- **Node.js 20+** (frontend)

### 1. Backend'i Başlatın
```bash
cd backend
./mvnw spring-boot:run
```
Backend `http://localhost:8080` adresinde çalışır. İlk çalıştırmada demo veriler otomatik oluşturulur.

### 2. Frontend'i Başlatın
```bash
cd frontend
npm install
npm run dev
```
Frontend `http://localhost:3000` adresinde çalışır.

### 3. Veritabanını Sıfırlamak İçin
```bash
rm backend/pearlconnect.db
```
Backend yeniden başlatıldığında temiz demo verilerle oluşturulur.

---

## 🐳 Docker ile Çalıştırma

```bash
docker compose up --build
```

| Servis   | Adres                    |
|----------|--------------------------|
| Frontend | http://localhost:3000     |
| Backend  | http://localhost:8080     |

---

## 👥 Demo Hesaplar

Tüm hesapların şifresi: **`123456`**

### 🏢 Genel Merkez (HQ)

| E-posta               | Ad               | Rol          |
|-----------------------|------------------|--------------|
| kurum@loseven.com     | LÖSEV Genel Merkez | Genel Merkez |

### 🏫 Okullar ve İdareciler

| Okul Adı                | Tür       | Müdür E-postası            |
|--------------------------|-----------|----------------------------|
| LÖSEV Koleji Ankara      | Lise      | mudur.ankara@loseven.com   |
| LÖSEV Koleji İstanbul    | Lise      | mudur.istanbul@loseven.com |
| LÖSEV Koleji İzmir       | Ortaokul  | mudur.izmir@loseven.com    |

### 👨‍🏫 Öğretmenler (Her okulda 2 öğretmen)

| E-posta                | Ad Soyad       | Okul      |
|------------------------|----------------|-----------|
| ogretmen1@loseven.com  | Ayşe Yılmaz    | Ankara    |
| ogretmen2@loseven.com  | Mehmet Kaya    | Ankara    |
| ogretmen3@loseven.com  | Fatma Demir    | İstanbul  |
| ogretmen4@loseven.com  | Ali Çelik      | İstanbul  |
| ogretmen5@loseven.com  | Zeynep Şahin   | İzmir     |
| ogretmen6@loseven.com  | Hasan Öztürk   | İzmir     |

### 🎓 Öğrenciler (Her okulda 4 öğrenci)

| E-posta                 | Ad Soyad       | Okul      |
|-------------------------|----------------|-----------|
| ogrenci1@loseven.com    | Ece Arslan     | Ankara    |
| ogrenci2@loseven.com    | Can Polat      | Ankara    |
| ogrenci3@loseven.com    | Elif Koç       | Ankara    |
| ogrenci4@loseven.com    | Burak Aydın    | Ankara    |
| ogrenci5@loseven.com    | Selin Yıldız   | İstanbul  |
| ogrenci6@loseven.com    | Emre Tuncer    | İstanbul  |
| ogrenci7@loseven.com    | Nisa Erdoğan   | İstanbul  |
| ogrenci8@loseven.com    | Oğuz Kurt      | İstanbul  |
| ogrenci9@loseven.com    | Defne Aksoy    | İzmir     |
| ogrenci10@loseven.com   | Kaan Özkan     | İzmir     |
| ogrenci11@loseven.com   | İrem Çetin     | İzmir     |
| ogrenci12@loseven.com   | Barış Güneş    | İzmir     |

---

## 📱 Site Kullanım Kılavuzu

### Öğrenci Akışı
1. **Giriş Yap** → Öğrenci hesabıyla giriş yapın
2. **Dashboard** → Kendi etkinliklerinizi ve istatistiklerinizi görün
3. **Etkinlik Oluştur** → `+ Yeni Etkinlik Ekle` butonuyla etkinlik oluşturun
4. **Keşfet** → Onaylanan etkinlikleri görüntüleyin
5. **Ben de Oradaydım** → Bir etkinliğe katıldığınızda fotoğraf yükleyerek katılımınızı tamamlayın
6. **Topluluk** → Sosyal akışta paylaşımları görün, beğenin ve yorum yapın
7. **Profil** → Puanlarınızı, rozetlerinizi ve bağlantılarınızı görün

### Öğretmen / Okul İdaresi Akışı
1. **Giriş Yap** → Öğretmen veya müdür hesabıyla giriş yapın
2. **Dashboard** → Okulunuzdaki bekleyen etkinlikleri görün
3. **Onayla / Reddet** → Öğrencilerin etkinliklerini inceleyin ve onaylayın

### Genel Merkez (HQ) Akışı
1. **Giriş Yap** → `kurum@loseven.com` ile giriş yapın
2. **HQ Paneli** → Tüm okulların istatistiklerini, öğrenci/öğretmen sayılarını görün

### Kayıt Olma
- **Öğrenci / Öğretmen**: Ad, Soyad, E-posta, Şifre + sistemdeki okullardan birini seçin
- **Okul İdaresi**: Kurum Adı, E-posta, Şifre + Okul Türü (Ortaokul/Lise) seçin

### Gamification (Puan Sistemi)
- Etkinlik tamamlama → XP kazanma
- Fotoğraf yükleme → Ekstra XP
- **Rozetler**: İlk Adım (10 XP), Bronz İnci (25 saat), Gümüş İnci (50 saat), Altın İnci (100 saat), Platin İnci (200 saat)

---

## 📁 Proje Yapısı

```
vol2/
├── backend/                  # Spring Boot API
│   ├── src/main/java/        # Java kaynak kodları
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                 # Next.js Arayüz
│   ├── src/app/              # Sayfa bileşenleri
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml        # Docker orchestration
└── README.md                 # Bu dosya
```
