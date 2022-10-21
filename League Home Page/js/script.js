$(document).ready(function(ev){
     var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
     var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
         setTimeout(function(){}, 1000);
         return new bootstrap.Popover(popoverTriggerEl)
     })

  })
