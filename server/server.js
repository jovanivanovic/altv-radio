import * as alt from 'alt';
import radioList from './config.js';

alt.on('playerEnteredVehicle', (player, vehicle, seat) => {
    alt.emitClient(player, 'playerEnteredVehicle', vehicle, seat);
});

alt.on('playerLeftVehicle', (player, vehicle, seat) => {
    alt.emitClient(player, 'playerLeftVehicle', vehicle, seat);
});

alt.on('playerChangedVehicleSeat', (player, vehicle, oldSeat, newSeat) => {
    alt.emitClient(player, 'playerChangedVehicleSeat', vehicle, oldSeat, newSeat);
});

alt.onClient('vehicle:RadioChanged', (player, vehicle, radioStation) => {
    vehicle.setSyncedMeta('radioStation', radioStation);
});

alt.onClient('radio:GetRadioStations', player => {
    radioList.forEach((station, index) => {
        alt.emitClient(player, 'radio:AddStation', station);
    });
});
