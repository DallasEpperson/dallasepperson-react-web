const fs = require('fs');

const hikesFolder = '../public/hikes';


var getDistance = function(coordinates){
    var degToRad = function(deg){
        return deg * (Math.PI/180);
    };
    var distInMeters = 0;
    for (var i = 1; i < coordinates.length; i++){
        var lat1 = coordinates[i-1][0];
        var lon1 = coordinates[i-1][1];
        var lat2 = coordinates[i][0];
        var lon2 = coordinates[i][1];
        var p1 = degToRad(lat1), p2 = degToRad(lat2), dl = degToRad(lon2-lon1), R = 6371e3; // gives d in metres
        var d = Math.acos( Math.sin(p1)*Math.sin(p2) + Math.cos(p1)*Math.cos(p2) * Math.cos(dl) ) * R;
        distInMeters += !d? 0 : d;
    }
    return distInMeters;
};

const getSingleHike = (id) => {
    const hikeFiles = fs.readdirSync(hikesFolder)
        .filter((fn) => fn == `hike-${id}.json`);
        
    if(hikeFiles.length !== 1){
        throw new Error(`Hike with ID ${id} not found.`);
    }
    const hikeFileLoc = `${hikesFolder}/hike-${id}.json`;
    let hikeRaw = fs.readFileSync(hikeFileLoc);
    var hike = JSON.parse(hikeRaw);
    
    if(!hike.path || !Array.isArray(hike.path)){
        throw new Error('Invalid hike file.');
    }

    return [hike, hikeFileLoc];
};

const reverseLatLong = (id) => {
    try{
        var [hike, hikeFileLoc] = getSingleHike(id);
    } catch (err){
        console.error(err);
        return;
    }
    
    hike.path = hike.path.map(c => [c[1], c[0]]);

    console.log(hike);

    hikeRaw = JSON.stringify(hike, null, 0);
    fs.writeFileSync(hikeFileLoc, hikeRaw);
};

const combine = () => {
    const hikeFiles = fs.readdirSync(hikesFolder)
        .filter((fn) => fn.endsWith('.json'))
        .filter((fn) => fn !== 'hikes.json');
        
    var hikes = [];
    for (let i = 0; i < hikeFiles.length; i++) {
        const hikeFile = `${hikesFolder}/${hikeFiles[i]}`;
        console.log(`Scanning ${hikeFile}.`);
        let hikeRaw = fs.readFileSync(hikeFile);
        let hike = JSON.parse(hikeRaw);
        hikes.push({
            id: hike.id,
            path: hike.path
        });
    }
    console.log('Combining.');
    let hikesRaw = JSON.stringify({hikes: hikes}, null, 0);
    fs.writeFileSync(`${hikesFolder}/hikes.json`, hikesRaw);
};

const getLength = (id) => {
    try{
        var [hike] = getSingleHike(id);
    } catch (err){
        console.error(err);
        return;
    }

    console.log(`Hike distance: ${getDistance(hike.path)} meters.`);
};

const convertFromOld = (oldFile, newFile, newId) => {
    try{
        var oldRaw = fs.readFileSync(oldFile);
        var oldHike = JSON.parse(oldRaw);
        if(!oldHike.hikeName){
            throw new Error('Invalid old hike file.');
        }
        let oldPath = oldHike.features[0].geometry.coordinates;
        let newPath = oldPath.map(c => [c[1], c[0]]);
        let newDate = new Date(`${oldHike.hikeDate.replaceAll('.','-')}T16:00Z`).getTime();
        var newHike = {
            id: parseInt(newId),
            name: oldHike.hikeName,
            date: newDate,
            path: newPath
        };
        if(oldHike.outAndBack) newHike['outAndBack'] = true;
        let newDistance = getDistance(newPath);
        if(oldHike.outAndBack) newDistance = newDistance * 2;
        newHike['distance'] = newDistance;
        
        let newRaw = JSON.stringify(newHike, null, 0);
        fs.writeFileSync(newFile, newRaw);
    } catch (err){
        console.error(err);
        return;
    }
};

const args = process.argv;
switch ((args[2] || "").toUpperCase()) {
    case "--REVERSELATLONG":
        var id = args[3];
        if(!id){
            console.log('no id specified');
            break;
        }
        reverseLatLong(id);
        break;
    
    case "--LENGTH":
        var id = args[3];
        if(!id){
            console.log('no id specified');
            break;
        }
        getLength(id);
        break;
    
    case "--COMBINE":
        combine();
        break;
    
    case "--CONVERTFROMOLD":
        convertFromOld(args[3], args[4], args[5]);
        break;

    default:
        console.log('no action specified')
        break;
}