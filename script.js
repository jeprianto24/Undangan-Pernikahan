// 1. Membaca Nama Tamu dari URL (?to=NamaTamu)
const urlParams = new URLSearchParams(window.location.search);
const namaTamu = urlParams.get('to');
if (namaTamu) {
    const namaTamuEl = document.getElementById('nama-tamu');
    if (namaTamuEl) namaTamuEl.innerText = namaTamu;
}

// Kunci scroll ketika cover aktif di awal
document.body.style.overflow = 'hidden';

// Fungsi Scroll Reveal (Memunculkan elemen dengan class .reveal saat di-scroll)
function revealOnScroll() {
    const reveals = document.querySelectorAll(".reveal");

    reveals.forEach((element) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150; // Jarak trigger sebelum elemen muncul

        if (elementTop < windowHeight - elementVisible) {
            element.classList.add("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);

// Inisialisasi AOS (Animate on Scroll) untuk efek Pop-Up ala ndinvite
document.addEventListener("DOMContentLoaded", function () {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 850,
            easing: 'ease-out-back', // Efek membal / pop-up
            once: false,              // Animasi berulang saat di-scroll naik & turun
            mirror: true,
            offset: 50
        });
    }

    muatUcapan();
    
    // Otomatis isi nama di form jika namaTamu dari URL tersedia
    if (typeof namaTamu !== 'undefined' && namaTamu) {
        const inputNama = document.getElementById('nama');
        if (inputNama) inputNama.value = namaTamu;
    }

    // Jalankan sekali saat halaman dimuat untuk elemen di bagian atas
    revealOnScroll();
});

// 2. PENGATURAN MUSIK & BUKA UNDANGAN
let isPlaying = false;
let backgroundMusic = new Audio('lagu.mp3'); // File lagu.mp3 berada di folder utama (root)
backgroundMusic.loop = true;

function bukaUndangan() {
    // Menghilangkan cover depan
    const heroCover = document.querySelector('.hero');
    if (heroCover) {
        heroCover.classList.add('hidden-cover');
    }
    
    // Munculkan menu navigasi bawah
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) bottomNav.classList.add('nav-tampil');

    // Buka kunci scroll halaman utama
    document.body.style.overflow = 'auto';

    // Refresh animasi pop-up AOS & Scroll Reveal
    setTimeout(() => {
        if (typeof AOS !== 'undefined') AOS.refresh();
        revealOnScroll();
    }, 250);

    // Memutar musik latar belakang
    backgroundMusic.play().then(() => {
        isPlaying = true;
        updateMusicIcon();
    }).catch(error => {
        console.log("Autoplay audio ditahan pelayar/browser:", error);
    });
}

function toggleMusic() {
    const musicIcon = document.getElementById('music-icon');
    
    if (isPlaying) {
        backgroundMusic.pause();
        isPlaying = false;
        if (musicIcon) musicIcon.className = "fas fa-music fa-fade"; // Indikator pause (pudar)
    } else {
        backgroundMusic.play().then(() => {
            isPlaying = true;
            if (musicIcon) musicIcon.className = "fas fa-music"; // Indikator menyala
        }).catch(err => {
            console.log("Gagal memutar musik:", err);
        });
    }
}

function updateMusicIcon() {
    const musicIcon = document.getElementById('music-icon');
    if (musicIcon) {
        musicIcon.className = isPlaying ? "fas fa-music" : "fas fa-music fa-fade";
    }
}

// 3. FITUR AUTO-SCROLL SILKY SMOOTH 60FPS (GAYA BERGULIR HALUS ALA NDINVITE)
let isAutoScrolling = false;
let autoScrollAnimFrame = null;
const scrollSpeed = 1.35; // Kecepatan santai & nyaman untuk membaca

function autoScrollLoop() {
    if (!isAutoScrolling) return;

    // Berhenti jika sudah mencapai bagian paling bawah halaman
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 5) {
        stopAutoScroll();
        return;
    }

    window.scrollBy(0, scrollSpeed);
    autoScrollAnimFrame = requestAnimationFrame(autoScrollLoop);
}

function startAutoScroll() {
    isAutoScrolling = true;
    const scrollBtn = document.getElementById('scroll-btn');
    const scrollIcon = document.getElementById('scroll-icon');
    
    if (scrollBtn) scrollBtn.classList.add('active');
    if (scrollIcon) scrollIcon.className = "fas fa-pause";

    autoScrollAnimFrame = requestAnimationFrame(autoScrollLoop);
}

function stopAutoScroll() {
    isAutoScrolling = false;
    if (autoScrollAnimFrame) {
        cancelAnimationFrame(autoScrollAnimFrame);
        autoScrollAnimFrame = null;
    }
    
    const scrollBtn = document.getElementById('scroll-btn');
    const scrollIcon = document.getElementById('scroll-icon');
    
    if (scrollBtn) scrollBtn.classList.remove('active');
    if (scrollIcon) scrollIcon.className = "fas fa-arrow-down";
}

