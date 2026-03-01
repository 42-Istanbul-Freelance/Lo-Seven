# LoSeven Gönüllülük Platformu

LoSeven, LÖSEV bünyesindeki okullarda gönüllülük çalışmalarını takip etmek, onaylamak ve görselleştirmek için geliştirilmiş bir sosyal etki ağı platformudur. Öğrenciler aktivitelerini kaydeder, öğretmenler onaylar, herkes sosyal akışta paylaşır.

## Başlangıç ve Kurulum

Projeyi yerel ortamınızda çalıştırabilmek için hem backend (Spring Boot) hem de frontend (Next.js) sunucularını ayağa kaldırmanız gerekmektedir. 

### 1. Veritabanı ve Backend Kurulumu

Proje, PostgreSQL veritabanını kullanmaktadır. Yerelde kolayca ayağa kaldırabilmek için Docker kullanabilirsiniz.

#### Docker ile Veritabanını Başlatma:
Aşağıdaki komut ile 5432 portu üzerinde yeni bir PostgreSQL konteyneri başlatabilirsiniz:
```bash
docker run --name postgres-pearlconnect -e POSTGRES_USER=pearlconnect -e POSTGRES_PASSWORD=pearlconnect -e POSTGRES_DB=pearlconnect -p 5432:5432 -d postgres
```

#### Backend'i Çalıştırma:
Veritabanı hazır olduktan sonra, `/backend` dizinine gidin ve Spring Boot projesini başlatın:
```bash
cd backend
./mvnw spring-boot:run
```
*Backend 8081 portunda çalışacaktır.*

### 2. Frontend Kurulumu

Frontend tarafını başlatmak için `/frontend` dizinine gidin ve şu komutları çalıştırın:
```bash
cd frontend
npm install
npm run dev
```
*Frontend 3000 portunda (http://localhost:3000) çalışacaktır.*

---

## Test Hesapları (Data Seeder)

Sistemi kolayca test edebilmeniz için backend uygulaması çalıştığında bazı varsayılan test hesapları, okullar ve rozetler veritabanına otomatik eklenecektir.

Bu hazır hesap bilgilerini kullanarak sisteme giriş yapabilirsiniz:

### 🏢 Kurum (Merkez - HQ) Hesabı
Tüm yetkileri atayabilen ve analiz sayfalarını görebilen kurum hesabı:
- **E-posta:** `kurum@loseven.com`
- **Şifre:** `123456`

### 👨‍🏫 Öğretmen Hesabı
Öğrencilerin etkinliklerini onaylama yetkisine sahip öğretmen hesabı:
- **E-posta:** `ogretmen@loseven.com`
- **Şifre:** `123456`

### 👦 Öğrenci Hesapları
Etkinlik ekleyebilen, paylaşım yapıp rozet kazanan öğrenci hesapları:
- **E-posta 1:** `ogrenci1@loseven.com`
- **E-posta 2:** `ogrenci2@loseven.com`
- **E-posta 3:** `ogrenci3@loseven.com`
- **Şifre (Tümü İçin):** `123456`
