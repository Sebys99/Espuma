document.addEventListener("DOMContentLoaded", function () {
    var grupoClose = document.getElementById("close");
    grupoClose.addEventListener("click", function () {
        document.getElementById("chat").style.display = "none";
        document.getElementById("chatCerrado").style.display = "block";
    })

    document.getElementById("close").addEventListener("click", function () {
        document.getElementById("chat").style.display = "none";

        // Rosa del centro (antes abajo)
        document.getElementById("rosa2").style.top = "50%";
        document.getElementById("rosa2").style.left = "50%";
        document.getElementById("rosa2").style.transform = "translate(-50%, -25%)";

        // Puntas de la estrella
        document.getElementById("rosa1").style.top = "15%";
        document.getElementById("rosa1").style.left = "50%";
        document.getElementById("rosa1").style.transform = "translate(-50%, -50%)";

        document.getElementById("rosa3").style.top = "70%";
        document.getElementById("rosa3").style.left = "-10%";

        document.getElementById("rosa4").style.top = "70%";
        document.getElementById("rosa4").style.left = "80%";

        document.getElementById("rosa5").style.top = "30%";
        document.getElementById("rosa5").style.left = "-20%";

        document.getElementById("rosa6").style.top = "30%";
        document.getElementById("rosa6").style.left = "85%";

        setInterval(intercambiarPosiciones, 2000);

    });


    document.getElementById("chatCerrado").addEventListener("click", function () {
        document.getElementById("chat").style.display = "block";
        document.getElementById("chatCerrado").style.display = "none";
    })

    function intercambiarPosiciones() {
        let rosa1 = document.getElementById("rosa1");
        let rosa2 = document.getElementById("rosa2");
        let rosa3 = document.getElementById("rosa3");
        let rosa4 = document.getElementById("rosa4");
        let rosa5 = document.getElementById("rosa5");
        let rosa6 = document.getElementById("rosa6");

        // Obtener las posiciones reales de cada rosa
        let posiciones = [
            { top: getComputedStyle(rosa1).top, left: getComputedStyle(rosa1).left },
            { top: getComputedStyle(rosa2).top, left: getComputedStyle(rosa2).left },
            { top: getComputedStyle(rosa3).top, left: getComputedStyle(rosa3).left },
            { top: getComputedStyle(rosa4).top, left: getComputedStyle(rosa4).left },
            { top: getComputedStyle(rosa5).top, left: getComputedStyle(rosa5).left },
            { top: getComputedStyle(rosa6).top, left: getComputedStyle(rosa6).left }
        ];

        // Rotamos las posiciones en orden contrario a las manecillas del reloj
        rosa1.style.top = posiciones[1].top;
        rosa1.style.left = posiciones[1].left;

        rosa2.style.top = posiciones[2].top;
        rosa2.style.left = posiciones[2].left;

        rosa3.style.top = posiciones[3].top;
        rosa3.style.left = posiciones[3].left;

        rosa4.style.top = posiciones[4].top;
        rosa4.style.left = posiciones[4].left;

        rosa5.style.top = posiciones[5].top;
        rosa5.style.left = posiciones[5].left;

        rosa6.style.top = posiciones[0].top;
        rosa6.style.left = posiciones[0].left;

        console.log(getComputedStyle(rosa1).top)
    }


});
