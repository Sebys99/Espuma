document.addEventListener("DOMContentLoaded", function () {
    borrower.needs.mouse = true;
    borrower.checkWhatToBorrow();

    const chats = document.querySelectorAll(".chat");
    const rosas = document.querySelectorAll(".rosa");
    const opcionesSeleccionadas = {};

    chats.forEach((chat, index) => {
        chat.setAttribute("data-click-count", index === 0 ? "0" : "1");
    });

    function actualizarRosas(chatActual) {
        const numeroChat = parseInt(chatActual.id.split("-")[1]);
        const totalChats = document.querySelectorAll(".chat").length;
        const progreso = numeroChat / totalChats;
        const numeroRosa = Math.min(Math.ceil(numeroChat / 2), 5);

        const aumentoTamano = Math.pow(1.2, numeroRosa - 1);
        const nuevoTamano = Math.round(100 * aumentoTamano);
        const nuevoZIndex = 5 + Math.floor(progreso * 15);

        rosas.forEach((rosa, index) => {
            rosa.src = `/Imagenes/etapa2/rosa${numeroRosa}.svg`;
            rosa.style.width = `${nuevoTamano}px`;
            rosa.style.height = "auto";
            rosa.style.zIndex = nuevoZIndex;

            if (numeroChat >= totalChats - 1) {
                rosa.style.width = `${nuevoTamano * 2}px`;
            }

            if (numeroChat >= totalChats - 3) {
                const centroX = 50;
                const centroY = 50;
                let nuevaX, nuevaY;
                if (index % 2 === 0) {
                    nuevaX = centroX + 10 * (index / 2);
                    nuevaY = centroY + 10 * (index / 2);
                } else {
                    nuevaX = centroX - 10 * Math.floor(index / 2);
                    nuevaY = centroY - 10 * Math.floor(index / 2);
                }
                rosa.style.left = `${nuevaX}%`;
                rosa.style.top = `${nuevaY}%`;
                rosa.style.transform = "translate(-50%, -50%)";
            }
        });

        actualizarDegradado(progreso);

        if (numeroChat === totalChats) {
            setTimeout(() => {
                window.location.href = "etapa3.html";
            }, 1500);
        }
    }

    function actualizarDegradado(progreso) {
        const porcentaje = Math.min(Math.round(progreso * 100), 100);
        const colorMorado = "#FFDFE0";
        const colorTransicion = "rgba(83, 39, 72, 0.83)";
        const colorRosa = "rgba(83, 39, 72, 0.83)";
        const mezcla = `linear-gradient(to left, ${colorRosa} 0%, ${colorTransicion} ${porcentaje - 10}%, ${colorMorado} ${porcentaje}%)`;
        document.body.style.background = mezcla;
    }

    function cambiarMusica(src) {
        const audio = document.getElementById("musica");
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        if (src) {
            const fullSrc = src.startsWith("/") ? src : `/${src}`;
            audio.src = fullSrc;
            audio.load();
            audio.play().catch(() => {
                document.body.addEventListener("click", () => audio.play(), { once: true });
            });
        }
    }

    function avanzarChat(currentChat, opcionSeleccionada = null) {
        const nextChat = currentChat.nextElementSibling;
        currentChat.setAttribute("data-click-count", "1");
        actualizarRosas(currentChat);

        if (nextChat && nextChat.classList.contains("chat")) {
            nextChat.setAttribute("data-click-count", "0");
            if (opcionSeleccionada) {
                const textoSeleccionado = obtenerTextoOpcion(opcionSeleccionada);
                opcionesSeleccionadas[currentChat.id] = textoSeleccionado;
            }
            const tieneOpcion = Array.from(nextChat.querySelectorAll("text")).some(t => normalizarTexto(t.textContent) === "Opción seleccionada");
            if (tieneOpcion) {
                let ultimaOpcion = null;
                let anteriorId = currentChat.id;
                while (anteriorId) {
                    if (opcionesSeleccionadas[anteriorId]) {
                        ultimaOpcion = opcionesSeleccionadas[anteriorId];
                        break;
                    }
                    const anterior = document.getElementById(anteriorId);
                    anteriorId = anterior?.previousElementSibling?.id;
                }
                if (ultimaOpcion) {
                    reemplazarTexto(nextChat, "Opción seleccionada", ultimaOpcion);
                }
            }
            const numChat = parseInt(currentChat.id.split("-")[1]);
            if (numChat === 3) cambiarMusica("/audios/relax.wav");
            else if (numChat === 5) cambiarMusica("/audios/rock.wav");
            else if (numChat === 10) cambiarMusica("/audios/pitido.wav");

            verificarAvanceAutomatico(nextChat);
        }
    }

    function normalizarTexto(texto) {
        return texto.replace(/^\s+|\s+$/g, "");
    }

    function reemplazarTexto(el, textoAnt, textoNuevo) {
        const textos = Array.from(el.querySelectorAll("text"));
        const target = textos.find(t => normalizarTexto(t.textContent) === textoAnt);
        if (target) {
            const ini = target.textContent.match(/^\s*/)[0];
            const fin = target.textContent.match(/\s*$/)[0];
            target.textContent = ini + textoNuevo + fin;
        }
    }

    function obtenerTextoOpcion(el) {
        const textEl = el.querySelector("text");
        if (textEl) {
            const tspans = textEl.querySelectorAll("tspan");
            if (tspans.length > 0) return Array.from(tspans).map(t => normalizarTexto(t.textContent)).join(" ");
            return normalizarTexto(textEl.textContent);
        }
        return "";
    }

    function verificarAvanceAutomatico(chat) {
        const opciones = chat.querySelectorAll(".opciones");
        const rect = chat.getBoundingClientRect();
        const hayAbajo = Array.from(opciones).some(op => op.getBoundingClientRect().top - rect.top > rect.height / 2);
        if (!hayAbajo) setTimeout(() => avanzarChat(chat), 2000);
    }

    chats.forEach((chat) => {
        chat.addEventListener("click", function (event) {
            if (this.getAttribute("data-click-count") !== "0") return;
            const rect = this.getBoundingClientRect();
            const clickY = event.clientY - rect.top;
            if (clickY <= rect.height / 2) return;

            const opcionClicada = event.target.closest(".opciones");
            const svgOpcion = opcionClicada?.closest("svg");
            if (svgOpcion) {
                avanzarChat(this, svgOpcion);
            } else {
                const opciones = this.querySelectorAll(".opciones");
                const tieneAbajo = Array.from(opciones).some(op => op.getBoundingClientRect().top - rect.top > rect.height / 2);
                if (!tieneAbajo) avanzarChat(this);
            }
        });
    });

    if (chats[0]) verificarAvanceAutomatico(chats[0]);
});
