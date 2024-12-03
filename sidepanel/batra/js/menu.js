var menuInnerHTML = ` <ul class="navbar-nav justify-content-center mt-lg-0">
                        <li class="nav-item">
                          <a href="listProfils.html" class="nav-link">Mes profils</a>
                        </li>
                        <li class="nav-item">
                          <a href="history.html" class="nav-link">Mes Historiques</a>
                        </li>
                        <li class="nav-item">
                          <a href="favory.html" class="nav-link">Mes Favoris</a>
                        </li>
                        <!--
                        <li class="nav-item">
                          <a href="recette.html" class="nav-link">Mes Recettes</a>
                        </li>
                                -->
                        <li class="nav-item">
                          <a href="apropos.html" class="nav-link">A propos</a>
                        </li>
                        <li class="nav-item">
                          <div id="languages">
                            Available languages : <br>
                            <img class="languageFlag" src="/images/languages/zh-CNP.svg" id="zh-CNP" alt="Mandarin">
                            <img class="languageFlag" src="/images/languages/es-ES.svg" id="es-ES" alt="Español">
                            <img class="languageFlag" src="/images/languages/en-US.svg" id="en-US" alt="English">
                            <img class="languageFlag" src="/images/languages/hi-IN.svg" id="hi-IN" alt="Hindi">
                            <img class="languageFlag" src="/images/languages/pt-BR.svg" id="pt-BR" alt="Português">
                            <img class="languageFlag" src="/images/languages/ru-RU.svg" id="ru-RU" alt="Русский">
                            <img class="languageFlag" src="/images/languages/ja-JP.svg" id="ja-JP" alt="日本語">
                            <img class="languageFlag" src="/images/languages/fr-FR.svg" id="fr-FR" alt="Français">
                            <img class="languageFlag" src="/images/languages/de-DE.svg" id="de-DE" alt="Deutsch">
                            <img class="languageFlag" src="/images/languages/it-IT.svg" id="it-IT" alt="Italiano">
                            <img class="languageFlag" src="/images/languages/ko-KR.svg" id="ko-KR" alt="한국의">
                            <img class="languageFlag" src="/images/languages/nl-NL.svg" id="nl-NL" alt="Nederlands">

                          </div>
                        </li>

                      </ul>`;

document.getElementById('navbarTogglerbur').innerHtml = menuInnerHTML;
