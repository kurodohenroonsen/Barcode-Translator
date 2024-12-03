$("a[href='#top']").click(function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});





function refreshListeners() {
  $(".avatar_img").click(function () {
    var avatars = document.getElementsByClassName("avatar_img");
    for (let index = 0; index < avatars.length; index++) {
      avatars[index].classList.add('avatar_img_unselected');

    }
    selectedAvatarId = this.id;
    this.classList.add('avatar_img_selected');
    this.classList.remove('avatar_img_unselected');

    if ($("#new_speudo").val().length > 0) {
      $("#add_button").removeClass("button_disabled");
    } else {
      $("#add_button").addClass("button_disabled");
    }
    return false;
  });
  $("#new_speudo").change(function () {
    var avatars = document.getElementsByClassName("avatar_img_selected");
    if (this.value.length > 0 && avatars.length > 0) {
      $("#add_button").removeClass("button_disabled");
    } else {
      $("#add_button").addClass("button_disabled");
    }
  });
  $("#add_button").click(function () {

    if (!$("#add_button").hasClass("button_disabled")) {
      addToDB();
      $("#profilsList").html($("#profilsList").html() + ` <div class="container profil " style=" width: 300px;margin: auto;" id="profil_1">
                                    <img src="${document.getElementById(selectedAvatarId).src}" class="avatar_img_profil"><h3>${$("#new_speudo").val()}</h3><div class="profil_edit_overlay">
                                      <a href="detailProfil.html?profilId=${selectedAvatarId}">
                                        <img src="img/parametre.svg">
</a>
</div><div class="profil_trash_overlay"><img class="profil_trash"src="img/trash.svg" onclick="deleteProfil('${selectedAvatarId}')"></div>
                                  </div><br>`);
      $("#add_button").addClass("button_disabled");

      $("#new_speudo").val("");
      $(".avatar_img").css("width", "50px");

      if (document.getElementsByClassName("profil").length == 6) {
        document.getElementById("newAvatarForm").style.display = "none";
      }
      refreshListeners();
    }

    return true;
  });
}
var selectedAvatarId = "none";
let db = new Localbase('db_batra_link');
function addToDB() {
  var avatarId = selectedAvatarId;
  document.getElementById(selectedAvatarId).style.display = "none";
  var inputSpeudo = $("#new_speudo").val();
  db.collection('profil').add({
    id: avatarId,
    speudo: inputSpeudo,
    allergens: [],
    additifs: []
  }, avatarId);

}

async function loadProfils() {
  await db.collection('profil').get().then(profils => {
    for (var i = 0; i < profils.length; i++) {
      $(".avatar_img").css("width", "50px");
      document.getElementById(profils[i].id).style.display = "none";
      $("#profilsList").html($("#profilsList").html() + ` <div class="container profil " style=" width: 300px;margin: auto;" id="profil_1">
                                    <img src="img/avatars/${profils[i].id}.png" class="avatar_img_profil"><h3>${profils[i].speudo}</h3><div class="profil_edit_overlay"><a href="detailProfil.html?profilId=${profils[i].id}">
                                      <img src="img/parametre_BY_${localStorage.getItem("black_yellow_mode")}.svg"></a>
                                  </div><div class="profil_trash_overlay" onclick="deleteProfil('${profils[i].id}')"><img class="profil_trash"src="img/trash_BY_${localStorage.getItem("black_yellow_mode")}.svg"></div>
                                  </div><br>`);
    }
    if (profils.length == 6) {
      $("#newAvatarForm").css("display", "none");
    }
    refreshListeners();
    if (localStorage.getItem("black_yellow_mode") == "true") {
      changeStyle()
    }
  })
}
loadProfils();
async function deleteProfil(profilId) {
  await db.collection('profil').doc({ id: profilId }).delete().then(profils => {

    window.location.href = window.location.href;

  });

}
const burgerButton = document.querySelector('.burger');
const menuList = document.querySelector('.menu-list');
/*
  burgerButton.addEventListener('click', function () {
    menuList.classList.toggle('show');
  });
*/
function searchGtin() {
  window.location = "productFull.html?gtin=" + document.getElementById("gtinSearch").value;
}
function showDetails(markElem) {
  if (markElem.parentElement.children[0].style.display == "none") {
    markElem.parentElement.children[0].style.display = "block";
  } else {
    markElem.parentElement.children[0].style.display = "none";
  }

}
var moreInfos = document.getElementsByClassName('apropos_overlay');
for (let index = 0; index < moreInfos.length; index++) {
  const element = moreInfos[index];
  element.addEventListener('click', async (event) => {
    showDetails(event.target);
  });

}
localStorage.setItem('hasViewWelcomeMessages', "coucou");