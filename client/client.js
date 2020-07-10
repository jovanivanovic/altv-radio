import * as alt from 'alt';
import * as native from 'natives';

let browser = undefined;
let pedInSeat = undefined;
let mounted = false;
let player = alt.Player.local;
let focused = false;
let isInVehicle = false;
let stationsQueue = [];

alt.onServer('playerEnteredVehicle', (vehicle, seat) => {
    alt.emitServer('radio:GetRadioStations');

    browser = new alt.WebView('http://resource/ui/radio.html');

    pedInSeat = seat;
    isInVehicle = true;

    browser.on('radio:StationChanged', radioStation => {
        alt.emitServer('vehicle:RadioChanged', player.vehicle, radioStation);
    });

    browser.on('browser:mounted', () => {
        mounted = true;

        if (stationsQueue.length > 0) {
            stationsQueue.forEach((station, index) => {
                browser.emit('addRadioStation', station);
                delete stationsQueue[index];
            });
        }

        let currentVehicleRadio = player.vehicle.getSyncedMeta('radioStation')
            ? player.vehicle.getSyncedMeta('radioStation')
            : 0;
        browser.emit('switchRadio', currentVehicleRadio);
    });
});

alt.onServer('playerLeftVehicle', (vehicle, seat) => {
    browser.destroy();
    browser = undefined;
    pedInSeat = undefined;
    isInVehicle = false;
    mounted = false;
});

alt.onServer('radio:AddStation', station => {
    if (mounted) {
        browser.emit('addRadioStation', station);
    } else {
        stationsQueue.push(station);
    }

    alt.log(JSON.stringify(station));
});

// TODO: Fix sync with other vehicle occupants

// alt.on('syncedMetaChange', (entity, key, value) => {
//     if (entity != player.vehicle) return;
//     const pedInSeat = native.getPedInVehicleSeat(player.vehicle.scriptID, -1);
//     if (key != 'radioStation') return;
//     if (pedInSeat == player.scriptID) return;

//     let radioStation = value;

//     if (browser && mounted) {
//         browser.emit('switchRadio', radioStation);
//     }
// });

alt.everyTick(() => {
    if (isInVehicle) {
        native.disableControlAction(0, 85, true);
    } else {
        native.enableControlAction(0, 85, true);
    }

    if (focused) {
        native.disableControlAction(0, 99, true);
        native.disableControlAction(0, 100, true);
    } else {
        native.enableControlAction(0, 99, true);
        native.enableControlAction(0, 100, true);
    }

    if (native.isPedSittingInAnyVehicle(player.scriptID)) {
        native.setRadioToStationName('OFF');
    }
});

alt.on('keydown', key => {
    if (key == 81 && browser) {
        const pedInSeat = native.getPedInVehicleSeat(player.vehicle.scriptID, -1);
        if (pedInSeat !== player.scriptID) return;

        browser.focus();
        focused = true;
    }
});

alt.on('keyup', key => {
    if (key == 81 && browser) {
        const pedInSeat = native.getPedInVehicleSeat(player.vehicle.scriptID, -1);
        if (pedInSeat !== player.scriptID) return;

        browser.unfocus();
        focused = false;
    }
});
