# 🚀 Hackathon'26: InWallet - Kişisel Finans ve AI Asistanı

InWallet, **Hackathon'26** "Finans Temalı AI Uygulamaları" kategorisi için geliştirilmiş, üretken yapay zeka (GenAI) destekli akıllı bir kişisel finans ve portföy yönetim sistemidir. 

Sıradan bir cüzdan uygulamasından farklı olarak, InWallet kullanıcının gelirini, giderlerini ve yatırım hedeflerini anlık enflasyon ve piyasa verileriyle (Altın, Borsa, Kripto) analiz eder. İçerisinde barındırdığı **Agentic AI** yapısı sayesinde kullanıcının veritabanındaki portföyünü otonom olarak sorgulayabilir ve kişiselleştirilmiş finansal tavsiyeler verebilir.

---

## 🛠️ Teknik Altyapı ve Mimari

InWallet, yüksek ölçeklenebilirlik, performans ve yapay zeka entegrasyonu (Agentic Tools) hedeflenerek modern yazılım mimarisiyle tasarlanmıştır.

### Kullanılan Teknolojiler
- **Backend:** Java 17, Spring Boot 3, Spring Data JPA
- **Yapay Zeka (Agentic AI):** Spring AI (Google Gemini / OpenAI Entegrasyonu)
- **Veritabanı:** PostgreSQL (Kullanıcı, Hedef, Varlık ve İşlem verileri)
- **Önbellekleme:** Redis (Piyasa verilerinin hızlı okunması)
- **Olay Güdümlü Mimari (Event-Driven):** Apache Kafka & Zookeeper
- **Konteynerleştirme:** Docker & Docker Compose
- **Frontend:** ReactJS, TypeScript (Vite)

### Temel Özellikler
1. **Dinamik Portföy Yönetimi:** Altın, Hisse Senedi ve Kripto gibi varlıkların canlı veriler üzerinden kar/zarar hesabı.
2. **AI Function Calling:** Yapay zeka, Java fonksiyonlarını (örn: `getUserPortfolio`) tetikleyerek gerçek zamanlı analiz yapabilir.
3. **Akıllı Hedefler:** Tahmini enflasyon oranlarıyla güncellenen dinamik hedef takibi.
4. **📱 Native Mobil Deneyim (PWA):** Uygulamayı telefonunuzdan açıp "Ana Ekrana Ekle" diyerek Native bir mobil uygulama gibi kullanabilirsiniz!

---

## 🚀 Hızlı Kurulum Rehberi (Docker)

Takım arkadaşlarının ve jürinin projeyi sorunsuz ayağa kaldırması için en güvenilir yöntem Docker kullanımıdır.

### 1. API Anahtarlarını Ayarlama
Ana dizinde bir `.env` dosyası oluşturun ve içine anahtarlarınızı ekleyin (Bkz: `.env.example`):
```bash
OPENAI_API_KEY=your_key_here
GOOGLE_GEMINI_API_KEY=your_key_here
```

### 2. Sistemi Başlatma
Terminalden ana dizinde şu komutu çalıştırın:
```bash
docker compose up --build -d
```

### 3. Erişim Adresleri
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:8080](http://localhost:8080)
- **Swagger UI:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html)

---

## 📱 Mobil Uygulama Olarak Kullanım (PWA)

InWallet, modern **Progressive Web App (PWA)** standartlarıyla geliştirilmiştir. Bu sayede hiçbir mağazaya (App Store / Google Play) ihtiyaç duymadan telefonunuza Native bir uygulama gibi kurabilirsiniz:

### 1. Bağlantı Adımını Hazırlama
1. Projeyi bilgisayarınızda ayağa kaldırın (`docker compose up -d`).
2. Bilgisayarınızın bağlı olduğu yerel ağın IP adresini öğrenin (örn: `192.168.1.100`).
3. Cep telefonunuzun tarayıcısından `http://192.168.1.100:5173` adresine girin.

### 🍎 iPhone (iOS / Safari) Kurulumu
1. Safari'nin alt kısmında bulunan **Paylaş** butonuna (kare içinden yukarı doğru çıkan ok simgesi) dokunun.
2. Açılan menüyü aşağı doğru kaydırın ve **"Ana Ekrana Ekle" (Add to Home Screen)** seçeneğine dokunun.
3. Sağ üst köşedeki **"Ekle" (Add)** butonuna basın.
4. Telefonunuzun ana ekranına **InWallet** ikonu eklenecektir. İkona tıkladığınızda Safari arayüzü olmadan tam ekran açılır!

### 🤖 Android (Chrome) Kurulumu
1. Chrome'un sağ üst köşesindeki **Üç Nokta (⋮)** menüsüne dokunun.
2. Açılan listeden **"Ana Ekrana Ekle" (Add to Home Screen)** veya **"Uygulamayı Yükle" (Install App)** seçeneğine dokunun.
3. Çıkan onay penceresinde **"Yükle"** veya **"Ekle"** butonuna basın.
4. Uygulama otomatik olarak telefonunuzun ana ekranına yerleşecektir!