function toggleAutoScroll() {
    if (isAutoScrolling) {
        stopAutoScroll();
    } else {
        startAutoScroll();
    }
}

// Berhenti jika pengguna menyentuh atau menggulir manual agar tidak berebut kontrol
window.addEventListener('wheel', () => {
    if (isAutoScrolling) stopAutoScroll();
}, { passive: true });

window.addEventListener('touchstart', () => {
    if (isAutoScrolling) stopAutoScroll();
}, { passive: true });


// 4. SLIDESHOW FOTO UTAMA (BERGANTI OTOMATIS DI DALAM LINGKARAN/KOTAK)
let currentPhotoIndex = 0;
const photos = document.querySelectorAll('.foto-slider');

function changePhoto() {
    if (photos.length > 0) {
        photos[currentPhotoIndex].classList.remove('active');
        currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
        photos[currentPhotoIndex].classList.add('active');
    }
}

setInterval(changePhoto, 3500);

// 5. LOGIKA HITUNG MUNDUR (COUNTDOWN TIMER)
const weddingDate = new Date("December 22, 2026 09:00:00").getTime();

const countdown = setInterval(function() {
    const now = new Date().getTime();
    const distance = weddingDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const d = document.getElementById("days");
    const h = document.getElementById("hours");
    const m = document.getElementById("minutes");
    const s = document.getElementById("seconds");

    if (d) d.innerText = days >= 0 ? days : 0;
    if (h) h.innerText = hours >= 0 ? hours : 0;
    if (m) m.innerText = minutes >= 0 ? minutes : 0;
    if (s) s.innerText = seconds >= 0 ? seconds : 0;

    if (distance < 0) {
        clearInterval(countdown);
    }
}, 1000);

// 6. LOGIKA FORM RSVP & UCAPAN (MENGGUNAKAN LOCAL STORAGE)
function muatUcapan() {
    const ucapanList = JSON.parse(localStorage.getItem('ucapan_pernikahan')) || [];
    const container = document.getElementById('daftar-ucapan');
    const jumlahEl = document.getElementById('jumlah-ucapan');

    if (jumlahEl) jumlahEl.innerText = ucapanList.length;

    // Hitung statistik kehadiran
    let countHadir = 0;
    let countTidakHadir = 0;
    let countRagu = 0;

    ucapanList.forEach(item => {
        if (item.kehadiran === 'Hadir') countHadir++;
        else if (item.kehadiran === 'Tidak Hadir') countTidakHadir++;
        else if (item.kehadiran === 'Ragu-ragu') countRagu++;
    });

    // Tampilkan ke elemen statistik
    if (document.getElementById('stat-hadir')) document.getElementById('stat-hadir').innerText = countHadir;
    if (document.getElementById('stat-tidak')) document.getElementById('stat-tidak').innerText = countTidakHadir;
    if (document.getElementById('stat-ragu')) document.getElementById('stat-ragu').innerText = countRagu;

    if (container) {
        if (ucapanList.length === 0) {
            container.innerHTML = '<p style="font-size: 0.85rem; color: #888; text-align: center;">Belum ada ucapan. Jadilah yang pertama memberikan ucapan!</p>';
            return;
        }

        container.innerHTML = '';
        ucapanList.forEach((item) => {
            const card = document.createElement('div');
            card.className = 'card-ucapan';
            card.innerHTML = `
                <div class="card-ucapan-header">
                    <span class="card-ucapan-nama">${item.nama}</span>
                    <span class="badge-hadir ${item.kehadiran}">${item.kehadiran}</span>
                </div>
                <p class="card-ucapan-teks">${item.ucapan}</p>
            `;
            container.appendChild(card);
        });
    }
}

function kirimUcapan(e) {
    e.preventDefault();
    const namaInput = document.getElementById('nama').value.trim();
    const kehadiranInput = document.getElementById('status').value;
    const ucapanInput = document.getElementById('pesan').value.trim();

    if (!namaInput || !kehadiranInput || !ucapanInput) return;

    const dataBaru = {
        nama: namaInput,
        kehadiran: kehadiranInput,
        ucapan: ucapanInput
    };

    const ucapanList = JSON.parse(localStorage.getItem('ucapan_pernikahan')) || [];
    ucapanList.unshift(dataBaru); // Tambahkan ke paling atas

    localStorage.setItem('ucapan_pernikahan', JSON.stringify(ucapanList));

    // Reset Form & Muat Ulang Tampilan Ucapan
    document.getElementById('rsvp-form').reset();
    
    // Otomatis isi nama tamu dari URL jika ada
    if (typeof namaTamu !== 'undefined' && namaTamu) {
        document.getElementById('nama').value = namaTamu;
    }

    muatUcapan();
}
