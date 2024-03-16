import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const Parking = ({ parking }) => {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" component="div">
                    {parking.Name}
                </Typography>
                <Typography color="text.secondary">
                    Address: {parking.Address}
                </Typography>
                <Typography color="text.secondary">
                    GPS Latitude: {parking.GPSLatitude}
                </Typography>
                <Typography color="text.secondary">
                    GPS Longitude: {parking.GPSLongitude}
                </Typography>
                <Typography color="text.secondary">
                    Daytime Fee: {parking.DaytimeFee}
                </Typography>
                <Typography color="text.secondary">
                    Fee Comments: {parking.FeeComments}
                </Typography>
                <Typography color="text.secondary">
                    Status: {parking.Status}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Parking;