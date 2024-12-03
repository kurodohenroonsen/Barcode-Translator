$("a[href='#top']").click(function () {
  $("html, body").animate({ scrollTop: 0 }, "slow");
  return false;
});

var selectedAvatarId = "none";
var selectedAvatar;
let db = new Localbase('db_batra_link');
var profilsLoaded;
var default_otherPrompt = `Explain the product's history in a kid-friendly way, list benefits and drawbacks, analyze suitability for general use, then if food share 2 full recipes from 2 differents country using it else other product type then give usage and storage instructions, give also 4 alternatives. Keep blocks concise and TTS-friendly in style.`
var default_foodPrompt = `Explain the product's history in a kid-friendly way, list benefits and drawbacks, analyze suitability for general use, then share 2 full recipes and 4 alternatives. Keep blocks concise and TTS-friendly in style. `;


$("#saveBtn").click(function () {
  selectedAvatar.promptFood = document.getElementById('promptFood').innerHTML;
  selectedAvatar.promptOther = document.getElementById('promptOther').innerHTML;
  saveProfile();


});
function saveProfile() {
  db.collection('profil').doc({ id: selectedAvatar.id }).update({
    promptFood: selectedAvatar.promptFood,
    promptOther: selectedAvatar.promptOther
})


}
function refreshListeners() {
  $(".profilsImgPromptConfig").click(function () {
    var avatars = document.getElementsByClassName("profilsImgPromptConfig");
    for (let index = 0; index < avatars.length; index++) {
      avatars[index].classList.add('avatar_img_unselected');
    }
    selectedAvatarId = this.id;
    this.classList.add('avatar_img_selected');
    this.classList.remove('avatar_img_unselected');

    for (var i = 0; i < profilsLoaded.length; i++) {
      if (this.id == profilsLoaded[i].id) {
        selectedAvatar = profilsLoaded[i];
        if (profilsLoaded[i].promptFood) {
          document.getElementById('promptFood').innerHTML = profilsLoaded[i].promptFood;
        } else {

          document.getElementById('promptFood').innerHTML = default_foodPrompt;;


        }
        if (profilsLoaded[i].promptOther) {
          document.getElementById('promptOther').innerHTML = profilsLoaded[i].promptOther;
        } else {

          document.getElementById('promptOther').innerHTML = default_otherPrompt;;


        }
        document.getElementById('saveBtn').classList.remove('popupGeminiButton_unselected');
        document.getElementById('saveBtn').removeAttribute('disabled');
      }
    }
    return false;
  });
}

async function loadProfils() {
  await db.collection('profil').get().then(profils => {
    profilsLoaded = profils;
    for (var i = 0; i < profils.length; i++) {
      $(".avatar_img").css("width", "50px");
      $("#profilsList").html($("#profilsList").html() + ` <div class="container avatarPrompt" style=" width: 120px;margin: auto;" >
                                    <img src="img/avatars/${profils[i].id}.png" id="${profils[i].id}" class="avatar_img_unselected profilsImgPromptConfig"><br><b>${profils[i].speudo}</b><div class="profil_edit_overlay">
                                  </div>
                                  </div>`);
    }

    refreshListeners();
    if (localStorage.getItem("black_yellow_mode") == "true") {
      changeStyle()
    }
  })
}
loadProfils();



