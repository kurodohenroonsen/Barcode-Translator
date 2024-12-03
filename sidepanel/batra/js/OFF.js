var GS1json = new Object();
var currentGtin;
var tradeItemClassification = new Object();
tradeItemClassification['gpcCategoryCode'] = 'inconnu';
GS1json['tradeItemClassification'] = tradeItemClassification;

var nutritionalInformation = new Object();
GS1json['nutritionalInformation'] = nutritionalInformation;
var nutrientHeaders = new Object();
GS1json['nutritionalInformation']['nutrientHeaders'] = nutrientHeaders;
var nutrientHeader = new Object();
GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader'] = nutrientHeader;
var nutrientBasisQuantity = new Object();
GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader']['nutrientBasisQuantity'] = nutrientBasisQuantity;
GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader']['nutrientBasisQuantity']['content'] = '100';



var nutrientDetails = new Object();
GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader']['nutrientDetails'] = nutrientDetails;
var nutrientDetail = new Array();
GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader']['nutrientDetails']['nutrientDetail'] = nutrientDetail;



function getJSONFromOFF(gtin13) {


    $.get("https://fr.openfoodfacts.org/api/v0/product/" + gtin13, async function (data) {
        const obj = JSON.parse(JSON.stringify(data));
        if ("1" == obj.status) {
            var offJson = JSON.parse(JSON.stringify(obj));
            parseOFFtoGS1Recursif(offJson, "");
            populateData(GS1json);
            jsonProductGlobal = GS1json;
            addHistory();
            loadProfils();
        } else {
            
            document.getElementById("notFound").setAttribute('data',gtin13 );
            document.getElementById("notFound").click();
            
            //showMissingDialog();
        }
    });
}
var cptAllergens = 0;
function addNutrient(nutrientTypeCode, measurementUnitCode, content) {
    if( measurementUnitCode.indexOf("E14")>-1 || measurementUnitCode.indexOf("KJO")>-1){
        if(!GS1json[nutrientTypeCode]){
            GS1json[nutrientTypeCode] = new Array();
        }
      
        var energyPerNutrientBasis = new Object();
        energyPerNutrientBasis['@type'] = 'gs1:NutritionMeasurementType';
    
        
        energyPerNutrientBasis['s:value']= new Object();
        energyPerNutrientBasis['s:value']['@value']= Math.round(content * 100) / 100
        energyPerNutrientBasis['s:value']['@type']= "xsd:float";
        energyPerNutrientBasis["s:unitCode"]= measurementUnitCode;
        GS1json[nutrientTypeCode].push(energyPerNutrientBasis);
      
    }else{
        GS1json[nutrientTypeCode] = new Object();
        GS1json[nutrientTypeCode]['@type'] = 'gs1:NutritionMeasurementType';
    
        
        GS1json[nutrientTypeCode]['s:value']= new Object();
        GS1json[nutrientTypeCode]['s:value']['@value']= Math.round(content * 100) / 100
        GS1json[nutrientTypeCode]['s:value']['@type']= "xsd:float";
        GS1json[nutrientTypeCode]['s:unitCode']= measurementUnitCode;
    }

  
 }
