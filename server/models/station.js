// station.js

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function haversineFormula(lat1, lon1, lat2, lon2) {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

class Station {
    constructor(Code, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments) {
        // Assign properties to the instance
        this.Code = Code;
        this.Name = Name;
        this.Address = Address;
        this.GPSLattitude = GPSLattitude;
        this.GPSLongitude = GPSLongitude;
        this.DaytimeFee = DaytimeFee;
        this.FeeComments = FeeComments;
        this.Status = 'null';
    }

    updateStatus(Status) {
        this.Status = Status;
    }

    calculateDistance(latitude, longitude) {
        const earthRadius = 6371e3; // metres
        const c = haversineFormula(this.GPSLattitude, this.GPSLongitude, latitude, longitude);
        return earthRadius * c; // in metres
    }
}

export default Station;