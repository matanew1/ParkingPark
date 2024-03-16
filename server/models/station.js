class Station {
    constructor(Code, Name, Address, GPSLatitude, GPSLongitude, DaytimeFee, FeeComments) {
        // Assign properties to the instance
        this.Code = Code;
        this.Name = Name;
        this.Address = Address;
        this.GPSLatitude = GPSLatitude;
        this.GPSLongitude = GPSLongitude;
        this.DaytimeFee = DaytimeFee;
        this.FeeComments = FeeComments;
        this.Status = 'null';
    }

    updateStatus(Status) {
        this.Status = Status;
    }
}

module.exports = Station;