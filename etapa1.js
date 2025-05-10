document.addEventListener("DOMContentLoaded", function () {
    let animationInterval;
    const grupoClose = document.getElementById("close");
    const chat = document.getElementById("chat");
    const chatCerrado = document.getElementById("chatCerrado");
    
    // Configuración inicial
    chatCerrado.style.display = "none";
    
    // Función para posicionar rosas en forma de estrella
    function posicionarEstrella() {
        // Centro
        document.getElementById("rosa2").style.top = "50%";
        document.getElementById("rosa2").style.left = "50%";
        document.getElementById("rosa2").style.transform = "translate(-50%, -50%)";
        
        // Puntas de la estrella
        document.getElementById("rosa1").style.top = "15%";
        document.getElementById("rosa1").style.left = "50%";
        document.getElementById("rosa1").style.transform = "translate(-50%, -50%)";
        
        document.getElementById("rosa3").style.top = "70%";
        document.getElementById("rosa3").style.left = "15%";
        document.getElementById("rosa3").style.transform = "translate(-50%, -50%)";
        
        document.getElementById("rosa4").style.top = "70%";
        document.getElementById("rosa4").style.left = "85%";
        document.getElementById("rosa4").style.transform = "translate(-50%, -50%)";
        
        document.getElementById("rosa5").style.top = "30%";
        document.getElementById("rosa5").style.left = "15%";
        document.getElementById("rosa5").style.transform = "translate(-50%, -50%)";
        
        document.getElementById("rosa6").style.top = "30%";
        document.getElementById("rosa6").style.left = "85%";
        document.getElementById("rosa6").style.transform = "translate(-50%, -50%)";
    }
    
    // Función para resetear posiciones a las originales
    function resetearPosiciones() {
        // Rosa arriba
        document.getElementById("rosa1").style.top = "calc(0px - var(--tamanioRosa) / 3)";
        document.getElementById("rosa1").style.left = "50%";
        document.getElementById("rosa1").style.transform = "translateX(-50%)";
        
        // Rosa abajo
        document.getElementById("rosa2").style.bottom = "calc(0px - var(--tamanioRosa) / 3)";
        document.getElementById("rosa2").style.left = "50%";
        document.getElementById("rosa2").style.transform = "translateX(-50%)";
        document.getElementById("rosa2").style.top = "";
        
        // Rosas laterales
        document.getElementById("rosa3").style.left = "calc(0px - var(--tamanioRosa) / 2)";
        document.getElementById("rosa3").style.top = "25%";
        document.getElementById("rosa3").style.transform = "";
        
        document.getElementById("rosa4").style.left = "calc(0px - var(--tamanioRosa) / 2)";
        document.getElementById("rosa4").style.bottom = "25%";
        document.getElementById("rosa4").style.top = "";
        document.getElementById("rosa4").style.transform = "";
        
        document.getElementById("rosa5").style.right = "calc(0px - var(--tamanioRosa) / 2)";
        document.getElementById("rosa5").style.top = "25%";
        document.getElementById("rosa5").style.left = "";
        document.getElementById("rosa5").style.transform = "";
        
        document.getElementById("rosa6").style.right = "calc(0px - var(--tamanioRosa) / 2)";
        document.getElementById("rosa6").style.bottom = "25%";
        document.getElementById("rosa6").style.top = "";
        document.getElementById("rosa6").style.transform = "";
    }
    
    // Función para intercambiar posiciones en forma de estrella
    function intercambiarPosiciones() {
        const rosas = [
            document.getElementById("rosa1"),
            document.getElementById("rosa3"),
            document.getElementById("rosa5"),
            document.getElementById("rosa2"),
            document.getElementById("rosa6"),
            document.getElementById("rosa4")
        ];
        
        // Guardar posiciones actuales
        const posiciones = rosas.map(rosa => ({
            top: rosa.style.top,
            left: rosa.style.left
        }));
        
        // Rotar posiciones en sentido antihorario
        for (let i = 0; i < rosas.length; i++) {
            const nextIndex = (i + 1) % rosas.length;
            rosas[i].style.top = posiciones[nextIndex].top;
            rosas[i].style.left = posiciones[nextIndex].left;
        }
    }
    
    // Evento para cerrar el chat
    grupoClose.addEventListener("click", function() {
        chat.style.display = "none";
        chatCerrado.style.display = "block";
        posicionarEstrella();
        
        // Iniciar animación cada 2 segundos
        animationInterval = setInterval(intercambiarPosiciones, 2000);
    });
    
    // Evento para abrir el chat
    chatCerrado.addEventListener("click", function() {
        chat.style.display = "block";
        chatCerrado.style.display = "none";
        
        // Detener la animación
        clearInterval(animationInterval);
        
        // Resetear posiciones
        resetearPosiciones();
    });
});
