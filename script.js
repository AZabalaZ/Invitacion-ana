/* ============================================
   INVITACIÓN 15 AÑOS - 
   JavaScript - Funcionalidad
   ============================================ */

// ============================================
// CONFIGURACIÓN - Fácil de editar
// ============================================
const CONFIG = {
    // Fecha del evento (año, mes (0-11), día, hora, minutos)
    eventDate: new Date(2026, 4, 23, 21, 0, 0), // 14 de Marzo de 2026, 20:30

    // Intervalo de cambio automático de galería (milisegundos)
    galleryAutoplayInterval: 4000,

    // Duración del toast (milisegundos)
    toastDuration: 3000
};

// ============================================
// ELEMENTOS DEL DOM
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initCountdown();
    initMusicPlayer();
    initGalleries();
    initCopyButtons();
    initForm();
});

// ============================================
// NAVBAR - Menú de navegación
// ============================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    // Toggle menú móvil
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// CUENTA REGRESIVA
// ============================================
function initCountdown() {
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    function updateCountdown() {
        const now = new Date().getTime();
        const target = CONFIG.eventDate.getTime();
        const diff = target - now;

        if (diff <= 0) {
            // El evento ya pasó
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            return;
        }

        // Calcular tiempo restante
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // Actualizar elementos con formato de dos dígitos
        daysEl.textContent = String(days).padStart(2, '0');
        hoursEl.textContent = String(hours).padStart(2, '0');
        minutesEl.textContent = String(minutes).padStart(2, '0');
        secondsEl.textContent = String(seconds).padStart(2, '0');
    }

    // Actualizar inmediatamente y luego cada segundo
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// ============================================
// REPRODUCTOR DE MÚSICA
// ============================================
function initMusicPlayer() {
    const audio = document.getElementById('audioPlayer');
    const playBtn = document.getElementById('playBtn');
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    const progressFill = document.getElementById('progressFill');
    const progressDot = document.getElementById('progressDot');

    let isPlaying = false;

    // Play/Pause
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
        } else {
            audio.play().catch(err => {
                console.log('Error al reproducir:', err);
                showToast('Haz click de nuevo para reproducir');
            });
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
        }
        isPlaying = !isPlaying;
    });

    // Actualizar barra de progreso
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const progress = (audio.currentTime / audio.duration) * 100;
            if (progressFill) progressFill.style.width = progress + '%';
            if (progressDot) progressDot.style.left = progress + '%';
        }
    });

    // Establecer volumen inicial
    audio.volume = 0.5;

    // Cuando termina la canción, reiniciar
    audio.addEventListener('ended', () => {
        audio.currentTime = 0;
        isPlaying = false;
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    });
}

// ============================================
// GALERÍAS DE FOTOS
// ============================================
function initGalleries() {
    // Primera galería
    initGallery('galleryTrack', 'galleryDots');

    // Segunda galería
    initGallery('galleryTrack2', 'galleryDots2');
}

function initGallery(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsId);

    if (!track || !dotsContainer) return;

    const slides = track.querySelectorAll('.gallery-slide');
    const slideCount = slides.length;
    let currentIndex = 0;
    let autoplayTimer;

    // Crear dots
    for (let i = 0; i < slideCount; i++) {
        const dot = document.createElement('span');
        dot.classList.add('gallery-dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }

    const dots = dotsContainer.querySelectorAll('.gallery-dot');

    function goToSlide(index) {
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Actualizar dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });

        // Reiniciar autoplay
        resetAutoplay();
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % slideCount;
        goToSlide(currentIndex);
    }

    function resetAutoplay() {
        clearInterval(autoplayTimer);
        autoplayTimer = setInterval(nextSlide, CONFIG.galleryAutoplayInterval);
    }

    // Iniciar autoplay
    resetAutoplay();

    // Soporte para gestos de swipe en móvil
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        // Prevenir scroll mientras se hace swipe
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                // Swipe izquierda - siguiente
                goToSlide((currentIndex + 1) % slideCount);
            } else {
                // Swipe derecha - anterior
                goToSlide((currentIndex - 1 + slideCount) % slideCount);
            }
        }
        isDragging = false;
    });
}

// ============================================
// BOTONES DE COPIAR
// ============================================
function initCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-copy');

            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('¡Copiado al portapapeles!');
            } catch (err) {
                // Fallback para navegadores sin soporte
                const textArea = document.createElement('textarea');
                textArea.value = textToCopy;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                showToast('¡Copiado al portapapeles!');
            }
        });
    });
}

// ============================================
// FORMULARIO DE CONFIRMACIÓN
// ============================================
function initForm() {
    const form = document.getElementById("rsvpForm");

if (form) {
  form.addEventListener("submit", async function(e) {
    e.preventDefault();

    const button = form.querySelector("button");
    const originalText = button.innerText;

    button.disabled = true;
    button.innerText = "Enviando...";

    const data = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {
        showToast("¡Confirmación enviada! 💚");
        form.reset();
      } else {
        showToast("Error al enviar 😢");
      }

    } catch (error) {
      showToast("Error de conexión 😢");
    }

    button.disabled = false;
    button.innerText = originalText;
  });
}
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, CONFIG.toastDuration);
}

// ============================================
// ANIMACIONES AL SCROLL (Opcional)
// ============================================
function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast show";
  toast.innerText = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}   

// Inicializar animaciones si las quieres activar
// initScrollAnimations();
