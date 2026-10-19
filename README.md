# Project Viral Sosmed - 3D Folded Paper Hand Move Filter Studio

Aplikasi visual interaktif real-time berbasis **Computer Vision (MediaPipe Hands)** dan **HTML5 Canvas / Vite** yang mereplikasi efek viral media sosial: **3D Folded Paper Ribbon (Origami Paper Strip) & Risograph / Cyanotype / Solarized Live Filter**.

Efek ini terinspirasi dari arsitektur visual **TouchDesigner + MediaPipe Live Visuals**, di mana gerakan ujung jari tangan membentuk pita kertas lipat 3D dinamis yang mengubah video wajah/tubuh secara real-time menjadi filter cetak artistik.

---

## 🌟 Fitur Utama

- **Deteksi & Tracking 10 Ujung Jari Tangan (MediaPipe Hands)**:
  - Melacak ujung jari dari kedua tangan (Thumb, Index, Middle, Ring, Pinky).
  - Pembentukan poligon lipatan kertas 3D dinamis yang mengikuti pergerakan tangan secara presisi dan responsif.
  - *Strict Dual-Hand Prerequisite*: Efek hanya akan terbuka jika **2 tangan** terdeteksi di kamera; jika tidak, kamera menampilkan video normal 100% bersih.
- **3D Folded Paper Ribbon Structure**:
  - **Top Flap (Lipatan Atas)**: Strip kertas putih (*Off-White*) dengan pola cetak bintik merah (*Red Halftone / Stippling Dots*).
  - **Center Video Panel (Panel Utama)**: Video kamera diri sendiri yang diproses secara real-time menjadi gradasi kontras tinggi (*Solarized Pop-Art*).
  - **Bottom Flap (Lipatan Bawah)**: Strip kertas lipat warna *Prussian Navy Blue* dengan garis lipatan (*crease vector lines*) untuk kedalaman 3D origami.
- **Pilihan Preset Visual TouchDesigner FX**:
  - 🖨️ **Risograph Pop-Art**: Palet tinta retro (Prussian Navy Blue, Acid Emerald Green, Thermal Bright Yellow, Cream Off-White).
  - 🛢️ **Cyanotype Blueprint**: Nuansa cetakan foto biru abad ke-19 (Deep Indigo, Blueprint Cyan, Crisp White).
  - ☀️ **Thermal Solarized**: Spektrum solarisasi termal dinamis.
- **Modern Obsidian Glassmorphism UI**:
  - Tampilan studio profesional dan elegan di samping viewport kamera.
  - Kontrol slider live: *Stippling Red Dot Density*, *Motion Spring Physics*, dan *Paper Flap Depth*.
  - Indikator status live FPS meter & deteksi tangan.
  - Tombol **Capture PNG** (HD snapshot) & **Record Video** (.webm).
- **Mode Hand Simulator**:
  - Fitur pengujian tanpa webcam menggunakan interaksi mouse/drag.

---

## 🛠️ Tech Stack

- **Framework / Bundler**: [Vite](https://vitejs.dev/) (Vanilla JavaScript / ES Modules)
- **Computer Vision**: [@mediapipe/hands](https://google.github.io/mediapipe/solutions/hands.html) & `@mediapipe/camera_utils`
- **Rendering Engine**: HTML5 Canvas 2D Context, Bilinear / Affine Transformations, Image Processing Shaders
- **UI & Styling**: Modern CSS Glassmorphism & Custom Typography (Google Fonts Plus Jakarta Sans & Space Grotesk)

---

## 🚀 Instalasi & Menjalankan Proyek

### 1. Clone Repository
```bash
git clone https://github.com/attaramadhani/Project-gabut-viral-sosmed-Finger-Move.git
cd Project-gabut-viral-sosmed-Finger-Move
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Jalankan Development Server
```bash
npm run dev
```

Buka URL yang ditampilkan di terminal (default: `http://localhost:5173/` atau `http://localhost:5174/`) di browser yang mendukung akses webcam.

### 4. Build untuk Production
```bash
npm run build
```

---

## 📖 Cara Penggunaan

1. Berikan izin akses kamera (*allow webcam*) saat browser meminta konfirmasi.
2. Arahkan **kedua tangan** ke depan kamera.
3. Gerakkan atau bentangkan jari-jari tangan Anda: jendela pita kertas lipat 3D akan otomatis muncul dan mengunci pada pergerakan jari Anda.
4. Gunakan panel di sebelah kanan untuk memilih preset warna (Risograph, Cyanotype, Thermal) atau mengatur parameter fisika gerakan dan bintik stippling.
5. Klik **Capture PNG** untuk mengambil tangkapan layar atau **Start Record** untuk merekam video interaksi Anda.

---

## 📄 Lisensi

Proyek ini dibuat untuk keperluan eksperimen kreatif dan eksplorasi coding interaktif. Bebas dikembangkan lebih lanjut!
