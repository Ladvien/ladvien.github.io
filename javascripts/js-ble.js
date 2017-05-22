//https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer
var log = console.log;
var writeCharacteristic;
var descriptor;
var receivedString = "";
var terminalLineCounter = 0;

function onScanButtonClick() {
  // Validate services UUID entered by user first.
  let optionalServices = document.getElementById('optionalServices').value
    .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
    .filter(s => s && BluetoothUUID.getService);
    
  log(optionalServices);

  log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: optionalServices})
  .then(device => {
    log(device)
    log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    log("Printing server info: ");
    log(server);
    log('Getting Services...');
    return server.getPrimaryServices(0xFFE0);
  })
.then(services =>{
      log("Found services: ")
      log(services);
      
        services.forEach(service => {
            let queue = Promise.resolve();
          queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
            log('> Service: ' + service.uuid);
            characteristics.forEach(characteristic => {
              log('>> Characteristic: ' + characteristic.uuid + ' ' +
                  getSupportedProperties(characteristic));
                writeCharacteristic = characteristic;
                writeCharacteristic.addEventListener('characteristicvaluechanged', onReceivedData);
                writeCharacteristic.startNotifications();
                characteristic.getDescriptors('gatt.characteristic_user_description').then(descriptors => {
                    descriptor = descriptors[0];
                    log("Write descriptor set.");
                });
            });
          }));
      })
  })
.catch(error => {
    log('Argh! ' + error);
  });
}

function onReceivedData(event){
    for(var i = 0; i < event.target.value.byteLength; i ++){
        receivedString += String.fromCharCode(event.target.value.getUint8(i));
    }
    var terminal = document.getElementById('terminal')
    var newLine = document.createElement('div');
    newLine.innerHTML = receivedString;
    terminalLineCounter++;
    terminal.appendChild(newLine);
    
    log(receivedString);
    receivedString = "";
}

function onWriteButtonClick(){
    if(writeCharacteristic != null){
        let encoder = new TextEncoder('utf-8');
        let textToWrite = document.getElementById('textToWrite').value
        writeCharacteristic.writeValue(encoder.encode(textToWrite))
        .then(_ => {
            log("Sent: " + textToWrite);
        })
    }
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
