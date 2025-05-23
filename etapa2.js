document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial de Borrow.js
    borrower.needs.mouse = true;
    borrower.checkWhatToBorrow();

    // Elementos del DOM
    const chats = document.querySelectorAll('.chat');
    const rosas = document.querySelectorAll('.rosa');
    
    // Historial de opciones seleccionadas
    const opcionesSeleccionadas = {};
    
    // Configurar el estado inicial
    chats.forEach((chat, index) => {
        chat.setAttribute('data-click-count', index === 0 ? '0' : '1');
    });

    function actualizarRosas(chatActual) {
        // Obtener el número del chat actual (ejemplo: chat-5 -> 5)
        const numeroChat = parseInt(chatActual.id.split('-')[1]);
        
        // Calcular qué imagen de rosa usar basado en el progreso
        const numeroRosa = Math.min(Math.ceil(numeroChat / 2), 5);
        
        // Calcular el aumento de tamaño (15% por cada cambio de rosa)
        const aumentoTamano = 1 + (0.15 * (numeroRosa - 1));
        const nuevoTamano = Math.round(100 * aumentoTamano);
        
        // Actualizar todas las rosas con la nueva imagen y tamaño
        rosas.forEach(rosa => {
            rosa.src = `/Imagenes/etapa2/rosa${numeroRosa}.svg`;
            rosa.style.width = `${nuevoTamano}px`;
            rosa.style.height = 'auto'; // Mantener proporción
        });
    }

    function normalizarTexto(texto) {
        // Eliminar todos los espacios en blanco y saltos de línea al inicio y final
        return texto.replace(/^\s+|\s+$/g, '');
    }

    function reemplazarTexto(elemento, textoAnterior, textoNuevo) {
        console.log('Intentando reemplazar:', {
            textoAnterior: textoAnterior,
            textoNuevo: textoNuevo,
            elementoId: elemento.id
        });

        // Buscar específicamente el elemento que contiene "Opción seleccionada"
        const textElements = Array.from(elemento.querySelectorAll('text'));
        console.log('Elementos text encontrados:', textElements.length);
        
        // Encontrar el elemento text que contiene el texto a reemplazar
        const elementoAReemplazar = textElements.find(textElement => {
            const contenido = normalizarTexto(textElement.textContent);
            console.log('Contenido normalizado:', JSON.stringify(contenido));
            return contenido === textoAnterior;
        });

        if (elementoAReemplazar) {
            console.log('Encontrado elemento a reemplazar. Contenido actual:', JSON.stringify(elementoAReemplazar.textContent));
            // Preservar el formato del texto original (espacios al inicio/final)
            const espaciosInicio = elementoAReemplazar.textContent.match(/^\s*/)[0];
            const espaciosFinal = elementoAReemplazar.textContent.match(/\s*$/)[0];
            elementoAReemplazar.textContent = espaciosInicio + textoNuevo + espaciosFinal;
            console.log('Nuevo contenido:', JSON.stringify(elementoAReemplazar.textContent));
        } else {
            console.log('No se encontró el elemento a reemplazar');
        }
    }

    function obtenerTextoOpcion(elemento) {
        console.log('Elemento recibido:', elemento);
        // Buscar el elemento text dentro del SVG
        const textElement = elemento.querySelector('text');
        console.log('Text element encontrado:', textElement);
        if (textElement) {
            // Si hay tspans, concatenar su contenido
            const tspans = textElement.querySelectorAll('tspan');
            if (tspans.length > 0) {
                const texto = Array.from(tspans)
                    .map(tspan => normalizarTexto(tspan.textContent))
                    .join(' ');
                console.log('Texto de tspans:', texto);
                return texto;
            }
            // Si no hay tspans, usar el contenido directo
            const texto = normalizarTexto(textElement.textContent);
            console.log('Texto directo:', texto);
            return texto;
        }
        return '';
    }

    function avanzarChat(currentChat, opcionSeleccionada = null) {
        const nextChat = currentChat.nextElementSibling;
        const currentChatId = currentChat.id;
        
        // Ocultar chat actual
        currentChat.setAttribute('data-click-count', '1');
        
        // Actualizar las rosas con el chat actual
        actualizarRosas(currentChat);
        
        if (nextChat && nextChat.classList.contains('chat')) {
            // Mostrar siguiente chat
            nextChat.setAttribute('data-click-count', '0');
            
            // Si hay una opción seleccionada, guardarla en el historial
            if (opcionSeleccionada) {
                const textoSeleccionado = obtenerTextoOpcion(opcionSeleccionada);
                opcionesSeleccionadas[currentChatId] = textoSeleccionado;
            }
            
            // Verificar si el siguiente chat tiene "Opción seleccionada"
            const tieneOpcionSeleccionada = Array.from(nextChat.querySelectorAll('text')).some(
                text => normalizarTexto(text.textContent) === 'Opción seleccionada'
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
                    reemplazarTexto(nextChat, 'Opción seleccionada', ultimaOpcion);
                }
            }
            
            // Verificar si el siguiente chat necesita avance automático
            verificarAvanceAutomatico(nextChat);
        }
    }

    function verificarAvanceAutomatico(chat) {
        // Verificar si el chat no tiene opciones o si todas las opciones están en la parte superior
        const opciones = chat.querySelectorAll('.opciones');
        const rect = chat.getBoundingClientRect();
        let tieneOpcionesAbajo = false;

        opciones.forEach(opcion => {
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
    chats.forEach(chat => {
        chat.addEventListener('click', function(event) {
            // Solo procesar si es el chat activo
            if (this.getAttribute('data-click-count') === '0') {
                const rect = this.getBoundingClientRect();
                const clickY = event.clientY - rect.top;
                
                // Solo procesar si el clic está en la mitad inferior
                if (clickY > rect.height / 2) {
                    // Verificar si el clic fue en una opción
                    const opcionClicada = event.target.closest('.opciones');
                    console.log('Elemento clickeado:', event.target);
                    console.log('Opción más cercana:', opcionClicada);
                    
                    if (opcionClicada) {
                        // Obtener el SVG padre que contiene el elemento text
                        const svgOpcion = opcionClicada.closest('svg');
                        console.log('SVG de la opción:', svgOpcion);
                        
                        if (svgOpcion) {
                            avanzarChat(this, svgOpcion);
                        } else {
                            console.log('No se encontró el SVG padre');
                        }
                    } else {
                        // Si no se hizo clic en una opción, verificar si hay opciones abajo
                        const opciones = this.querySelectorAll('.opciones');
                        let tieneOpcionesAbajo = false;
                        
                        opciones.forEach(opcion => {
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
});