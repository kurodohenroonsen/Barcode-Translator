

function activateMenuItem() {

    document.getElementById("nav-link_faq").classList.add("nav-link_actif");
    document.getElementById("nav-link_mobile_faq").classList.add("nav-link_actif");
}
$(document).ready(function () {
    var acc = document.getElementsByClassName("accordion");
    var i;

    for (i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {


          
        
          for (j = 0; j < acc.length; j++) {
              acc[j].classList.remove("active");
              var panel = acc[j].nextElementSibling;
              panel.style.maxHeight = null;
          }
        
          this.classList.toggle("active");
          var panel = this.nextElementSibling;
          if (panel.style.maxHeight) {
            panel.style.maxHeight = null;
          } else {
            panel.style.maxHeight = panel.scrollHeight + "px";
          }
        });
      }
      document.getElementById("loadingPanel").style.display = "none";

});
