var pageTTS = `Rechercher un produit grâce à son identifiant unique (8 ou 13 caractères) se trouvant sous le code barre, scan le code ou introduit le nombre.
`
function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}


var bacodeScanned = [];





