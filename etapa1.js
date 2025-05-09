document.querySelectorAll(".close").forEach(function(element) {
    element.addEventListener("click", function() {
        document.getElementById("chat").style.display= "none";
    });
});
