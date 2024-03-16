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
}

module.exports = Station;