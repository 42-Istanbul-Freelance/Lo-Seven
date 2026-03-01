# PearlConnect — Proje Geliştirme Planı

Bu belge, **PearlConnect** (Sosyal Etki Ağı) projesi için geliştirmeyi adım adım yöneteceğimiz stratejik ve teknik bir plandır. `Promp.md` içerisindeki gereksinimler ve `/losev/01_LOSEV` içindeki Next.js (React 19, Tailwind CSS v4) altyapısı referans alınarak oluşturulmuştur.

## 1. Mimari ve Teknoloji Yığını (Kararlar)

Mevcut projemizde güçlü bir **Next.js** altyapısı (Boilerplate) bulunuyor. Kullanıcı tercihleri doğrultusunda aşağıdaki teknoloji yığını ile ilerlenecektir:

* **[Backend]:** Spring Boot (Java) tabanlı ayrı bir backend servisi geliştirilecektir.
* **[Veritabanı]:** Veritabanı olarak MySQL kullanılacaktır.
* **[Kimlik Doğrulama (Auth)]:** Next.js yönetimi altında kullanılacaktır.
* **[Dosya Yükleme (Storage)]:** Resim ve medya dosyaları Cloudinary üzerinde saklanacaktır.

## 2. Geliştirme Aşamaları (Fazlar)

Kararlarımızı netleştirdikten sonra aşağıdaki fazları sırasıyla uygulayacağız:

### Faz 1: Altyapı ve Veritabanı Modelleme
* Kararlaştırılan teknolojiye göre veritabanı şemasının oluşturulması (Users, Roles, Posts, Activities, Schools).
* Öğrenci, Öğretmen, Okul Müdürü ve Genel Merkez (HQ) için rol tabanlı yetkilendirme (RBAC) altyapısının kurulması.

### Faz 2: Kimlik Doğrulama ve Kullanıcı Yönetimi
* Sisteme giriş/çıkış ve kayıt sayfalarının yapılması.
* Kurumsal onay süreçlerinin ve KVKK gereği ebeveyn onayı altyapısının tasarlanması.

### Faz 3: Gönüllülük & Aktivite Yönetimi (Core Özellik)
* Öğrenciler için aktivite ekleme (fotoğraf/belge yükleme ile) formları.
* Saat hesaplamaları ve istatistiklerin kullanıcı profilinde gösterilmesi.

### Faz 4: Sosyal Medya Dinamikleri
* 'Interactive Feed' tasarımı: Kullanıcıların onaylanmış sosyal sorumluluk aktivitelerini post (gönderi) veya hikaye (story) olarak paylaştığı akış.
* Beğeni, yorum ve takip etme mekanizmalarının entegrasyonu.

### Faz 5: Oyunlaştırma (Gamification) ve Rozet Sistemi
* 25, 50, 100 ve 200 saatlik kilometre taşlarına göre Bronz, Gümüş, Altın ve Platin İnci rozetlerinin otomatik atanması.
* Okullara verilecek özel kurumsal unvan modülünün eklenmesi.

### Faz 6: Genel Merkez (HQ) Dashboard & Raporlama
* Türkiye geneli etki haritası ve toplam gönüllülük saati gösterimi.
* En aktif 10 öğrenci / okul listesi (Leaderboard).
* Performans dağılım grafiklerinin veri görselleştirme kütüphaneleri (örn. Recharts, Chart.js) ile oluşturulması.

---

**Not:** Lütfen yukarıdaki "Kritik Karar" maddelerindeki tercihlerinizi belirtin. Sizin yönlendirmenizle projenin temel taşlarını atarak ilk kodu (Faz 1) yazmaya başlayacağım.
