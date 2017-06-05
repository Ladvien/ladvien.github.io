var LumiBluetooth = (function () {

	// Privates
	var pairedDevices = {};
	var onReceivedDataCallbacks = [];
	var writeCharacteristic;

	// Adds a function called when a BLE characteristic changes value.
	// Mutiple callbacks may be added.
	this.addReceivedDataCallback = function (callback) {
		if (writeCharacteristic) {
			writeCharacteristic.addEventListener('characteristicvaluechanged', callback);
			onReceivedDataCallbacks.push({
				key: callback.name,
				value: callback
			})
		}
	}

	// Clears the RecievedDataCallback dictionary.
	this.removeAllReceivedDataCallbacks = function () {
		onReceivedDataCallbacks = [];
	}

	// Searches for Devices based upon Service IDs.  Then prompts
	// a user to select a target device.  Lastly, it conencts to
	// target d evice.
	this.searchAndConnect = function (primaryServicesUUID, addSystemText = "") {
		return new Promise(function (resolve, reject) {
			let optionalServices = document.getElementById('optionalServices').value
				.split(/, ?/).map(s => s.startsWith('0x') ? parseInt(s) : s)
				.filter(s => s && BluetoothUUID.getService);

			if (addSystemText) {
				addSystemText('Requesting any Bluetooth Device...');
			}
			navigator.bluetooth.requestDevice({
					acceptAllDevices: true,
					optionalServices: optionalServices

				})
				.then(device => {
					pairedDevices[device.name] = device;
					if (addSystemText) {
						addSystemText('Connecting to GATT Server...');
					}
					return device.gatt.connect();
				})
				.then(server => {
					if (addSystemText) {
						addSystemText('Getting Services...');
					}
					return server.getPrimaryServices();
				})
				.then(services => {
					if (addSystemText) {
						addSystemText("Found services: ");
					}
					services.forEach(service => {
						let queue = Promise.resolve();
						queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
							if (addSystemText) {
								addSystemText('Service: ' + service.uuid);
							}
							characteristics.forEach(characteristic => {
								if (addSystemText) {
									addSystemText('>> Characteristic: ' + characteristic.uuid + ' ' +
										getSupportedProperties(characteristic));
								}
								writeCharacteristic = characteristic;
								if (addSystemText) {
									addSystemText("Write characteristic set");
								}
								writeCharacteristic.startNotifications();
								resolve();
							}); // End enumerating characteristics
						})); // End queue
					}) // End enumerating services
				}). // End Service exploration                   
			catch(error => {
				if (addSystemText) {
					addSystemText(error);
				}
			})
		}); // End Search and Connect Promise
	} // End Search and Connect Function

	this.writeString = function (data, addSystemText = null) {
		write(data, true, addSystemText);
	}

	this.writeData = function (data, addSystemText = null) {
		write(data, false, addSystemText);
	}

	var write = function (data, string = true, addSystemText = null) {
		p = new Promise(function (resolve, reject) {
			if (pairedDevices) {
				if (writeCharacteristic != null) {
					// Don't double encode.
					if (string) {
						let encoder = new TextEncoder('utf-8');
						writeCharacteristic.writeValue(encoder.encode(data));
					} else {
						dataInUint8 = Uint8Array.from(data);
						writeCharacteristic.writeValue(dataInUint8);
					}
					resolve();

				} else {
					reject("No write characteristic")
				}
			} else {
				reject("No devices paired.")
			}
		}).catch(error => {
			if (addSystemText) {
				addSystemText("No device paired");
			}
		});
		return p;
	}

	this.disconnectDevice = function () {

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


	return {
		addReceivedDataCallback: addReceivedDataCallback,
		searchAndConnect: searchAndConnect,
		writeString: writeString,
		writeData: writeData,
		disconnectDevice: disconnectDevice
	}
})(); // End Proto
