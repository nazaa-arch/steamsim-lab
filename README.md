# 🔬 SteamSim Lab (`sim.steamcraft.online`)

> **Interactive In-Browser Virtual Science & Applied Mathematics Laboratory Studio**  
> *Physics Dynamics, Aerodynamics with Quadratic Drag, Damped Driven Resonance, Chemistry Titration, and Chaos Theory Simulation.*

[![SteamCraft Ecosystem](https://img.shields.io/badge/Ecosystem-steamcraft.online-0284c7?style=for-the-badge&logo=googlechrome&logoColor=white)](https://steamcraft.online)
[![PaperCraft AI](https://img.shields.io/badge/PaperCraft%20AI-scholar.steamcraft.online-6366f1?style=for-the-badge&logo=react&logoColor=white)](https://scholar.steamcraft.online)
[![VeriLab AI Engine](https://img.shields.io/badge/VeriLab%20AI-verilab.steamcraft.online-10b981?style=for-the-badge&logo=fastapi&logoColor=white)](https://verilab.steamcraft.online)
[![Creator Portfolio](https://img.shields.io/badge/Creator-Muhammad%20Naza%20Firmansyah-06b6d4?style=for-the-badge&logo=github&logoColor=white)](https://portofolionaza.steamcraft.online)

---

## 🌟 Ikhtisar Proyek

**SteamSim Lab** adalah studio simulasi sains dan matematika interaktif berbasis peramban (*in-browser*) tanpa instalasi (*zero-installation*). Platform ini dirancang untuk memvisualisasikan fenomena ilmiah non-linear yang kompleks dan menghasilkan dataset telemetri sensor virtual dengan injeksi derau riil untuk diuji menggunakan mesin metrologi **VeriLab AI**.

---

## 🚀 4 Modul Simulasi Sains Interaktif

1. **Fisika: Gerak Proyektil & Aerodinamika Kuadratik ($C_d$)**:
   - Integrasi numerik trajektori dengan gaya hambat udara kuadratik:
     $$\vec{F}_{\text{drag}} = -\frac{1}{2} C_d \rho A v \vec{v}$$
   - Kalkulasi dinamis: Jarak Jangkauan ($R$), Titik Tertinggi ($H_{\text{max}}$), Waktu Tempuh ($t$), dan Kecepatan Benturan.
   - Dilengkapi *slider* sudut elevasi, kecepatan awal, koefisien drag, dan persentase derau sensor.

2. **Fisika: Osilator Harmonik Teredam & Terpaksa (Damped Driven Harmonic)**:
   - Persamaan diferensial gerak:
     $$m \ddot{x} + \gamma \dot{x} + k x = F_0 \cos(\omega t)$$
   - Animasi pegas fisik dan potret ruang fasa (*Phase Space Portrait* $\dot{x}$ vs $x$).
   - Deteksi otomatis kondisi resonansi ($\omega \approx \omega_0$).

3. **Kimia: Titrasi Asam-Basa Kuantitatif & Kapasitas Buffer**:
   - Simulasi titrasi Asam Lemah ($\text{CH}_3\text{COOH}$) vs Asam Kuat ($\text{HCl}$) dengan Basa Kuat ($\text{NaOH}$).
   - Perhitungan kurva $pH$ berbasis persamaan Henderson-Hasselbalch:
     $$pH = pK_a + \log\frac{[A^-]}{[HA]}$$
   - Visualisasi labu Erlenmeyer dengan gradasi perubahan warna indikator Fenolftalein ($pH$ 8.2 – 10.0).

4. **Matematika: Teori Chaos Bandul Ganda (Double Pendulum)**:
   - Integrasi dinamika non-linear Lagrangian 2 Derajat Kebebasan (2 DOF).
   - Jejak kurva bercahaya (*luminous trajectory*) yang menunjukkan sensitivitas tinggi terhadap kondisi awal (*Butterfly Effect*).

5. **Ekspor Data Sensor Telemetri (CSV)**:
   - Ekspor data waktu nyata ($t, x, y, v_x, v_y, V_{\text{sensor}}$) untuk diuji kurva kalibrasi GPR-nya di **VeriLab AI** (`verilab.steamcraft.online`).

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: React 19 + TypeScript
- **Rendering**: HTML5 High-Performance Canvas API (60 FPS)
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite) + Lucide Icons
- **Bundler**: Vite 8 (Port `3002`)

---

## 💻 Menjalankan Secara Lokal

```powershell
cd "C:\Kebutuhan Data Pribadi\SteamSim Lab"
.\dev.ps1
```

Akses di peramban pada **`http://localhost:3002`**.

---

## 👤 Pengembang & Kepemilikan

- **Lead Developer & System Architect**: **Muhammad Naza Firmansyah**
- **Institusi**: Program Studi Sains Data, Universitas Negeri Surabaya (UNESA)
- **Portofolio**: [portofolionaza.steamcraft.online](https://portofolionaza.steamcraft.online)
- **Ekosistem**: [steamcraft.online](https://steamcraft.online)