---

## 📚 API Dokümantasyonu (Swagger & Postman)

### 1. Canlı Swagger Arayüzü
Uygulama çalışırken etkileşimli dokümantasyona buradan erişebilirsiniz: [Swagger UI](http://localhost:8080/swagger-ui/index.html)

### 2. Postman Koleksiyonu
Kök dizinde bulunan `openapi.json` dosyasını Postman'e "Import" ederek tüm API koleksiyonuna erişebilirsiniz.

---

## 🤖 Gemini AI Entegrasyonu ve Yapılandırma

InWallet Asistanı, Google'ın en güncel **Gemini 1.5 Flash/Pro** modellerini kullanarak finansal analiz yapar. Kararlı bir çalışma için aşağıdaki adımları takip edin:

### 1. API Anahtarı Alın
- **[Google AI Studio](https://aistudio.google.com/app/apikey)** adresine gidin.
- "Create API key" butonu ile yeni bir anahtar oluşturun.
- (Önemli) Eğer kısıtlı bir proje kullanıyorsanız, API anahtarının **"Generative Language API"** yetkisine sahip olduğundan emin olun.

### 2. Ortam Değişkenlerini Ayarlayın
`.env` dosyanızda şu değişkenlerin tanımlı olduğundan emin olun:
```bash
# Google AI Studio'dan aldığınız anahtar
GEMINI_API_KEY=AIzaSy... 
```

### 3. Model Seçimi ve Performans
Sistem varsayılan olarak en yüksek hız ve kota verimliliği için `gemini-flash-latest` modelini kullanacak şekilde yapılandırılmıştır. Gerekirse `ai-assistant-service/src/main/resources/application.yml` dosyasından model ismini değiştirebilirsiniz.

---

## 🆘 Olası Hatalar ve Çözümleri (Troubleshooting)

- **Port Çakışması (8080/5173):** Başka bir uygulamanın bu portları kullanmadığından emin olun veya `docker compose down` yapıp tekrar deneyin.
- **Veritabanı Bağlantı Hatası:** Konteynerlerin tam hazır olması için 10-15 saniye bekleyin. Sorun devam ederse `docker compose down -v` ile volume'leri temizleyip tekrar başlatın.
- **AI Yanıt Vermiyor:** `.env` dosyasındaki API anahtarlarınızın geçerli olduğunu kontrol edin.

---

## 🐳 Docker Geliştirme İpuçları ve Hafıza Yönetimi

Geliştirme yaparken (Development) her kod değişikliğinden sonra `docker compose up --build -d` kullanmak zaman kaybına ve "askıda kalan (dangling)" imajların bilgisayarınızın hafızasını doldurmasına neden olur.

### 🧹 Hafızayı Temizleme
Eğer Docker çok fazla alan kaplamaya başladıysa terminalinizde şu komutu çalıştırın:
```bash
docker system prune -f
```
*(Bu komut sadece kullanılmayan ve askıda kalan imaj/kalıntıları siler, aktif projenize zarar vermez.)*

### ⚡ Hızlı Geliştirme Tavsiyesi (Live Reload)
Sürekli build almamak için **Hibrit Yaklaşımı** öneriyoruz:
1. Sadece altyapıyı Docker'da başlatın: `docker compose up postgres redis zookeeper kafka -d`
2. **Frontend:** `inwallet-frontend` klasörüne gidip terminalden `npm run dev` çalıştırın.
3. **Backend:** `portfolio-service` klasörüne gidip terminalden `./mvnw spring-boot:run` çalıştırın.

Böylece kodda yaptığınız değişiklikler kaydettiğiniz an sisteme yansır!

---

## 🤝 Takım Arkadaşları İçin Çalışma Rehberi

Ekibimizin beraber sorunsuz çalışabilmesi için lütfen şu kurallara dikkat edelim:

### 1. Git İş Akışı ve Güncel Kalma
Her sabah ana depodaki değişiklikleri kendi bilgisayarınıza çekmeyi unutmayın:
```bash
git checkout main
git pull upstream main  # Ana depodan güncel kodu al
git push origin main    # Kendi fork'unu güncelle
```

### 2. Yeni Özellik Geliştirme (Branching)
Doğrudan `main` dalına kod pushlamak **yasaktır**. Her iş için yeni bir dal açın:
```bash
git checkout -b feature/eklenecek-ozellik-adi
```

### 3. Commit ve PR Süreci
- Mesajlarınızın başına `feat:`, `fix:`, `docs:` gibi etiketler ekleyin (Conventional Commits).
- İşiniz bittiğinde GitHub üzerinden `main` dalına bir **Pull Request (PR)** açın ve ekipteki bir arkadaşınızdan onay isteyin.

### 4. Kod Standartları
- Kodu göndermeden önce mutlaka localinizde projenin derlendiğinden (`./mvnw clean install` veya Docker'da hata almadığından) emin olun.

Takımımıza başarılar dilerim, Hackathon'da görüşmek üzere! 🏆
