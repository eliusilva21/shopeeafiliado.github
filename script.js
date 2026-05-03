// ================= CRONÔMETRO PERSISTENTE (7 MINUTOS) =================
const DURACAO_TOTAL = 10 * 60 * 1000; // Alterado para 7 minutos

function obterDataFinal() {
    let final = localStorage.getItem('oferta_final');
    
    // Se não houver data OU se você quiser "forçar" os 7 minutos agora:
    if (!final) {
        final = Date.now() + DURACAO_TOTAL;
        localStorage.setItem('oferta_final', final);
    }
    
    return parseInt(final);
}

let dataFinal = obterDataFinal();
let msVisual = 0;

const timer = setInterval(() => {
    const tempoEl = document.getElementById('tempo');
    if (!tempoEl) return;

    // Calcula a diferença real entre "agora" e a "data final" salva
    let tempoRestante = dataFinal - Date.now();

    if (tempoRestante <= 0) {
        // ... (mantenha o restante do seu código de finalização aqui)
        clearInterval(timer);
        const titulo = document.querySelector("#cronometro .titulo");
        if (titulo) titulo.remove();
        tempoEl.textContent = "OFERTA QUASE ESGOTADA!";
        tempoEl.classList.add("piscar");
        return;
    }

    let minutos = Math.floor(tempoRestante / 60000);
    let segundos = Math.floor((tempoRestante % 60000) / 1000);
    
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    
    msVisual = (msVisual + 1) % 31;
    let msText = msVisual < 10 ? '0' + msVisual : msVisual;

    tempoEl.textContent = `${minutos}:${segundos}:${msText}`;
}, 33);

// ================= COPIAR ID =================
function copiarID(codigo, botao) {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(codigo)
        .then(() => {
            const originalText = botao.innerText;
            botao.innerText = "Copiado! ✓";
            botao.style.background = "#28a745"; 
            setTimeout(() => {
                botao.innerText = originalText;
                botao.style.background = ""; 
            }, 1500);
        });
}

// ================= OVERLAY TIKTOK =================
window.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("overlay-tiktok");
    if (!overlay) return;

    const ua = navigator.userAgent || navigator.vendor || window.opera;
    const isInApp = /TikTok|musical_ly|FBAN|FBAV|Instagram|Snapchat/i.test(ua);

    if (isInApp && !localStorage.getItem("overlayVisto")) {
        overlay.classList.add("active");
        overlay.style.display = "flex"; 
    } else {
        overlay.style.display = "none";
        overlay.remove(); 
    }

    if (/Android/i.test(ua)) {
        document.body.classList.add("is-android");
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
        document.body.classList.add("is-ios");
    }
});

// ================= ABRIR NAVEGADOR (PLANO B) =================
function abrirFora(event) {
    if (event) event.preventDefault();
    const btn = document.querySelector(".btn-principal");

    if (btn) {
        btn.innerHTML = "Siga o passo 1 e 2 acima ↑";
        btn.style.background = "#111";
        btn.style.color = "#0088ff";
        btn.style.border = "1px solid #0088ff";
        btn.classList.add("shake-effect");
        btn.style.pointerEvents = "none"; 
    }

    if (/Android/i.test(navigator.userAgent)) {
        const url = window.location.href;
        let clean = url.replace(/^https?:\/\//, '');
        window.location.href = "intent://" + clean + "#Intent;scheme=https;end;";
    }
}

function fecharSeFora(event) {
    const box = document.querySelector("#overlay-tiktok .box");
    if (box && !box.contains(event.target)) {
        continuarOverlay();
    }
}

function fecharOverlay() {
    const overlay = document.getElementById("overlay-tiktok");
    if (overlay) {
        overlay.classList.remove("active");
        overlay.style.display = "none"; // Garante que sumiu
    }
}

function continuarOverlay() {
    fecharOverlay();
}