// station.js
import config from "../utils/configs.js";

function toRadians(degrees) {
    return degrees * Math.PI / 180;
}

function haversineFormula(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth radius in meters
    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
}

class Station {
    #code;
    #name;
    #address;
    #gpsLatitude;
    #gpsLongitude;
    #daytimeFee;
    #feeComments;
    #status;
    #lastStatusUpdate;

    constructor(code, name, address, gpsLatitude, gpsLongitude, daytimeFee, feeComments) {
        this.#code = code;
        this.#name = name;
        this.#address = address;
        this.#gpsLatitude = parseFloat(gpsLatitude);
        this.#gpsLongitude = parseFloat(gpsLongitude);
        this.#daytimeFee = parseFloat(daytimeFee);
        this.#feeComments = feeComments;
        this.#status = null;
        this.#lastStatusUpdate = null;
    }

    // Getters
    get code() { return this.#code; }
    get name() { return this.#name; }
    get address() { return this.#address; }
    get gpsLatitude() { return this.#gpsLatitude; }
    get gpsLongitude() { return this.#gpsLongitude; }
    get daytimeFee() { return this.#daytimeFee; }
    get feeComments() { return this.#feeComments; }
    get status() { return this.#status; }
    get lastStatusUpdate() { return this.#lastStatusUpdate; }

    // For compatibility with the old code
    get Code() { return this.#code; }
    get Name() { return this.#name; }
    get Address() { return this.#address; }
    get GPSLattitude() { return this.#gpsLatitude; }
    get GPSLongitude() { return this.#gpsLongitude; }
    get DaytimeFee() { return this.#daytimeFee; }
    get FeeComments() { return this.#feeComments; }
    get Status() { return this.#status; }

    // Methods
    updateStatus(status) {
        this.#status = status;
        this.#lastStatusUpdate = new Date();
    }

    calculateDistance(latitude, longitude) {
        return haversineFormula(
            this.#gpsLatitude,
            this.#gpsLongitude,
            parseFloat(latitude),
            parseFloat(longitude)
        );
    }

    isAvailable() {
        return this.#status !== config.statuses.CloseOrNotAvailable &&
            this.#status !== config.statuses.Full;
    }

    // Serialize the station object to a plain object
    toJSON() {
        return {
            code: this.#code,
            name: this.#name,
            address: this.#address,
            location: {
                latitude: this.#gpsLatitude,
                longitude: this.#gpsLongitude
            },
            fees: {
                daytime: this.#daytimeFee,
                comments: this.#feeComments
            },
            status: this.#status,
            lastStatusUpdate: this.#lastStatusUpdate,
            isAvailable: this.isAvailable()
        };
    }

    // Static factory method to create a station from API data
    static fromApiData(data) {
        const { AhuzotCode, Name, Address, GPSLattitude, GPSLongitude, DaytimeFee, FeeComments } = data;

        if (!AhuzotCode || !Name || !Address || !GPSLattitude || !GPSLongitude || !DaytimeFee) {
            return null;
        }

        return new Station(
            AhuzotCode,
            Name,
            Address,
            GPSLattitude,
            GPSLongitude,
            DaytimeFee,
            FeeComments
        );
    }
}

export default Station;