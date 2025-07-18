export function formatCoords (lat: number, lng: number){
    let coords: string[] = ["", ""];
    let latSec: number = Math.round(lat * 3600);
    let lngSec: number = Math.round(lng * 3600);

    let latMin: number = ( ( latSec % 3600 ) - ((latSec % 3600) % 60) ) / 60;
    let lngMin: number = ( ( lngSec % 3600 ) - ((lngSec % 3600) % 60) ) / 60;

    let latDeg: number = ( latSec - ( latSec % 3600 ) ) / 3600;
    let lngDeg: number = ( lngSec - ( lngSec % 3600 ) ) / 3600;

    latSec = ( ( latSec % 3600 ) % 60 );
    lngSec = lngSec = ( ( lngSec % 3600 ) % 60 );

    coords[0] = (lat >= 0) ? `${latDeg}° ${latMin}' ${latSec}" N` : `${-latDeg}° ${-latMin}' ${-latSec}" S`;

    coords[1] = (lng >= 0) ? `${lngDeg}° ${lngMin}' ${lngSec}" E` : `${-lngDeg}° ${-lngMin}' ${-lngSec}" W`;

    return `${coords[0]},    ${coords[1]}`;
}

export function volcanoActivity(lastErup: number){
    if (lastErup == -32768){
        return "Active during the holocene, last eruption unknown";
    }
    else if (lastErup == -2147483647){
        return "Inactive";
    }
    else{
        if (lastErup < 0){
            return `Active, last eruption in ${-lastErup}BCE`
        }
        else {
            return `Active, last eruption ${lastErup}CE`
        }
    }
}

export function craterAge(id: number, age: number, certainty: string){
    if (id >= 281){
        if (certainty == "exact"){
            return `${age} million years old`
        }
        else if (certainty == "around"){
            return `Around ${age} million years old`
        }
        else if (certainty == "less"){
            return `Less than ${age} million years old`
        }
    }
    else if (id < 281){
        if (certainty == "exact"){
            return `${age} thousand years old`
        }
        else if (certainty == "around"){
            return `Around ${age} thousand years old`
        }
        else if (certainty == "less"){
            return `Less than ${age} thousand years old`
        }
    }
}