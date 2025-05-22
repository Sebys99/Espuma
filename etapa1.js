document.addEventListener("DOMContentLoaded", function () {
    let animationInterval;
    let primeraVezCerrado = true;
    const grupoClose = document.getElementById("close");
    const chat = document.getElementById("chat");
    const chatCerrado = document.getElementById("chatCerrado");
    const rosas = [
        document.getElementById("rosa1"),
        document.getElementById("rosa2"),
        document.getElementById("rosa3"),
        document.getElementById("rosa4"),
        document.getElementById("rosa5"),
        document.getElementById("rosa6")
    ];
    
    // Configuración inicial
    chatCerrado.style.display = "none";
    
    // Función para posicionar rosas en forma de estrella con rotaciones diferentes
    function posicionarEstrella() {
        // Posiciones de la estrella
        const posicionesEstrella = [
            { top: "15%", left: "50%" },   // Punta superior
            { top: "50%", left: "50%" },   // Centro
            { top: "70%", left: "15%" },   // Punta inferior izquierda
            { top: "70%", left: "85%" },   // Punta inferior derecha
            { top: "30%", left: "15%" },   // Punta media izquierda
            { top: "30%", left: "85%" }    // Punta media derecha
        ];
        
        // Asignar posición y angulo inicial diferente a cada rosa
        rosas.forEach((rosa, index) => {
            const posicion = posicionesEstrella[index];
            rosa.style.top = posicion.top;
            rosa.style.left = posicion.left;
            
            // angulo inicial diferente para cada rosa (60° de separación)
            const anguloInicial = index * 60; // 0°, 60°, 120°, 180°, 240°, 300°
            rosa.style.setProperty('--angulo-inicial', `${anguloInicial}deg`);
            
            // Activar rotación continua
            rosa.classList.add("girando");
        });
    }
    
    // Función para resetear posiciones a las originales
    function resetearPosiciones() {
        // Detener rotación
        rosas.forEach(rosa => {
            rosa.classList.remove("girando");
            rosa.style.removeProperty('--angulo-inicial');
        });
        
        // Rosa arriba
        rosas[0].style.top = "calc(0px - var(--tamanioRosa) / 3)";
        rosas[0].style.left = "50%";
        rosas[0].style.transform = "translateX(-50%)";
        
        // Rosa abajo
        rosas[1].style.bottom = "calc(0px - var(--tamanioRosa) / 3)";
        rosas[1].style.left = "50%";
        rosas[1].style.transform = "translateX(-50%)";
        rosas[1].style.top = "";
        
        // Rosas laterales
        rosas[2].style.left = "calc(0px - var(--tamanioRosa) / 2)";
        rosas[2].style.top = "25%";
        rosas[2].style.transform = "";
        
        rosas[3].style.left = "calc(0px - var(--tamanioRosa) / 2)";
        rosas[3].style.bottom = "25%";
        rosas[3].style.top = "";
        rosas[3].style.transform = "";
        
        rosas[4].style.right = "calc(0px - var(--tamanioRosa) / 2)";
        rosas[4].style.top = "25%";
        rosas[4].style.left = "";
        rosas[4].style.transform = "";
        
        rosas[5].style.right = "calc(0px - var(--tamanioRosa) / 2)";
        rosas[5].style.bottom = "25%";
        rosas[5].style.top = "";
        rosas[5].style.transform = "";
    }
    
    grupoClose.addEventListener("click", function() {
        if (primeraVezCerrado) {
            chat.style.display = "none";
            chatCerrado.style.display = "block";
            posicionarEstrella();
            animationInterval = setInterval(intercambiarPosiciones, 2000);
            primeraVezCerrado = false;
        } else {
            window.location.href = "etapa2.html";
        }
    });
    
    chatCerrado.addEventListener("click", function() {
        chat.style.display = "block";
        chatCerrado.style.display = "none";
        clearInterval(animationInterval);
        resetearPosiciones();
    });
    
    function intercambiarPosiciones() {
        const posiciones = rosas.map(rosa => ({
            top: rosa.style.top,
            left: rosa.style.left
        }));
        
        for (let i = 0; i < rosas.length; i++) {
            const nextIndex = (i + 1) % rosas.length;
            rosas[i].style.top = posiciones[nextIndex].top;
            rosas[i].style.left = posiciones[nextIndex].left;
        }
    }
});