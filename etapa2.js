document.addEventListener("DOMContentLoaded", function () {
  // Configuración inicial de Borrow.js
  borrower.needs.mouse = true;
  borrower.checkWhatToBorrow();
  // Obtener valor base de --tamanioRosa desde CSS
  const estiloComputado = getComputedStyle(document.documentElement);
  tamanoBaseRosa = parseFloat(
    estiloComputado.getPropertyValue("--tamanioRosa")
  );

  // Elementos del DOM
  const chats = document.querySelectorAll(".chat");
  const rosas = document.querySelectorAll(".rosa");

  // Historial de opciones seleccionadas
  const opcionesSeleccionadas = {};

  // Configurar el estado inicial
  chats.forEach((chat, index) => {
    chat.setAttribute("data-click-count", index === 0 ? "0" : "1");
  });

  function actualizarRosas(chatActual) {
    const numeroChat = parseInt(chatActual.id.split("-")[1]);
    const totalChats = document.querySelectorAll(".chat").length;

    // Calcular progreso (0 al 1)
    const progreso = numeroChat / totalChats;

    // Calcular qué imagen de rosa usar basado en el progreso
    const numeroRosa = Math.min(Math.ceil(numeroChat / 2), 5);

    // Aumentar tamaño un 50% en cada avance
    const factorCrecimiento = Math.pow(3, numeroChat); // 1.5^n
    const nuevoTamano = Math.round(tamanoBaseRosa * factorCrecimiento);

    // Calcular z-index basado en el progreso
    const nuevoZIndex = 5 + Math.floor(progreso * 15);

    // Actualizar todas las rosas
    rosas.forEach((rosa) => {
      rosa.src = `/Imagenes/etapa2/rosa${numeroRosa}.svg`;

      rosa.style.width = `${nuevoTamano}px`;
      rosa.style.height = "auto";
      rosa.style.zIndex = nuevoZIndex;

      // En el último chat, hazlas aún más grandes si deseas
      if (numeroChat >= totalChats - 1) {
        rosa.style.width = `${nuevoTamano * 2}px`;
      }

      // Mover rosas hacia el centro gradualmente
      if (numeroChat >= totalChats - 3) {
        rosas.forEach((rosa, index) => {
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
        });
      }
    });

    actualizarDegradado(progreso);

    // Si es el último chat, redirigir después de un breve tiempo
    if (numeroChat === totalChats) {
      setTimeout(() => {
        window.location.href = "etapa3.html";
      }, 1500);
    }
  }

  function normalizarTexto(texto) {
    // Eliminar todos los espacios en blanco y saltos de línea al inicio y final
    return texto.replace(/^\s+|\s+$/g, "");
  }

  function actualizarDegradado(progreso) {
    const porcentaje = Math.min(Math.round(progreso * 100), 100);

    // Colores del gradiente
    const colorMorado = "#FFDFE0";
    const colorTransicion = "rgba(83, 39, 72, 0.83)";
    const colorRosa = "rgba(83, 39, 72, 0.83)";

    // Usamos stops desfasados para una transición suave
    const mezcla = `
        linear-gradient(to left,
            ${colorRosa} 0%,
            ${colorTransicion} ${porcentaje - 10}%,
            ${colorMorado} ${porcentaje}%)
    `;

    // Aplicar el degradado solo al fondo general
    document.body.style.background = mezcla;
  }

  function cambiarMusica(src) {
    const audio = document.getElementById("musica");
    if (!audio) {
      console.error("Elemento de audio no encontrado");
      return;
    }

    // Pausar y resetear primero
    audio.pause();
    audio.currentTime = 0;

    if (src) {
      // Asegúrate de que la ruta comience con /
      const fullSrc = src.startsWith("/") ? src : `/${src}`;
      audio.src = fullSrc;

      // Esperar a que el audio pueda reproducirse
      audio.load(); // Forzar carga
      audio.play().catch((error) => {
        console.error("Error al reproducir audio:", error);
        // Mostrar un botón de activación si es necesario
        document.body.addEventListener("click", () => audio.play(), {
          once: true,
        });
      });
    }
  }

  function reemplazarTexto(elemento, textoAnterior, textoNuevo) {
    console.log("Intentando reemplazar:", {
      textoAnterior: textoAnterior,
      textoNuevo: textoNuevo,
      elementoId: elemento.id,
    });

    // Buscar específicamente el elemento que contiene "Opción seleccionada"
    const textElements = Array.from(elemento.querySelectorAll("text"));
    console.log("Elementos text encontrados:", textElements.length);

    // Encontrar el elemento text que contiene el texto a reemplazar
    const elementoAReemplazar = textElements.find((textElement) => {
      const contenido = normalizarTexto(textElement.textContent);
      console.log("Contenido normalizado:", JSON.stringify(contenido));
      return contenido === textoAnterior;
    });

    if (elementoAReemplazar) {
      console.log(
        "Encontrado elemento a reemplazar. Contenido actual:",
        JSON.stringify(elementoAReemplazar.textContent)
      );
      // Preservar el formato del texto original (espacios al inicio/final)
      const espaciosInicio = elementoAReemplazar.textContent.match(/^\s*/)[0];
      const espaciosFinal = elementoAReemplazar.textContent.match(/\s*$/)[0];
      elementoAReemplazar.textContent =
        espaciosInicio + textoNuevo + espaciosFinal;
      console.log(
        "Nuevo contenido:",
        JSON.stringify(elementoAReemplazar.textContent)
      );
    } else {
      console.log("No se encontró el elemento a reemplazar");
    }
  }

  function obtenerTextoOpcion(elemento) {
    console.log("Elemento recibido:", elemento);
    // Buscar el elemento text dentro del SVG
    const textElement = elemento.querySelector("text");
    console.log("Text element encontrado:", textElement);
    if (textElement) {
      // Si hay tspans, concatenar su contenido
      const tspans = textElement.querySelectorAll("tspan");
      if (tspans.length > 0) {
        const texto = Array.from(tspans)
          .map((tspan) => normalizarTexto(tspan.textContent))
          .join(" ");
        console.log("Texto de tspans:", texto);
        return texto;
      }
      // Si no hay tspans, usar el contenido directo
      const texto = normalizarTexto(textElement.textContent);
      console.log("Texto directo:", texto);
      return texto;
    }
    return "";
  }

  function avanzarChat(currentChat, opcionSeleccionada = null) {
    const nextChat = currentChat.nextElementSibling;
    const currentChatId = currentChat.id;

    // Ocultar chat actual
    currentChat.setAttribute("data-click-count", "1");

    // Actualizar las rosas con el chat actual
    actualizarRosas(currentChat);

    if (nextChat && nextChat.classList.contains("chat")) {
      // Mostrar siguiente chat
      nextChat.setAttribute("data-click-count", "0");

      // Si hay una opción seleccionada, guardarla en el historial
      if (opcionSeleccionada) {
        const textoSeleccionado = obtenerTextoOpcion(opcionSeleccionada);
        opcionesSeleccionadas[currentChatId] = textoSeleccionado;
      }

      // Verificar si el siguiente chat tiene "Opción seleccionada"
      const tieneOpcionSeleccionada = Array.from(
        nextChat.querySelectorAll("text")
      ).some(
        (text) => normalizarTexto(text.textContent) === "Opción seleccionada"
      );

      if (tieneOpcionSeleccionada) {
        // Buscar la última opción seleccionada
        let ultimaOpcion = null;
        let chatAnteriorId = currentChatId;
        while (chatAnteriorId) {
          if (opcionesSeleccionadas[chatAnteriorId]) {
            ultimaOpcion = opcionesSeleccionadas[chatAnteriorId];
            break;
          }
          const chatAnterior = document.getElementById(chatAnteriorId);
          chatAnteriorId = chatAnterior?.previousElementSibling?.id;
        }

        if (ultimaOpcion) {
          reemplazarTexto(nextChat, "Opción seleccionada", ultimaOpcion);
        }
      }

      const numeroChat = parseInt(currentChat.id.split("-")[1]);

      if (numeroChat === 3) {
        cambiarMusica("/audios/relax.wav");
      } else if (numeroChat === 5) {
        cambiarMusica("/audios/rock.wav");
      } else if (numeroChat === 10) {
        cambiarMusica("/audios/pitido.wav");
      }

      verificarAvanceAutomatico(nextChat);
    }
  }

  function verificarAvanceAutomatico(chat) {
    // Verificar si el chat no tiene opciones o si todas las opciones están en la parte superior
    const opciones = chat.querySelectorAll(".opciones");
    const rect = chat.getBoundingClientRect();
    let tieneOpcionesAbajo = false;

    opciones.forEach((opcion) => {
      const opcionRect = opcion.getBoundingClientRect();
      const opcionY = opcionRect.top - rect.top;
      if (opcionY > rect.height / 2) {
        tieneOpcionesAbajo = true;
      }
    });

    if (!tieneOpcionesAbajo) {
      setTimeout(() => avanzarChat(chat), 2000);
    }
  }

  // Event listener para los chats
  chats.forEach((chat) => {
    chat.addEventListener("click", function (event) {
      // Solo procesar si es el chat activo
      if (this.getAttribute("data-click-count") === "0") {
        const rect = this.getBoundingClientRect();
        const clickY = event.clientY - rect.top;

        // Solo procesar si el clic está en la mitad inferior
        if (clickY > rect.height / 2) {
          // Verificar si el clic fue en una opción
          const opcionClicada = event.target.closest(".opciones");
          console.log("Elemento clickeado:", event.target);
          console.log("Opción más cercana:", opcionClicada);

          if (opcionClicada) {
            // Obtener el SVG padre que contiene el elemento text
            const svgOpcion = opcionClicada.closest("svg");
            console.log("SVG de la opción:", svgOpcion);

            if (svgOpcion) {
              avanzarChat(this, svgOpcion);
            } else {
              console.log("No se encontró el SVG padre");
            }
          } else {
            // Si no se hizo clic en una opción, verificar si hay opciones abajo
            const opciones = this.querySelectorAll(".opciones");
            let tieneOpcionesAbajo = false;

            opciones.forEach((opcion) => {
              const opcionRect = opcion.getBoundingClientRect();
              const opcionY = opcionRect.top - rect.top;
              if (opcionY > rect.height / 2) {
                tieneOpcionesAbajo = true;
              }
            });

            if (!tieneOpcionesAbajo) {
              avanzarChat(this);
            }
          }
        }
      }
    });
  });

  // Verificar el primer chat para avance automático
  const primerChat = chats[0];
  if (primerChat) {
    verificarAvanceAutomatico(primerChat);
  }

  chat.addEventListener("click", function (event) {
    // Primero verificar si se hizo clic en una opción
    const opcionClicada = event.target.closest(".opciones");
    if (opcionClicada) {
      const svgOpcion = opcionClicada.closest("svg");
      if (svgOpcion) {
        avanzarChat(this, svgOpcion);
        return; // Salir si se clickeó una opción
      }
    }

    // Solo procesar clics en mitad inferior si no fue una opción
    if (this.getAttribute("data-click-count") === "0") {
      const rect = this.getBoundingClientRect();
      const clickY = event.clientY - rect.top;

      if (clickY > rect.height / 2) {
        const opcionesAbajo = Array.from(
          this.querySelectorAll(".opciones")
        ).some((opcion) => {
          const opcionRect = opcion.getBoundingClientRect();
          return opcionRect.top - rect.top > rect.height / 2;
        });

        if (!opcionesAbajo) {
          avanzarChat(this);
        }
      }
    }
  });
});