function parseOFFtoGS1Recursif(offJson, parentKey) {
    var keys = Object.keys(offJson);
    for (var i = 0; i < keys.length; i++) {

        var key = keys[i];

        var child = offJson[key];
        console.log("child [" + parentKey + "." + key + "]: " + child);
        // SI LE CHILD EST UN OBJECT --> APPEL RECURSIF 
        if (typeof child === 'object' && child !== null && !Array.isArray(child)) {
            parseOFFtoGS1Recursif(child, parentKey + "." + keys[i]);
        } else

            if (key == "_id") {
                GS1json['gtin'] = "0" + child;
            } else if (key == "energy-kcal_100g") {
                addNutrient('energyPerNutrientBasis', 'E14', child);
            } else if (key == "energy-kj_100g") {
                addNutrient('energyPerNutrientBasis', 'KJO', child);
            } else if (key == "fat_100g") {
                addNutrient('fatPerNutrientBasis', 'GRM', child);
            } else if (key == "carbohydrates_100g") {
                addNutrient('carbohydratesPerNutrientBasis', 'GRM', child);
            } else if (key == "fiber_100g") {
                addNutrient('fibrePerNutrientBasis', 'GRM', child);
            } else if (key == "proteins_100g") {
                addNutrient('proteinPerNutrientBasis', 'GRM', child);
            } else if (key == "salt_100g") {
                addNutrient('saltPerNutrientBasis', 'GRM', child);
            } else if (key == "saturated-fat_100g") {
                addNutrient('saturatedFatPerNutrientBasis', 'GRM', child);
            } else if (key == "sodium_100g") {
                addNutrient('NA', 'GRM', child);
            } else if (key == "sugars_100g") {
                addNutrient('sugarsPerNutrientBasis', 'GRM', child);
            } else if (key == "nutriscore_grade") {
                if (child == "unknown") {

                } else {
                    if (!GS1json['additionalProductClassification']) {
                        GS1json['additionalProductClassification'] = new Array();
                    } 
                    var additionalProductClassification = new Object();
                    additionalProductClassification['@type'] ="gs1:AdditionalProductClassificationDetails";
                    additionalProductClassification['additionalProductClassificationCode'] = "NUTRISCORE";
                    additionalProductClassification['additionalProductClassificationValue'] = 'NUTRISCORE_' + child.toUpperCase();
                    GS1json['additionalProductClassification'].push(additionalProductClassification);
                }
                
            } else if (key == "ecoscore_grade") {
                if (child == "unknown" || child == "not-applicable") {

                } else {

                    if (!GS1json['additionalProductClassification']) {
                        GS1json['additionalProductClassification'] = new Array();
                    } 
                    var additionalProductClassification = new Object();
                    additionalProductClassification['@type'] ="gs1:AdditionalProductClassificationDetails";
                    additionalProductClassification['additionalProductClassificationCode'] = "ECOSCORE";
                    additionalProductClassification['additionalProductClassificationValue'] = 'ECOSCORE_' + child.toUpperCase();
                    GS1json['additionalProductClassification'].push(additionalProductClassification);
                }
            } else if (key == "nova_group") {
                if (!GS1json['additionalProductClassification']) {
                    GS1json['additionalProductClassification'] = new Array();
                } 
                var additionalProductClassification = new Object();
                additionalProductClassification['@type'] ="gs1:AdditionalProductClassificationDetails";
                additionalProductClassification['additionalProductClassificationCode'] = "NOVA";
                additionalProductClassification['additionalProductClassificationValue'] = 'NOVA_' + (child-1);
                GS1json['additionalProductClassification'].push(additionalProductClassification);
            } else if (key == "brands") {
                GS1json['brandName'] = child;
            } else if (key == "product_name") {
                GS1json['s:name'] = new Array();
                s_name = new Object();
                s_name['@value'] = child;
                s_name['@language'] = 'fr';
                GS1json['s:name'].push(s_name);

            } else if (key == "generic_name") {
                GS1json['regulatedProductName'] = new Array();
                GS1json['functionalName'] = new Array();
                regulatedProductName = new Object();
                regulatedProductName['@value'] = child;
                regulatedProductName['@language'] = 'fr';
                GS1json['regulatedProductName'].push(regulatedProductName);
                GS1json['functionalName'].push(regulatedProductName);

            } else if (key == "product_quantity") {
                GS1json['netContent'] = new Object();
                GS1json['netContent']['@type'] = new Array();
                GS1json['netContent']['@type'].push('gs1:QuantitativeValue');
                GS1json['netContent']['@type'].push('s:QuantitativeValue');
                GS1json['netContent']['s:value'] = new Object();
                GS1json['netContent']['s:value']['@type'] = 'xsd:float';
                GS1json['netContent']['s:value']['@value'] = child;
                GS1json['netContent']['s:unitCode'] = "GRM";
              
            } else if (key == "image_front_url") {
                GS1json['s:image'] = new Object();
                GS1json['s:image']['s:url'] =  new Object();
                GS1json['s:image']['s:url']['@id'] =  child.replace("http:", "https:");;
                
            } else if (key == "allergens_tags") {
                GS1json['hasAllergen'] = new Array();
              
                for (var j = 0; j < child.length; j++) {
                    var allergenOFF = child[j];
                    var allergen = new Object();
                    allergen['allergenType'] = new Object();
                    allergen["@type"] = "gs1:AllergenDetails"
                    allergen['allergenType']['@id'] = alergenMapping[allergenOFF];
                    allergen['allergenLevelOfContainmentCode'] = new Object();
                    allergen['allergenLevelOfContainmentCode']['@id'] = "MAY_CONTAIN";
                    GS1json['hasAllergen'].push(allergen);
                }
            } else if (key == "labels_tags") {
                GS1json['packagingMarkedLabelAccreditation'] = new Array();
              
                for (var j = 0; j < child.length; j++) {
                    var packagingMarkedLabelAccreditationOFF = child[j];
                    var packagingMarkedLabelAccreditation = new Object();
                    if(labelMapping[packagingMarkedLabelAccreditationOFF]){
                        packagingMarkedLabelAccreditation['@id'] = labelMapping[packagingMarkedLabelAccreditationOFF];
                        GS1json['packagingMarkedLabelAccreditation'].push(packagingMarkedLabelAccreditation);
                    }else{
                        packagingMarkedLabelAccreditation['@id'] = packagingMarkedLabelAccreditationOFF;
                   
                    }
                    
                }
            } else if (key == "additives_tags") {
                GS1json['additive'] = new Array();
              
                for (var j = 0; j < child.length; j++) {
                    var additifOFF = child[j];
                    var additif = new Object();
                    additif['additiveLevelOfContainment'] = new Object();
                    additif["additiveLevelOfContainment"]['@id'] = "CONTAIN"
                    
                    additif['additiveName'] = new Array();
                    additiveName = new Object();
                    additiveName['@value'] = additifOFF.substring(additifOFF.indexOf(":")+1, additifOFF.length);
                    additif['additiveName'].push(additiveName);
                    GS1json['additive'].push(additif);
                }
            } else if (key == "countries_tags") {
                GS1json['countriesOfSale'] = new Object();
                GS1json['countriesOfSale']['countryOfSale'] = new Array();
                for (var j = 0; j < child.length; j++) {
                    var countryOFF = child[j];
                    if (countryOFF in countryMapping) {
                        GS1json['countriesOfSale']['countryOfSale'][j] = countryMapping[countryOFF];
                    }
                }
            }  else if (key == "categories") {
                
                    GS1json['gpcCategoryCode'] = child;
        
                
                
            } else if (key == "manufacturing_places_tags") {
                GS1json['placeOfItemActivity'] = new Object();
                GS1json['placeOfItemActivity']['countriesOfOrigin'] = new Object();
                var offCountry = child;
                offCountry = countryOrigineMapping[offCountry];
                GS1json['placeOfItemActivity']['countriesOfOrigin']['countryOfOrigin'] = offCountry;


                console.log(GS1json);
            } else if (key == "creator") {
                var informationProvider = new Object();
                informationProvider['partyName'] = child;
                GS1json['informationProvider'] = informationProvider;
            } else if (key == "created_t") {
                var metaData = new Object();
                var date = new Date(child * 1000);
                metaData['modifiedDate'] = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
                console.log(date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate());
                GS1json['metaData'] = metaData;
            } else if (key == "ingredients_text") {
                GS1json['ingredientStatement'] = new Array();
                ingredientStatement = new Object();
                ingredientStatement['@value'] = child;
                ingredientStatement['@language'] = 'fr';
                GS1json['ingredientStatement'].push(ingredientStatement);
                
            }
            else if (key == "quantity") {
                try {
                    child = child.replace(new RegExp("[0-9]", "g"), "")
                    var find = ',';
                    var re = new RegExp(find, 'g');
                    child = child.replace(re, '');
                    child = child.toUpperCase();
                    if (child == "G" || "GR") {
                        child = "GRM";
                    } else if (child == "ml" || "ML") {
                        child = "MLT";
                    }
                    if (GS1json['tradeItemMeasurements']) {
                        GS1json['tradeItemMeasurements']['netContents']['netContent']['measurementUnitCode'] = child;
                        GS1json['nutritionalInformation']['nutrientHeaders']['nutrientHeader']['nutrientBasisQuantity']['measurementUnitCode'] = child;
                    }
                } catch (error) {
                    console.error(error);
                    // expected output: ReferenceError: nonExistentFunction is not defined
                    // Note - error messages will vary depending on browser
                }
            }


        // console.log("**********************************************************");
    }
}
var alergenMapping = {
    "en:crustaceans": "gs1:AllergenTypeCode-CRUSTACEANS",
    "en:eggs": "gs1:AllergenTypeCode-EGGS",
    "en:fish": "gs1:AllergenTypeCode-FISH",
    "en:milk": "gs1:AllergenTypeCode-MILK",
    "en:nuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:peanuts": "gs1:AllergenTypeCode-PEANUTS",
    "en:sesame-seeds": "gs1:AllergenTypeCode-SESAME_SEEDS",
    "en:sulphur-dioxide-and-sulphites": "gs1:AllergenTypeCode-SULPHUR_DIOXIDE",
    "en:gluten": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:soybeans": "gs1:AllergenTypeCode-SOYBEANS",
    "en:celery": "gs1:AllergenTypeCode-CELERY",
    "en:mustard": "gs1:AllergenTypeCode-MUSTARD",
    "en:molluscs": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:lupin": "gs1:AllergenTypeCode-LUPINE",
    "en:oats": "gs1:AllergenTypeCode-OAT",

    "en:crab": "gs1:AllergenTypeCode-CRUSTACEANS",
    "en:lobster": "gs1:AllergenTypeCode-CRUSTACEANS",
    "en:crayfish": "gs1:AllergenTypeCode-CRUSTACEANS",
    "en:prawn": "gs1:AllergenTypeCode-CRUSTACEANS",
    "en:shrimp": "gs1:AllergenTypeCode-CRUSTACEANS",

    "en:egg": "gs1:AllergenTypeCode-EGGS",
    "en:barn-egg": "gs1:AllergenTypeCode-EGGS",
    "en:egg-whites": "gs1:AllergenTypeCode-EGGS",
    "en:egg-white": "gs1:AllergenTypeCode-EGGS",
    "en:egg-yolks": "gs1:AllergenTypeCode-EGGS",
    "en:egg-yolk": "gs1:AllergenTypeCode-EGGS",
    "en:whole-eggs": "gs1:AllergenTypeCode-EGGS",
    "en:whole-egg": "gs1:AllergenTypeCode-EGGS",
 
    "en:fishes": "gs1:AllergenTypeCode-FISH",
    "en:mackerel": "gs1:AllergenTypeCode-FISH",
    "en:flounder": "gs1:AllergenTypeCode-FISH",
    "en:halibut": "gs1:AllergenTypeCode-FISH",
    "en:turbot": "gs1:AllergenTypeCode-FISH",
    "en:haddock": "gs1:AllergenTypeCode-FISH",
    "en:salmon": "gs1:AllergenTypeCode-FISH",
    "en:sole": "gs1:AllergenTypeCode-FISH",
    "en:trout": "gs1:AllergenTypeCode-FISH",
    "en:tuna": "gs1:AllergenTypeCode-FISH",
    "en:sardine": "gs1:AllergenTypeCode-FISH",
    "en:sardines": "gs1:AllergenTypeCode-FISH",



    "en:lactose": "gs1:AllergenTypeCode-MILK",
    "en:whey": "gs1:AllergenTypeCode-MILK",
    "en:dairy": "gs1:AllergenTypeCode-MILK",
    "en:butter": "gs1:AllergenTypeCode-MILK",
    "en:buttermilk": "gs1:AllergenTypeCode-MILK",
    "en:cream": "gs1:AllergenTypeCode-MILK",
    "en:yogurt": "gs1:AllergenTypeCode-MILK",
    "en:cheese": "gs1:AllergenTypeCode-MILK",
    "en:yoghurt": "gs1:AllergenTypeCode-MILK",
    "en:parmigiano-reggiano": "gs1:AllergenTypeCode-MILK",
    "en:grana-padano": "gs1:AllergenTypeCode-MILK",
    "en:milk-chocolate-coating": "gs1:AllergenTypeCode-MILK",
    "en:milk-powder": "gs1:AllergenTypeCode-MILK",
    "en:milk-protein": "gs1:AllergenTypeCode-MILK",

    "en:almonds": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:hazelnuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:walnuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:cashews": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:cashew": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:pecan-nuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:pecan": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:Brazil-nuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:pistachio-nuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:pistachio": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:macadamia": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:Macadamia": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:Queensland": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:tree-nuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:treenuts": "gs1:AllergenTypeCode-TREE_NUTS",
    "en:other-nuts": "gs1:AllergenTypeCode-TREE_NUTS",

    "en:peanut": "gs1:AllergenTypeCode-PEANUTS",
    "en:arachis-hypogaea": "gs1:AllergenTypeCode-PEANUTS",

    "en:sesame": "gs1:AllergenTypeCode-SESAME_SEEDS",

    "en:sulphur-dioxide": "gs1:AllergenTypeCode-SULPHUR_DIOXIDE",
    "en:sulphites": "gs1:AllergenTypeCode-SULPHUR_DIOXIDE",
    "en:sulfites": "gs1:AllergenTypeCode-SULPHUR_DIOXIDE",


    "en:gluten": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:cereals-containing-gluten": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:barley": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:barley-malt-flour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:malted-barley": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:malted-barley-extract": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:malted-barley-flour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:kamut": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:rye": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:rye-flour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:spelt": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:speltflour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:wheat-flour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:wheatflour": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:wheat-semolina": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:oats": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",
    "en:oat-fiber": "gs1:AllergenTypeCode-CEREALS_CONTAINING_GLUTEN",

    "en:soya": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soja": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soia": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soya-bean": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soy-flour": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soya-flour": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soy-lecithin": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soy-lecithins": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soy-lecithines": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soy-protein-isolate": "gs1:AllergenTypeCode-SOYBEANS",
    "en:soya-products": "gs1:AllergenTypeCode-SOYBEANS",

    "en:celeriac": "gs1:AllergenTypeCode-CELERY",

    "en:brassica": "gs1:AllergenTypeCode-MUSTARD",

    "en:mollusc": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:mollusks": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:mollusk": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:squid": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:cuttlefish": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:oysters": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:oyster": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:mussels": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:mussel": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:clams": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:clam": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:scallops": "gs1:AllergenTypeCode-MOLLUSCS",
    "en:scallop": "gs1:AllergenTypeCode-MOLLUSCS",

    "en:lupine": "gs1:AllergenTypeCode-LUPINE",

    
}
var countryMapping = {
    "en:belgium": "056",
    "en:france": "200",
    "en:french-polynesia": "258",
    "en:italy": "380",
    "en:luxembourg": "442",
    "en:switzerland": "756",
    "en:spain": "724",
    "en:greece": "300",
    "en:united-kingdom": "826",
    "en:canada": "124",
    "en:ireland": "372",
    "en:australia": "036",
    "en:netherlands": "528",
    "en:austria": "040",
    "en:portugal": "620",
    "en:poland": "616",
    "en:sweden": "752",
    "en:luxembourg": "442"

}
var countryOrigineMapping = {
    "france": "200",
    "italie": "380",
    "grece": "300"
}
var labelMapping = {
    'en:organic': 'EU_ORGANIC_FARMING',
    'en:eu-organic': 'EU_ORGANIC_FARMING',
    'en:gluten-free': 'FREE_FROM_GLUTEN',
    'en:green-dot': 'GREEN_DOT',
    'en:vegetarian': 'EUROPEAN_V_LABEL_VEGETARIAN',
    'en:vegan': 'EUROPEAN_V_LABEL_VEGAN',
    'en:fr-bio-01': 'BIOLOGICAL',
    'fr:ab-agriculture-biologique': 'AGRICULTURE_BIOLOGIQUE',
    'en:ab-agriculture-biologique': 'AGRICULTURE_BIOLOGIQUE',
    'en:no-gluten': 'FREE_FROM_GLUTEN',
    'en:no-lactose': 'FREE_FROM_LACTOSE',
    'en:french-meat': 'VIANDES_DE_FRANCE',
    'en:eu-agriculture': 'EU_ORGANIC_FARMING',
    'en:sustainable-farming': '',
    'en:palm-oil-free': '',
    'en:utz-certified': 'UTZ_CERTIFIED',
    'en:non-eu-agriculture': '',
    'en:no-artificial-flavors': '',
    'en:halal': '',
    'en:french-pork': '',
    'en:fsc': '',
    'en:no-additives': '',
    'en:fr-bio-10': '',
    'en:pdo': '',
    'en:fair-trade': '',
    'en:sustainable-fishery': '',
    'en:sustainable-seafood-msc': '',
    'en:eg-oko-verordnung': '',
    'en:pgi': '',
    'en:no-gmos': '',
    'fr:eco-emballages': '',
    'fr:triman': '',
    'fr:viande-francaise': 'VIANDES_DE_FRANCE',
    'en:transformed-in-france': '',
    'en:low-or-no-sugar': '',
    'en:de-oko-001': '',
    'fr:deconseille-aux-femmes-enceintes': '',
    'fr:viande-bovine-francaise': '',
    'en:natural-flavors': '',
    'en:distributor-labels': '',
    'en:nl-bio-01': '',
    'en:max-havelaar': '',
    'en:no-palm-oil': '',
    'en:be-bio-01': 'BIOGARANTIE',
    'en:kosher': '',
    'fr:label-rouge': '',
    'en:no-artificial-colors': '',
    'en:it-bio-006': '',
    'en:fsc-mix': '',
    'en:european-vegetarian-union': '',
    'fr:volaille-francaise': '',
    'en:high-fibres': '',
    'en:biodynamic-agriculture': '',
    'en:demeter': '',
    'en:it-bio-009': '',
    'en:lait-francais-french-milk': '',
    'en:it-bio-007': '',
    'en:superior-quality': '',
    'fr:entrepreneurs-engages': '',
    'en:ch-bio-006': '',
    'en:german-agricultural-society': '',
    'en:utz-certified-cacao': '',
    'en:low-or-no-fat': '',
    'en:no-flavors': '',
    'en:high-proteins': '',
    'en:pure-butter': '',
    'en:de-oko-006': '',
    'en:fr-bio-09': '',
    'en:australian-made': '',
    'en:fairtrade-international': '',
    'en:gold-medal-of-the-german-agricultural-society': '',
    'en:french-milk': '',
    'en:low-or-no-salt': '',
    'en:100-natural': '',
    'en:certified-by-ecocert': '',
    'en:no-flavour-enhancer': '',
    'en:with-sunflower-oil': '',
    'en:verified': '',
    'en:packaged-in-france': '',
    'en:sustainable-palm-oil': '',
    'en:in-braille': '',
    'en:no-sugar': '',
    'fr:origine-france': '',
    'fr:viande-porcine-francaise': '',
    'en:not-advised-for-specific-people': '',
    'en:de-oko-003': '',
    'en:european-vegetarian-union-vegan': '',
    'en:be-bio-02': '',
    'en:low-sugar': '',
    'en:low-fat': '',
    'en:with-sweeteners': '',
    'en:made-in-the-eu': '',
    'en:class-i': '',
    'en:ohne-gentechnik': '',
    'en:it-bio-014': '',
    'en:contains-a-source-of-phenylalanine': '',
    'en:eac': '',
    'en:reduced-sugar': '',
    'en:free-range': '',
    'fr:agriculture-france': '',
    'en:products-for-professional-use': '',
    'en:de-oko-007': '',
    'en:no-milk': '',
    'en:es-eco-020-cv': '',
    'fr:info-tri-point-vert': '',
    'en:free-range-eggs': '',
    'en:usda-organic': '',
    'en:new': '',
    'en:rainforest-alliance': '',
    'en:the-vegan-society': '',
    'fr:bleu-blanc-coeur': '',
    'en:at-bio-301': '',
    'en:orthodox-union-kosher': '',
    'en:cooked-in-france': '',
    'en:carrefour-quality': '',
    'en:100-vegetable': '',
    'en:gb-org-05': '',
    'en:omega-3': '',
    'en:de-oko-013': '',
    'en:with-sulfites': '',
    'en:low-salt': '',
    'fr:farine-de-ble-francais': '',
    'de:bio-7-initiative': '',
    'en:no-artificial-colours-or-flavours': '',
    'en:contains-milk': '',
    'en:reduced-fat': '',
    'fr:fabrication-artisanale': '',
    'en:calcium-source': '',
    'en:no-added-salt': '',
    'en:fsc-c014047': '',
    'en:de-oko-005': '',
    'fr:biopartenaire': '',
    'fr:ble-francais': '',
    'en:no-fat': '',
    'en:bioland': '',
    'en:smoked-with-beech-wood': '',
    'en:no-hydrogenated-fats': '',
    'en:es-eco-001-an': '',
    'en:natural-colorings': '',
    'en:it-bio-008': '',
    'fr:aoc': '',
    'fr:concours-general-agricole': '',
    'en:pure-juice': '',
    'en:no-artificial-preservatives': '',
    'en:es-eco-025-na': '',
    'en:es-eco-024-mu': '',
    'en:pefc': '',
    'en:reduced-salt': '',
    'fr:tidy-man': '',
    'en:responsible-aquaculture': '',
    'en:non-organic': '',
    'fr:afdiag': '',
    'en:high-in-omega-3': '',
    'en:responsible-aquaculture-asc': '',
    'en:naturland': '',
    'en:saveurs-de-l-annee-france': '',
    'en:without-sodium-nitrite': '',
    'en:no-alcohol': '',
    'de:eg-oko-verordnung': '',
    'en:without-dyes-or-preservatives': '',
    'en:contains-gluten': '',
    'en:unfrozen': '',
    'en:es-eco-016-cl': '',
    'en:pure-pork': '',
    'en:no-soy': '',
    'fr:produits-faisant-reference-au-mojito': '',
    'en:nutriscore-experiment': '',
    'en:roundtable-on-sustainable-palm-oil': '',
    'en:do-not-freeze-again': '',
    'en:es-eco-002-cm': '',
    'fr:saveurs-en-or': '',
    'es:sin-tacc': '',
    'en:ch-bio-004': '',
    'en:25-less-salt': '',
    'en:grown-in-france': '',
    'en:keyhole': '',
    'en:canada-organic': '',
    'fr:fruits-et-legumes-de-france': '',
    'en:no-eggs': '',
    '': '',
    'en:produced-in-brittany': '',
    'fr:controle-de-la-mosquee-d-evry-courcouronnes': '',
    'en:es-eco-023-ma': '',
    'en:2016-nutrition-labelling-experiment': '',
    'en:new-recipe': '',
    'en:2018-gold-medal-of-the-german-agricultural-society': '',
    'en:assured-food-standards': '',
    'en:french-poultry': '',
    'en:contains-gmos': '',
    'en:no-cholesterol': '',
    'en:pure-beef': '',
    'en:fr-bio-16': '',
    'en:excessive-consumption-can-have-laxative-effects': '',
    'en:no-msg': '',
    'fr:aucun': '',
    'en:high-in-calcium': '',
    'en:1-for-the-planet': '',
    'fr:recycle-plastique': '',
    'en:at-bio-402': '',
    'en:not-advised-for-children-and-pregnant-women': '',
    'en:it-bio-005': '',
    'en:made-in-switzerland': '',
    'en:pt-bio-04': '',
    'en:fed-without-gmos': '',
    'en:without-sweeteners': '',
    'en:es-eco-022-ga': '',
    'en:fr-bio-15': '',
    'en:bio': '',
    'en:do-not-freeze': '',
    'en:soil-association-organic': '',
    'en:lk-bio-149': '',
    'en:not-advised-for-pregnant-women': '',
    'en:non-gmo-project': '',
    'en:french-eggs': '',
    'en:de-oko-037': '',
    'fr:a-votre-service': '',
    'en:bio-suisse': '',
    'en:es-eco-006-ar': '',
    'en:health-star-rating': '',
    'en:de-oko-039': '',
    'en:fsc-c081801': '',
    'en:silver-medal-of-the-german-agricultural-society': '',
    'en:krav': '',
    'en:kosher-parve': '',
    'en:french-beef': '',
    'en:30-less-sugar': '',
    'en:low-sodium': '',
    'en:cocoa-life': '',
    'en:100-muscle': '',
    'fr:soja-francais': '',
    'en:pasteurized-product': '',
    'en:2017-gold-medal-of-the-german-agricultural-society': '',
    'en:haccp': '',
    'en:without-antibiotics': '',
    'en:class-ii': '',
    'en:rich-in-vegetable-protein': '',
    'fr:medaille-d-or-du-concours-general-agricole': '',
    'fi:hyvää-suomesta': '',
    'en:gr-bio-01': '',
    'en:fr-bio-12': '',
    'fr:eu-eco-label': '',
    'en:fsc-c020428': '',
    'en:incorrect-data-on-label': '',
    'en:iso-9001': '',
    'en:healthier-choice-singapore': '',
    'fr:forest-stewardship-council-100-percent': '',
    'en:without-sulfites': '',
    'fr:elabore-en-france': '',
    'en:it-bio-004': '',
    'fr:medaille-d-argent-du-concours-general-agricole': '',
    'fr:bio-equitable-en-france': '',
    'en:2019-gold-medal-of-the-german-agricultural-society': '',
    'en:cz-bio-001': '',
    'en:at-bio-902': '',
    'fr:ble-issu-d-une-culture-maitrisee': '',
    'en:certified-by-certipaq': '',
    'en:gr-bio-03': '',
    'fr:garantie-iplc': '',
    'en:trawl-fishing': '',
    'en:incorrect-nutrition-facts-on-label': '',
    'fr:agriculture-italie': '',
    'fr:saveurs-de-l-annee-2015': '',
    'fr:association-rituelle-de-la-grande-mosquee-de-lyon': '',
    'en:se-eko-01': '',
    'en:lacto-vegetarian': '',
    'en:no-trans-fat': '',
    'en:enriched-wih-vitamins': '',
    'en:fr-bio-13': '',
    'en:utz-certified-cocoa': '',
    'en:peanut-free': '',
    'fr:sud-de-france': '',
    'en:iso-22000': '',
    'fr:naturel': '',
    'en:small-producers-symbol': '',
    'en:contains-soy': '',
    'en:with-guerande-salt': '',
    'de:ohne-polyphosphate': '',
    'fr:max-havelaar-france': '',
    'fr:artisan': '',
    'en:extra-class': '',
    '': '',
    'fr:100-filet': '',
    'en:es-eco-026-vas': '',
    'en:utz-certified-coffee': '',
    'fr:agri-ethique-france': '',
    'fr:teste-par-le-panel-test-carrefour': '',
    'de:dlg-jahrlich-pramiert': '',
    'en:raised-in-norway': '',
    'es:no-vegan': '',
    'en:spanish-protected-product': '',
    'fr:peche-d-une-espece-bien-geree': '',
    'fr:fair-for-life': '',
    'en:vegetarian-society': '',
    'fr:saveurs-de-l-annee': '',
    'en:no-caffeine': '',
    'en:2015-gold-medal-of-the-german-agricultural-society': '',
    'en:potatoes-from-france': '',
    'en:no-aspartame': '',
    'en:es-eco-003-an': '',
    'en:de-oko-024': '',
    'en:2014-gold-medal-of-the-german-agricultural-society': '',
    'en:limited-edition': '',
    'en:not-recommended-for-children-under-3-years': '',
    'en:2016-gold-medal-of-the-german-agricultural-society': '',
    'en:never-frozen': '',
    'en:eu-oko-verordnung': '',
    'en:no-salt': '',
    'fr:saucisson-a-l-ail': '',
    'fr:savourez-l-alsace': '',
    'en:european-vegetarian-union-vegetarian': '',
    'en:ovo-vegetarian': '',
    'en:spanish-quality-label': '',
    'fr:aux-oeufs-frais': '',
    'en:no-lecithine': '',
    'en:vitamin-d-source': '',
    'en:angled-fish': '',
    'en:it-bio-013': '',
    'en:some-ingredients-not-from-france': '',
    'en:harvested-in-france': '',
    'fr:legumes-de-france': '',
    'fr:herta-s-engage': '',
    'de:pro-planet': '',
    'en:2020-gold-medal-of-the-german-agricultural-society': '',
    'fr:soja-francais-sans-ogm': '',
    'en:made-with-free-range-eggs': '',
    'en:no-antibiotics': '',
    'fr:eco-emballage': '',
    'en:cz-bio-002': '',
    'en:fr-bio-07': '',
    'ru:добровольная-сертификация-рст': '',
    'fr:lapin-francais': '',
    'en:rich-in-vitamin-c': '',
    'en:carbon-compensated-product': '',
    'en:porks-raised-without-antibiotics': '',
    'en:dolphin-safe': '',
    'en:without-addition-of-dairy-products': '',
    'en:egg-laid-in-france': '',
    'en:pt-bio-02': '',
    'en:source-of-iron': '',
    'fr:medaille-de-bronze-du-concours-general-agricole': '',
    'de:deutsche-landwirtschaft': '',
    'en:cooperative-product': '',
    'fr:poulet-francais': '',
    'fr:nestle-cocoa-plan': '',
    'en:ovo-lacto-vegetarian': '',
    'en:certified-by-certiconfiance': '',
    'en:no-added-msg': '',
    'en:societe-francaise-de-controle-de-viande-halal-grande-mosquee-de-paris': '',
    'en:de-oko-012': '',
    'es:calidad-suprema': '',
    'en:fair-trade-organic': '',
    'en:palm-oil': '',
    'en:suisse-garantie': '',
    'en:no-thickening-agent': '',
    'fr:fabrique-en-normandie': '',
    'en:pl-eko-07': '',
    'en:nutriscore-experiment-grade-b': '',
    'fr:viticulture-durable': '',
    'fr:alu-recyclable': '',
    'en:apples-from-france': '',
    'fr:nutritional-compass': '',
    'en:no-artificial-sweeteners': '',
    'fr:qualite-controlee': '',
    'en:avainlippu': '',
    'en:no-artificial-additives': '',
    'en:eco-emballages': '',
    'en:de-oko-034': '',
    'en:hu-oko-01': '',
    'en:without-antibiotics-after-weaning': '',
    'fr:glaces-artisanales-de-france': '',
    'es:hecho-en-bolivia': '',
    'fr:au-lait-cru': '',
    'fr:gout-choco': '',
    'en:agriculture-france': '',
    'de:qs': '',
    'en:designated-origin-denomination': '',
    'en:dk-øko-100': '',
    'en:australian-grown': '',
    'fr:riche-en-fer': '',
    'en:es-eco-002-an': '',
    'en:30-less-fat': '',
    '': '',
    'fr:nouvelle-agriculture': '',
    'fr:trefilage-au-bronze': '',
    'en:point-vert': '',
    'en:french-duck': '',
    'en:de-oko-021': '',
    'en:sin-gluten': '',
    'ru:рст': '',
    'en:tsg': '',
    'en:es-eco-021-ex': '',
    'en:be-bio-03': '',
    'en:pt-bio-03': '',
    'en:de-oko-060': '',
    'en:ch-bio-038': '',
    'en:without-gelatin': '',
    'en:traditional-speciality-guaranteed': '',
    'en:charte-lu-harmony': '',
    'en:nutriscore-experiment-grade-c': '',
    'en:made-in-mexico': '',
    'en:cn-bio-154': '',
    'fr:viande-de-veau-francais': '',
    'fr:lait-bbc': '',
    'fr:maitre-artisan': '',
    'en:rich-in-vitamin-d': '',
    'fr:saveurs-de-l-annee-2016': '',
    'en:porks-raised-without-antibiotics-after-weaning': '',
    'fr:acier-recyclable': '',
    'en:migros-bio': '',
    'en:no-artificial-colours': '',
    'en:rspo-mass-balance-or-book-and-claim': '',
    'en:chickens-raised-without-antibiotics': '',
    'en:natural-source-of-calcium': '',
    'en:face': '',
    'fr:lait-francais-french-milk': '',
    'en:no-bisphenol-a': '',
    'en:non-vegetarian': '',
    'en:some-ingredients-not-from-italy': '',
    'fr:bio-equitable': '',
    'en:nutriscore-experiment-grade-a': '',
    'en:es-eco-012-as': '',
    'en:es-eco-027-ri': '',
    'en:vitamin-c-source': '',
    'fr:nature-progres': '',
    'en:tooth-health-related-labels': '',
    'en:no-added-fat': '',
    'de:kat': '',
    'fr:cocoa-plan': '',
    'en:no-artificial-colours-and-preservatives': '',
    'en:vitamin-b12-source': '',
    'fi:sydänmerkki': '',
    'en:enriched-with-calcium': '',
    'fi:valmistettu-suomessa': '',
    'fr:pme': '',
    'fr:emballage-pefc': '',
    'fr:demarche-fleg-metiers': '',
    'en:es-eco-019': '',
    'en:vegetarisch': '',
    'fr:bourgeon-bio': '',
    'en:sans-gluten': '',
    'en:seine-fishing': '',
    'en:health-star-rating-4': '',
    'en:nutriscore-b': '',
    'fr:terracycle': '',
    'fr:fruits-de-france': '',
    'fr:fabrique-en-ue': '',
    'en:de-oko-070': '',
    'en:phosphore-source': '',
    'en:it-bio-002': '',
    'fr:elevage-avec-une-alimentation-sans-ogm': '',
    'de:labels-von-distributoren': '',
    'es:bajo-en-grasas-saturadas': '',
    'fr:qualite-sans-arete': '',
    'es:con-aceite-de-oliva-virgen-extra': '',
    'fr:bbc-porc': '',
    'fr:ecolopass': '',
    'en:biogarantie': '',
    'en:rich-in-vitamin-e': '',
    'fr:bio-coherence': '',
    'fr:producteurs-paysans': '',
    'en:raised-in-scotland': '',
    'pl:gwarancja-jakości': '',
    'fr:saveurs-de-l-annee-2017': '',
    'en:belgian-family-brewers': '',
    'en:cn-bio-141': '',
    'fr:agri-confiance': '',
    'fr:au-lait-entier': '',
    'fr:union-francaise-pour-la-sante-bucco-dentaire': '',
    'fr:imprim-vert': '',
    'en:wheat-free': '',
    'en:lu-bio-04': '',
    'en:bio-europeen': '',
    'sv:fsc-c008592': '',
    'en:made-in-portugal': '',
    'en:es-eco-004-an': '',
    'en:whole-grain': '',
    'fr:sans-ble': '',
    'pt:ecoponto-amarelo': '',
    'fr:produit-en-anjou': '',
    'en:organized-kashrut-kosher': '',
    'en:no-gelatin': '',
    'en:product-of-australia': '',


}
