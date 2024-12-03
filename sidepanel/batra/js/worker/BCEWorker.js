
onmessage = function (e) {
    console.log('Message reçu depuis le script principal.');
    //console.log(e);
    console.log("data = " + e.data[0]);
    try {
        postMessage(printCardEntityFood(e.data[0]));
        console.log('Envoi du message de retour au script principal');
    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

function printCardEntityFood(object) {
    try {
        //console.log("objet = " + object);
        return `<div class="Entity ${object['NaceCode']}" style="display: grid;grid-template-columns: 1fr 1fr 1fr 1fr 1fr;border: 1px solid #d7d7d7;"><div><a href="https://kbopub.economie.fgov.be/kbopub/zoeknummerform.html?nummer=${object['EntityNumber']}" target="_BLANK"><img width="15px" src="img/link.svg"></a>${object['EntityNumber']}</div><div><a target="_BLANK" href="https://www.google.com/maps/search/${object['StreetFR']}+${object['HouseNumber']}+${object['Zipcode']}+${object['MunicipalityFR']}+${object['Denomination_FR']}"><img width="15px" src="img/link.svg"></a>${object['Denomination_FR']}<br><a target="_BLANK" href="https://www.google.com/maps/search/${object['StreetFR']}+${object['HouseNumber']}+${object['Zipcode']}+${object['MunicipalityFR']}+${object['Denomination_NL']}"><img width="15px" src="img/link.svg"></a>${object['Denomination_NL']}<br><a target="_BLANK" href="https://www.google.com/maps/search/${object['StreetFR']}+${object['HouseNumber']}+${object['Zipcode']}+${object['MunicipalityFR']}+${object['Denomination_DE']}"><img width="15px" src="img/link.svg"></a>${object['Denomination_DE']}</div><div><a target="_BLANK" href="https://www.google.com/maps/search/${object['StreetFR']}+${object['HouseNumber']}+${object['Zipcode']}+${object['MunicipalityFR']}"><img width="15px" src="img/link.svg"></a>${object['StreetFR']},${object['HouseNumber']}<br>${object['Zipcode']} - ${object['MunicipalityFR']}</div><div>${object['phone']}<br>${object['email']}<br>${object['website']}</div><div>${object['NaceCode']}<br>${object['NaceCode_desc']}</div></div>`


    } catch (error) {
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}
