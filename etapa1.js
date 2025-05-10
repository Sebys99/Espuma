document.addEventListener("DOMContentLoaded", function() {
    var grupoClose = document.getElementById("close");

    if (grupoClose) {
        grupoClose.addEventListener("click", function() {
            document.getElementById("chat").style.display = "none";
        });
    } else {
        console.error("El elemento #close no se encuentra en el DOM.");
    }
});
