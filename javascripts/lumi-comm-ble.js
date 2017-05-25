var LumiBluetooth = function(){
    
    var onReceivedDataCallbacks = [];
    var writeCharacteristic;
    
    // Adds a function called when a BLE characteristic changes value.
    // Mutiple callbacks may be added.
    this.addReceivedDataCallback = function(callback){
        writeCharacteristic.addEventListener('characteristicvaluechanged', callback);
        onReceivedDataCallbacks.push({
            key: callback.name,
            value: callback
        })
    }

    // Clears the RecievedDataCallback dictionary.
    this.removeAllReceivedDataCallbacks = function () {
        onReceivedDataCallbacks = [];
    }
    
    // Searchs for Devices based upon Service IDs.  Then prompts
    // a user to select a target device.  Lastly, it conencts to
    // target d evice.
    this.searchAndConnect = function(primaryServicesUUID, addSystemText = ""){
        return new Promise(function(resolve, reject) {
            let optionalServices = document.getElementById('optionalServices').value
                .split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
                .filter(s => s && BluetoothUUID.getService);
            
            if(addSystemText) {addSystemText('Requesting any Bluetooth Device...'); }
              navigator.bluetooth.requestDevice({
                  acceptAllDevices: true,
                  optionalServices: optionalServices})
              .then(device => {
                  if(addSystemText){ addSystemText('Connecting to GATT Server...'); }
                  return device.gatt.connect();
              })
              .then(server => {
                  if(addSystemText) { addSystemText('Getting Services...'); }
                    return server.getPrimaryServices(primaryServicesUUID);
              })
            .then(services =>{
                  if(addSystemText) { addSystemText("Found services: "); }
                  services.forEach(service => {
                      let queue = Promise.resolve();
                      queue = queue.then(_ => service.getCharacteristics().
                                         then(characteristics => {
                          if(addSystemText) { addSystemText('Service: ' + service.uuid); }
                          characteristics.forEach(characteristic => {
                              if(addSystemText) { addSystemText('>> Characteristic: ' + characteristic.uuid + ' ' +
                                            getSupportedProperties(characteristic));}
                              writeCharacteristic = characteristic;
                              if(addSystemText) {addSystemText("Write characteristic set");}
                              writeCharacteristic.startNotifications();       
                              resolve();
                        }); // End enumerating characteristics
                  })); // End queue
                }) // End enumerating services
              }) // End Service exploration                   
        }); // End Search and Connect Promise
    } // End Search and Connect Function
    
    this.writeData = function(data){
        return new Promise(function(resolve, reject) {
            if(writeCharacteristic){
                let encoder = new TextEncoder('utf-8');
                writeCharacteristic.writeValue(encoder.encode(data));
                resolve();
            } else {
                if(addSystemText){ addSystemText("Wo write characteristic set");}
                reject("No write characteristic.")
            }            
        });
    }
} // End Proto