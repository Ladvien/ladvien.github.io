//https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer
var log = console.log;
//var writeCharacteristic;
var descriptor;
var receivedString = "";
var terminalLineCounter = 0;
var displayDOM = 'terminal';

let primaryService = document.getElementById('optionalServices').value;

function onScanButtonClick() {
    lumiBle.searchAndConnect(parseInt(primaryService)).
    then(() => {
        lumiBle.addReceivedDataCallback(onReceivedData)
    })
}

function onReceivedData(event) {
    for (var i = 0; i < event.target.value.byteLength; i++) {
        receivedString += String.fromCharCode(event.target.value.getUint8(i));
    }
    terminal.addTerminalLine(displayDOM, receivedString, '<- ', 'received-text');
    receivedString = "";
}

function onWriteButtonClick() {
    let textToWrite = document.getElementById('textToWrite').value;
    //        writeCharacteristic.writeValue(encoder.encode(textToWrite))
    lumiBle.writeData(textToWrite)
        .then(_ => {
            terminal.addTerminalLine(displayDOM, textToWrite, '-> ', 'sent-text');
        })
}

/* Utils */
function getSupportedProperties(characteristic) {
    let supportedProperties = [];
    for (const p in characteristic.properties) {
        if (characteristic.properties[p] === true) {
            supportedProperties.push(p.toUpperCase());
        }
    }
    return '[' + supportedProperties.join(', ') + ']';
}

document.getElementById('btn-1').onclick = onScanButtonClick;
document.getElementById('btn-write-ble').onclick = onWriteButtonClick;

var lumiBle = LumiBluetooth;
var terminal = Terminal;
terminal.setDisplayDOM(displayDOM);