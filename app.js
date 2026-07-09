// VITALIFE 360 - Interactive Funnel Engine

document.addEventListener('DOMContentLoaded', () => {
    // Try to play video and suspense audio immediately on load (for desktop/unblocked browsers)
    const initAutoplayOnLoad = () => {
        const bg = document.getElementById('video-bg-acto1');
        if (bg && typeof bg.play === 'function') {
            bg.play().catch(e => console.log("Immediate video autoplay blocked, waiting for touch:", e));
        }
        const introAudio = document.getElementById('audio-intro-suspense');
        if (introAudio) {
            introAudio.volume = 0.55;
            introAudio.play().catch(e => console.log("Immediate audio autoplay blocked, waiting for touch:", e));
        }
    };
    initAutoplayOnLoad();

    // Mobile Autoplay Force-Play Fix & Background Music Trigger (for strict mobile browsers)
    const forceMobileVideoAutoplay = () => {
        const bg = document.getElementById('video-bg-acto1');
        if (bg && typeof bg.play === 'function' && bg.paused) {
            bg.play().catch(e => console.log("Force play bg video failed:", e));
        }

        const introAudio = document.getElementById('audio-intro-suspense');
        if (introAudio && introAudio.paused) {
            introAudio.volume = 0.55;
            introAudio.play()
                .then(() => {
                    console.log("Suspense music playing successfully.");
                    // Clean up all triggers ONLY when audio successfully starts playing
                    ['click', 'touchstart', 'mousedown', 'keydown', 'pointerdown'].forEach(evt => {
                        document.removeEventListener(evt, forceMobileVideoAutoplay);
                        window.removeEventListener(evt, forceMobileVideoAutoplay);
                        const wrapper = document.getElementById('acto-1');
                        if (wrapper) {
                            wrapper.removeEventListener(evt, forceMobileVideoAutoplay);
                        }
                    });
                })
                .catch(e => {
                    console.log("Audio play deferred (user gesture required):", e);
                });
        }
    };
    
    // Bind all early interaction triggers to ensure instant playback on first gesture (excluding scroll)
    ['click', 'touchstart', 'mousedown', 'keydown', 'pointerdown'].forEach(evt => {
        document.addEventListener(evt, forceMobileVideoAutoplay);
        window.addEventListener(evt, forceMobileVideoAutoplay);
        const wrapper = document.getElementById('acto-1');
        if (wrapper) {
            wrapper.addEventListener(evt, forceMobileVideoAutoplay);
        }
    });

    // Audio Context for Ringtone/Beep Synthesis
    let audioCtx = null;
    let ringtoneInterval = null;

    // Elements
    const acts = {
        1: document.getElementById('acto-1'),
        2: document.getElementById('acto-2'),
        3: document.getElementById('acto-3'),
        4: document.getElementById('acto-4'),
        6: document.getElementById('acto-6'),
        7: document.getElementById('acto-7')
    };

    // Act 1 Elements
    const btnEntrar = document.getElementById('btn-entrar');
    const videoBg1 = document.getElementById('video-bg-acto1');

    // Act 2 Elements
    const btnContestar = document.getElementById('btn-contestar');

    // Act 3 Elements
    const videoConfrontacion = document.getElementById('video-confrontacion');
    const subtitlesText = document.getElementById('subtitles-text');

    // Act 4 Elements
    const chatBox = document.getElementById('chat-box');
    const chatMessages = document.getElementById('chat-messages');
    const typingIndicator = document.getElementById('typing-indicator');
    const loginBox = document.getElementById('login-box');
    const formLogin = document.getElementById('form-login');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('toggle-password');
    const loginError = document.getElementById('login-error');
    const btnLogin = document.getElementById('btn-login');

    // Act 5 Elements
    const videoVsl = document.getElementById('video-vsl');
    const videoVslSource = document.getElementById('video-vsl-source');
    const vslVideoBadge = document.getElementById('vsl-video-badge');

    // Confrontation video segments and synchronized subtitles
    const confrontationParts = [
        { src: 'assets/confrontacion_1.mp4', subtitles: [
            { time: 0, text: "¿En serio pensaste que te iba a poner a leer una landing page aburrida llena de fotos de dientes blancos de tiza..." },
            { time: 4.5, text: "...para venderte un descuento de ortodoncia o un implante genérico? [Se ríe sutilmente]." }
        ]},
        { src: 'assets/confrontacion_2.mp4', subtitles: [
            { time: 0, text: "Es gracioso cómo las clínicas tradicionales siguen usando el mismo libreto de hace 10 años, pensando que el público es tonto." },
            { time: 5.5, text: "Hoy en día, entras a cualquier publicidad dental y ya te sabes el guion: te muestran un consultorio ultra blanco..." }
        ]},
        { src: 'assets/confrontacion_3.mp4', subtitles: [
            { time: 0, text: "La verdadera estética no se trata de dientes. Se trata de estatus, de simetría facial y de la seguridad que recuperas cuando dejas de esconder tu sonrisa con la mano al reír." },
            { time: 6.5, text: "Pero calma, tengo la solución para hackear tu proporción áurea. Solo que aquí, la conversación continúa si demuestras que eres un paciente de verdad y no un curioso. Demúestramelo." }
        ]},
        { src: 'assets/bg-mesh.mp4', subtitles: [
            { time: 0, text: "[ PROTOCOLO V-360 EN LÍNEA: INICIANDO ESCANEO DE BIOMECÁNICA FACIAL ]" },
            { time: 3.5, text: "[ ESCANEANDO PARÁMETROS CRANEOMAXILARES Y MASCARA DE SIMETRÍA PROGRESIVA ]" }
        ]},
        { src: 'assets/pilar4.mp4', subtitles: [
            { time: 0, text: "[ SIMULANDO PROPORCIÓN ÁUREA EN DIRECTO: MODELANDO RELACIÓN LABIO-DIENTE ]" },
            { time: 3.5, text: "[ CÁLCULO DE ESTRUCTURA COMPLETADO. BLOQUEO DE SEGURIDAD DETECTADO: ACCESO RESTRINGIDO ]" }
        ]}
    ];

    // Helper: Transition between acts
    function transitionToAct(actNum) {
        console.log(`Transitioning to Act ${actNum}`);
        // Fade out active acts
        Object.keys(acts).forEach(num => {
            if (acts[num]) {
                acts[num].classList.remove('active');
            }
        });
        
        // Setup Act specific triggers
        setTimeout(() => {
            if (acts[actNum]) {
                acts[actNum].classList.add('active');
                onActEnter(actNum);
            }
        }, 300);
    }

    // Helper: Act Entrance Behaviors
    function onActEnter(actNum) {
        if (actNum === 2) {
            startIncomingCallAudio();
        } else if (actNum === 3) {
            stopIncomingCallAudio();
            playConfrontationVideo();
        } else if (actNum === 4) {
            startChatSequence();
            
            // Play background music (Prism_Breath.mp3) exactly when entering Act 4
            const loginBgAudio = document.getElementById('audio-login-bg');
            if (loginBgAudio) {
                loginBgAudio.volume = 0.5; // Moderate volume
                loginBgAudio.currentTime = 0; // Restart track
                loginBgAudio.play().catch(e => console.log("Music autoplay blocked by browser policy:", e));
            }
        } else if (actNum === 6) {
            // Act 6: iPhone Lockscreen Notification
            updateLockscreenTime();
            
            // Fade out the background music (Prism_Breath.mp3) smoothly when the lockscreen opens
            const loginBgAudio = document.getElementById('audio-login-bg');
            if (loginBgAudio) {
                let vol = loginBgAudio.volume;
                const fadeInterval = setInterval(() => {
                    if (vol > 0.05) {
                        vol -= 0.05;
                        loginBgAudio.volume = Math.max(0, vol);
                    } else {
                        clearInterval(fadeInterval);
                        loginBgAudio.pause();
                        loginBgAudio.currentTime = 0;
                    }
                }, 50);
            }

            // Start real-time clock update (every 10 seconds is lightweight and sufficient)
            const lockInterval = setInterval(() => {
                if (acts[6].classList.contains('active')) {
                    updateLockscreenTime();
                } else {
                    clearInterval(lockInterval);
                }
            }, 10000);
            
            // Play high-fidelity synthesized WhatsApp notification chime
            setTimeout(() => {
                playNotificationSound();
            }, 600);
        } else if (actNum === 7) {
            // Act 7: Voice Chat Screen
            resetContactStatus();
        }
    }

    // Web Audio API Ringtone Synthesis
    function initAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    function startIncomingCallAudio() {
        initAudioContext();
        if (!audioCtx) return;

        // Custom high-tech electronic ringtone synthesis
        function playRingCycle() {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const now = audioCtx.currentTime;
            
            // Simple premium chime ringtone
            const notes = [659.25, 783.99, 880.00, 987.77]; // E5, G5, A5, B5
            notes.forEach((freq, index) => {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + index * 0.15);
                
                gain.gain.setValueAtTime(0, now + index * 0.15);
                gain.gain.linearRampToValueAtTime(0.2, now + index * 0.15 + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.15 + 0.4);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start(now + index * 0.15);
                osc.stop(now + index * 0.15 + 0.55);
            });
        }

        // Loop every 2 seconds
        playRingCycle();
        ringtoneInterval = setInterval(playRingCycle, 2000);
    }

    function stopIncomingCallAudio() {
        if (ringtoneInterval) {
            clearInterval(ringtoneInterval);
            ringtoneInterval = null;
        }
    }

    function playHangupTone() {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        // Quick two-tone hangup beep
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(425, now);
        osc.frequency.setValueAtTime(425, now + 0.3); // standard hangup tone is intermittent
        
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.02);
        gain.gain.setValueAtTime(0.15, now + 0.25);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.28);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.35);
    }

    // Dynamic Cinematic Bass Drop + Sweep Riser Sound Effect
    function playHookTransitionSound() {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        
        // 1. Deep Bass Drop (Sub-bass rumble)
        const subOsc = audioCtx.createOscillator();
        const subGain = audioCtx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(140, now);
        subOsc.frequency.exponentialRampToValueAtTime(35, now + 1.2);
        
        subGain.gain.setValueAtTime(0, now);
        subGain.gain.linearRampToValueAtTime(0.6, now + 0.1);
        subGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
        
        subOsc.connect(subGain);
        subGain.connect(audioCtx.destination);
        subOsc.start(now);
        subOsc.stop(now + 1.3);
        
        // 2. High Tension Sweep Riser (whoosh sweep)
        const sweepOsc = audioCtx.createOscillator();
        const sweepGain = audioCtx.createGain();
        sweepOsc.type = 'sawtooth';
        sweepOsc.frequency.setValueAtTime(60, now);
        sweepOsc.frequency.exponentialRampToValueAtTime(680, now + 1.0);
        
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(250, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 1.0);
        filter.Q.value = 5.0;
        
        sweepGain.gain.setValueAtTime(0, now);
        sweepGain.gain.linearRampToValueAtTime(0.18, now + 0.2);
        sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.1);
        
        sweepOsc.connect(filter);
        filter.connect(sweepGain);
        sweepGain.connect(audioCtx.destination);
        sweepOsc.start(now);
        sweepOsc.stop(now + 1.2);
    }

    // Act 1 Event
    btnEntrar.addEventListener('click', () => {
        // Stop the intro suspense music immediately to prevent clashing with Act 2 ringtone
        const introAudio = document.getElementById('audio-intro-suspense');
        if (introAudio) {
            introAudio.pause();
            introAudio.currentTime = 0;
        }
        
        playHookTransitionSound();
        transitionToAct(2);
    });

    // Act 2 Event
    btnContestar.addEventListener('click', () => {
        transitionToAct(3);
    });

    // Act 3 Confrontation Video Control (Sequential playback)
    let currentPartIndex = 0;
    let simulationTimeout = null;

    function playConfrontationVideo() {
        currentPartIndex = 0;
        playNextPart();
    }

    function playNextPart() {
        if (currentPartIndex < confrontationParts.length) {
            const part = confrontationParts[currentPartIndex];
            subtitlesText.textContent = "[ CONEXIÓN SEGURA V-360 ]";
            
            // Set source dynamically directly on the video element for cross-platform compatibility
            if (videoConfrontacion) {
                videoConfrontacion.src = part.src;
                videoConfrontacion.load();
            }
            
            // Unmute and set volume
            videoConfrontacion.muted = false;
            videoConfrontacion.volume = 1.0;
            
            videoConfrontacion.play().then(() => {
                // Sync subtitles for this segment
                videoConfrontacion.ontimeupdate = () => {
                    const currentTime = videoConfrontacion.currentTime;
                    const matchingSubtitle = [...part.subtitles]
                        .reverse()
                        .find(sub => currentTime >= sub.time);
                    
                    if (matchingSubtitle) {
                        subtitlesText.textContent = matchingSubtitle.text;
                    } else {
                        subtitlesText.textContent = "[ CONEXIÓN SEGURA V-360 ]";
                    }
                };
            }).catch(err => {
                console.log(`Video segment ${currentPartIndex + 1} blocked or missing. Simulating...`, err);
                simulatePartScript(part);
            });

            videoConfrontacion.onended = () => {
                currentPartIndex++;
                playNextPart();
            };
        } else {
            finishAct3();
        }
    }

    // Fallback simulation if video file is missing or blocked
    function simulatePartScript(part) {
        let currentSubIndex = 0;

        function showNextSubtitle() {
            if (currentSubIndex < part.subtitles.length) {
                const sub = part.subtitles[currentSubIndex];
                subtitlesText.textContent = sub.text;
                
                const nextTime = part.subtitles[currentSubIndex + 1] 
                    ? (part.subtitles[currentSubIndex + 1].time - sub.time) * 1000 
                    : 4500;
                
                currentSubIndex++;
                simulationTimeout = setTimeout(showNextSubtitle, nextTime);
            } else {
                currentPartIndex++;
                playNextPart();
            }
        }
        showNextSubtitle();
    }

    function finishAct3() {
        if (simulationTimeout) clearTimeout(simulationTimeout);
        videoConfrontacion.ontimeupdate = null;
        videoConfrontacion.onended = null;
        
        // Play hangup beep sound
        playHangupTone();
        
        // Visual blink to black
        document.body.style.backgroundColor = '#000';
        setTimeout(() => {
            document.body.style.backgroundColor = '';
            transitionToAct(4);
        }, 600);
    }



    // Act 4: Telegram Chat Sequence
    function startChatSequence() {
        chatMessages.innerHTML = "";
        loginBox.classList.remove('active');
        chatBox.classList.add('active');
        
        const messages = [
            { type: 'bot', text: "Hola. He bloqueado tu acceso prioritario para el software de Simulación de Faciales 3D." },
            { type: 'bot', text: "Te acabo de generar una credencial temporal para pacientes VIP. Copia estos datos para desbloquear el sistema:" },
            { type: 'card', user: "@VITALIFE360DENTAL", pass: "QUIERO" },
            { type: 'bot', text: "Los datos de usuario y contraseña ya están pre-cargados. Puedes presionar el icono del ojo para verificar que están completos y hacer clic en Iniciar Sesión para entrar." }
        ];

        let msgIndex = 0;

        function deliverNextMessage() {
            if (msgIndex < messages.length) {
                // Show typing indicator
                typingIndicator.style.display = 'flex';
                
                const delay = messages[msgIndex].type === 'card' ? 1500 : 2500;

                setTimeout(() => {
                    typingIndicator.style.display = 'none';
                    const data = messages[msgIndex];
                    
                    const msgElement = document.createElement('div');
                    if (data.type === 'bot') {
                        msgElement.className = 'msg msg-bot';
                        msgElement.textContent = data.text;
                    } else if (data.type === 'card') {
                        msgElement.className = 'msg msg-cred-card';
                        msgElement.innerHTML = `
                            <h4>ACCESO TEMPORAL V-360</h4>
                            <div class="cred-details">
                                <div><span class="cred-label">USUARIO:</span> <span class="cred-val">${data.user}</span></div>
                                <div><span class="cred-label">CONTRASEÑA:</span> <span class="cred-val">${data.pass}</span></div>
                            </div>
                        `;
                    }
                    
                    chatMessages.appendChild(msgElement);
                    chatMessages.scrollTop = chatMessages.scrollHeight;
                    
                    msgIndex++;
                    deliverNextMessage();
                }, delay);
            } else {
                // Transitions to Login credentials screen after 4 seconds
                setTimeout(() => {
                    chatBox.classList.remove('active');
                    loginBox.classList.add('active');
                }, 4000);
            }
        }

        deliverNextMessage();
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.classList.toggle('fa-eye');
        togglePassword.classList.toggle('fa-eye-slash');
    });

    // Login Form Validation
    btnLogin.addEventListener('click', () => {
        const userVal = usernameInput.value.trim();
        const passVal = passwordInput.value.trim();

        if (userVal === '@VITALIFE360DENTAL' && passVal === 'QUIERO') {
            loginError.style.display = 'none';
            // Successful log in animation
            btnLogin.style.background = 'var(--phone-green)';
            btnLogin.textContent = "ACCESO CONCEDIDO";
            

            
            setTimeout(() => {
                transitionToAct(6);
            }, 1000);
        } else {
            loginError.style.display = 'flex';
            // Shake animation
            loginBox.style.animation = 'none';
            void loginBox.offsetWidth; // trigger reflow
            loginBox.style.animation = 'pulseScale 0.3s ease';
        }
    });

    // Act 5 Diagnostic Screen Control
    function loadDiagnosticVideo(videoSrc, title) {
        if (!videoVsl || !videoVslSource) return;
        
        videoVsl.pause();
        videoVslSource.src = videoSrc;
        videoVsl.load();
        
        // Update overlay title
        vslVideoBadge.innerHTML = `<i class="fa-solid fa-microscope"></i> SIMULACIÓN DE: ${title}`;
        
        videoVsl.play().catch(e => {
            console.log("Autoplay of diagnostic clip prevented by browser policy", e);
        });
    }

    // Act 6 iPhone Lockscreen Controls
    function updateLockscreenTime() {
        const timeEl = document.getElementById('lockscreen-time');
        const dateEl = document.getElementById('lockscreen-date');
        if (!timeEl || !dateEl) return;

        const now = new Date();
        
        let hours = now.getHours();
        let minutes = now.getMinutes();
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        timeEl.textContent = `${hours}:${minutes}`;

        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        
        const dayName = days[now.getDay()];
        const dayNum = now.getDate();
        const monthName = months[now.getMonth()];
        
        dateEl.textContent = `${dayName}, ${dayNum} de ${monthName}`;
    }

    function playNotificationSound() {
        initAudioContext();
        if (!audioCtx) return;
        
        const now = audioCtx.currentTime;
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const gain1 = audioCtx.createGain();
        const gain2 = audioCtx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(880, now);
        gain1.gain.setValueAtTime(0, now);
        gain1.gain.linearRampToValueAtTime(0.1, now + 0.05);
        gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1318.51, now + 0.08);
        gain2.gain.setValueAtTime(0, now + 0.08);
        gain2.gain.linearRampToValueAtTime(0.1, now + 0.12);
        gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.38);
        
        osc1.connect(gain1);
        gain1.connect(audioCtx.destination);
        
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.3);
        osc2.start(now + 0.08);
        osc2.stop(now + 0.45);
    }

    function playWhatsAppPlaySound() {
        initAudioContext();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(820, now + 0.15);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.12, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Click on the WhatsApp bubble on the lockscreen Jpeg -> Opens the audio chat
    const notifZone = document.getElementById('lockscreen-notif');
    if (notifZone) {
        notifZone.addEventListener('click', () => {
            playWhatsAppPlaySound();
            
            // Auto transition to Act 7 (WhatsApp Chat screen) after a short tap sound delay
            setTimeout(() => {
                transitionToAct(7);
            }, 300);
        });
    }

    // ACT 7: VOICE CHAT PANEL CONTROLLER
    const contactStatusText = document.getElementById('contact-status-text');
    const voiceChatBackBtn = document.getElementById('voice-chat-back');
    const chatBodyContainer = document.getElementById('voice-chat-body-container');
    const typingBubble = document.getElementById('chat-typing-bubble');

    // Audio Elements
    const audio1 = document.getElementById('audio-message-1');
    const audio2 = document.getElementById('audio-message-2');
    const audio3 = document.getElementById('audio-message-3');

    // Chat Bubbles
    const bubble1 = document.getElementById('voice-bubble-1');
    const videoBubble = document.getElementById('chat-video-bubble');
    const bubble2 = document.getElementById('voice-bubble-2');
    const bubble3 = document.getElementById('voice-bubble-3');
    const ctaCard = document.getElementById('chat-cta-card');

    // Play Buttons & Icons
    const playBtn1 = document.getElementById('voice-play-btn-1');
    const playIcon1 = document.getElementById('voice-play-icon-1');
    const durationLabel1 = document.getElementById('voice-duration-label-1');
    const barsContainer1 = document.getElementById('voice-bars-container-1');

    const playBtn2 = document.getElementById('voice-play-btn-2');
    const playIcon2 = document.getElementById('voice-play-icon-2');
    const durationLabel2 = document.getElementById('voice-duration-label-2');
    const barsContainer2 = document.getElementById('voice-bars-container-2');

    const playBtn3 = document.getElementById('voice-play-btn-3');
    const playIcon3 = document.getElementById('voice-play-icon-3');
    const durationLabel3 = document.getElementById('voice-duration-label-3');
    const barsContainer3 = document.getElementById('voice-bars-container-3');

    // Video Trigger & Overlay Modal
    const videoCardTrigger = document.getElementById('chat-video-card-trigger');
    const videoOverlayModal = document.getElementById('video-overlay-modal');
    const modalVideoPlayer = document.getElementById('modal-video-player');
    const closeVideoModalBtn = document.getElementById('close-video-modal-btn');

    // Generate simulated waveform bars for all three audios
    const barCount = 28;
    const barsList1 = [];
    const barsList2 = [];
    const barsList3 = [];
    
    function setupWaveformBars(container, list) {
        if (!container) return;
        container.innerHTML = '';
        for (let i = 0; i < barCount; i++) {
            const bar = document.createElement('div');
            bar.className = 'wave-bar';
            const baseHeight = Math.floor(Math.sin((i / barCount) * Math.PI) * 14) + 4;
            bar.style.height = `${baseHeight}px`;
            container.appendChild(bar);
            list.push({ element: bar, baseHeight: baseHeight });
        }
    }

    setupWaveformBars(barsContainer1, barsList1);
    setupWaveformBars(barsContainer2, barsList2);
    setupWaveformBars(barsContainer3, barsList3);

    // Auto-scroll chat body helper
    function scrollToBottom() {
        if (chatBodyContainer) {
            chatBodyContainer.scrollTop = chatBodyContainer.scrollHeight;
        }
    }

    // Dynamic Reset Routine when entering chat
    function resetContactStatus() {
        // Reset visibility
        if (videoBubble) videoBubble.classList.add('hidden');
        if (bubble2) bubble2.classList.add('hidden');
        if (bubble3) bubble3.classList.add('hidden');
        if (ctaCard) ctaCard.classList.add('hidden');
        if (typingBubble) typingBubble.classList.add('hidden');
        
        // Reset audio playbacks
        [audio1, audio2, audio3].forEach(a => {
            if (a) {
                a.pause();
                a.currentTime = 0;
            }
        });
        
        if (playIcon1) playIcon1.className = 'fa-solid fa-play';
        if (playIcon2) playIcon2.className = 'fa-solid fa-play';
        if (playIcon3) playIcon3.className = 'fa-solid fa-play';

        if (contactStatusText) {
            contactStatusText.textContent = "en línea";
            contactStatusText.className = "contact-status";
        }
        
        syncAudioProgress(audio1, durationLabel1, barsList1);
        syncAudioProgress(audio2, durationLabel2, barsList2);
        syncAudioProgress(audio3, durationLabel3, barsList3);
    }

    // Typing simulation progression helper
    function showTypingAndReveal(statusMsg, durationMs, revealCallback) {
        if (contactStatusText) {
            contactStatusText.textContent = statusMsg;
            contactStatusText.className = "contact-status recording";
        }
        if (typingBubble) {
            typingBubble.classList.remove('hidden');
            scrollToBottom();
        }

        setTimeout(() => {
            if (typingBubble) {
                typingBubble.classList.add('hidden');
            }
            if (contactStatusText) {
                contactStatusText.textContent = "en línea";
                contactStatusText.className = "contact-status";
            }
            if (revealCallback) revealCallback();
            scrollToBottom();
        }, durationMs);
    }

    // Update voice duration text and progress highlights
    function syncAudioProgress(audio, durationLabel, barsList) {
        if (!audio || !durationLabel) return;
        const cur = audio.currentTime;
        const dur = audio.duration || 10; // Fallback
        
        const formatTime = (time) => {
            const m = Math.floor(time / 60);
            const s = Math.floor(time % 60);
            return `${m}:${s < 10 ? '0' + s : s}`;
        };
        
        durationLabel.textContent = `${formatTime(cur)} / ${formatTime(dur)}`;
        
        const ratio = cur / dur;
        const barsPlayedCount = Math.floor(ratio * barCount);
        
        barsList.forEach((bar, index) => {
            if (index <= barsPlayedCount) {
                bar.element.classList.add('played');
                // Vibration physics simulation
                if (audio.paused === false) {
                    const vib = Math.sin((Date.now() / 45) + index) * 3.5;
                    bar.element.style.height = `${Math.max(4, bar.baseHeight + vib)}px`;
                }
            } else {
                bar.element.classList.remove('played');
                bar.element.style.height = `${bar.baseHeight}px`;
            }
        });

        if (audio.paused === false) {
            requestAnimationFrame(() => syncAudioProgress(audio, durationLabel, barsList));
        }
    }

    // Bind Controls for play button action
    function bindAudioControls(audio, playBtn, playIcon, durationLabel, barsList) {
        if (!audio || !playBtn || !playIcon) return;
        
        playBtn.addEventListener('click', () => {
            // Stop other playing audios
            [audio1, audio2, audio3].forEach(a => {
                if (a !== audio && a && !a.paused) {
                    a.pause();
                    if (a === audio1) playIcon1.className = 'fa-solid fa-play';
                    if (a === audio2) playIcon2.className = 'fa-solid fa-play';
                    if (a === audio3) playIcon3.className = 'fa-solid fa-play';
                }
            });

            if (audio.paused) {
                audio.play().then(() => {
                    playIcon.className = 'fa-solid fa-pause';
                    syncAudioProgress(audio, durationLabel, barsList);
                    if (contactStatusText) {
                        contactStatusText.textContent = "reproduciendo audio...";
                        contactStatusText.className = "contact-status recording";
                    }
                }).catch(e => console.log("Audio play blocked by browser policy:", e));
            } else {
                audio.pause();
                playIcon.className = 'fa-solid fa-play';
                if (contactStatusText) {
                    contactStatusText.textContent = "en línea";
                    contactStatusText.className = "contact-status";
                }
            }
        });

        audio.addEventListener('ended', () => {
            playIcon.className = 'fa-solid fa-play';
            audio.currentTime = 0;
            syncAudioProgress(audio, durationLabel, barsList);
            if (contactStatusText) {
                contactStatusText.textContent = "en línea";
                contactStatusText.className = "contact-status";
            }
        });

        audio.addEventListener('loadedmetadata', () => {
            syncAudioProgress(audio, durationLabel, barsList);
        });
    }

    bindAudioControls(audio1, playBtn1, playIcon1, durationLabel1, barsList1);
    bindAudioControls(audio2, playBtn2, playIcon2, durationLabel2, barsList2);
    bindAudioControls(audio3, playBtn3, playIcon3, durationLabel3, barsList3);

    // Sequential Triggers
    // 1. Audio 1 ends -> Show Video card
    if (audio1) {
        audio1.addEventListener('ended', () => {
            if (videoBubble && videoBubble.classList.contains('hidden')) {
                showTypingAndReveal("grabando video...", 1600, () => {
                    videoBubble.classList.remove('hidden');
                });
            }
        });
    }

    // 2. Click video card thumbnail -> Fullscreen modal play
    if (videoCardTrigger && videoOverlayModal && modalVideoPlayer) {
        videoCardTrigger.addEventListener('click', () => {
            // Stop any active audios
            [audio1, audio2, audio3].forEach(a => {
                if (a && !a.paused) a.pause();
            });
            playIcon1.className = 'fa-solid fa-play';
            playIcon2.className = 'fa-solid fa-play';
            playIcon3.className = 'fa-solid fa-play';

            videoOverlayModal.classList.remove('hidden');
            modalVideoPlayer.currentTime = 0;
            modalVideoPlayer.play().catch(e => console.log("Modal video blocked:", e));
        });

        // Close Modal handler
        function closeVideoModal() {
            modalVideoPlayer.pause();
            videoOverlayModal.classList.add('hidden');
            
            // Show typing indicator, then reveal Audio 2
            if (bubble2 && bubble2.classList.contains('hidden')) {
                showTypingAndReveal("grabando audio...", 2000, () => {
                    bubble2.classList.remove('hidden');
                });
            }
        }

        if (closeVideoModalBtn) closeVideoModalBtn.addEventListener('click', closeVideoModal);
        modalVideoPlayer.addEventListener('ended', closeVideoModal);
    }

    // 3. Audio 2 ends -> Show Audio 3
    if (audio2) {
        audio2.addEventListener('ended', () => {
            if (bubble3 && bubble3.classList.contains('hidden')) {
                showTypingAndReveal("grabando audio...", 2000, () => {
                    bubble3.classList.remove('hidden');
                });
            }
        });
    }

    // 4. Audio 3 ends -> Show final Voucher CTA Card
    if (audio3) {
        audio3.addEventListener('ended', () => {
            if (ctaCard && ctaCard.classList.contains('hidden')) {
                showTypingAndReveal("escribiendo...", 1200, () => {
                    ctaCard.classList.remove('hidden');
                });
            }
        });
    }

    // Chat back button navigation
    if (voiceChatBackBtn) {
        voiceChatBackBtn.addEventListener('click', () => {
            [audio1, audio2, audio3].forEach(a => {
                if (a) {
                    a.pause();
                    a.currentTime = 0;
                }
            });
            transitionToAct(6);
        });
    }
});
