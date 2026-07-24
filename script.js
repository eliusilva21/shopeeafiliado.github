// ================= CRONÔMETRO PERSISTENTE (7 MINUTOS) =================
// Corrigido para 7 minutos de duração (7 * 60 * 1000)
const DURACAO_TOTAL = 7 * 60 * 1000; 
// 24 horas em milissegundos
const TEMPO_DE_RESET = 24 * 60 * 60 * 1000; 

function obterDataFinal() {
    let final = localStorage.getItem('oferta_final');
    let inicio = localStorage.getItem('oferta_inicio');
    const agora = Date.now();
    
    // Se não houver registro (primeira visita) OU se já passaram 24 horas desde o início
    if (!final || !inicio || agora >= parseInt(inicio) + TEMPO_DE_RESET) {
        final = agora + DURACAO_TOTAL;
        
        // Atualiza o localStorage com o novo tempo final e o início do novo ciclo de 24h
        localStorage.setItem('oferta_final', final);
        localStorage.setItem('oferta_inicio', agora); 
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
        clearInterval(timer);
        
        const titulo = document.querySelector("#cronometro .titulo");
        if (titulo) titulo.remove();
        
        tempoEl.textContent = "OFERTA QUASE ESGOTADA!";
        tempoEl.classList.add("piscar");
        return;
    }

    // Cálculos de minutos e segundos
    let minutos = Math.floor(tempoRestante / 60000);
    let segundos = Math.floor((tempoRestante % 60000) / 1000);
    
    // Formatação com zero à esquerda
    minutos = minutos < 10 ? '0' + minutos : minutos;
    segundos = segundos < 10 ? '0' + segundos : segundos;
    
    // Milissegundos visuais (efeito estético)
    msVisual = (msVisual + 1) % 31;
    let msText = msVisual < 10 ? '0' + msVisual : msVisual;

    // Atualiza a tela
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

// ================= TRANSIÇÃO SUAVE (VERSÃO ANTI-BUG) =================
document.addEventListener("click", (e) => {
    const link = e.target.closest("a");

    if (link && link.href.includes(window.location.origin) && !link.target) {
        e.preventDefault();
        const url = link.href;

        const container = document.querySelector(".container");
        if (!container) {
            window.location.href = url;
            return;
        }

        const isVoltar = link.classList.contains("btn-voltar") || url.includes("index.html");

        // Em vez de injetar HTML, vamos apenas animar a SAÍDA da página atual
        container.style.transition = "transform 0.4s ease, opacity 0.3s ease";
        container.style.opacity = "0";
        
        if (isVoltar) {
            container.style.transform = "translateX(100%)"; // Desliza para a direita ao voltar
        } else {
            container.style.transform = "translateX(-100%)"; // Desliza para a esquerda ao entrar
        }

        // Aguarda a animação e muda de página de verdade
        setTimeout(() => {
            window.location.href = url;
        }, 400);
    }
});

async function encurtarLinkPeloSite(urlLonga) {
    const resposta = await fetch("http://127.0.0.1:8000/encurtar", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            url: urlLonga
        })
    });

    const dados = await resposta.json();
    console.log("Link curto criado:", dados.short_url);
    return dados.short_url;
}