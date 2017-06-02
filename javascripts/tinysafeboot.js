// TODO Read in Hexfile
// TODO Capture display and release
//

var TinySafeBoot = (function () {

	var self = this;

	// Depedency functions
	var receivedData = function () {};
	var writeData = function () {};
	var displayText = function () {};

	// Used for routing commands on received data.
	var CommandEnum = Object.freeze({
		none: 0,
		handshake: 1,
		failed: 2
	});
	var activeCommand = CommandEnum['none'];
	var commandKeys = Object.keys(CommandEnum);

	var startCommandTimeoutTimer = async function (ms) {
		await sleep(ms);
		if (activeCommand !== CommandEnum['none']) {
			activeCommand = CommandEnum['failed'];
			commandRouting();
		}
	}

	// Lets other modules know a TSB command is underway.
	var getControllingSerial = function () {
		return activeCommand !== CommandEnum['none'];
	}

	var sleep = function (ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	this.setHandshakeButton = function (handshakeButton) {
		document.getElementById(handshakeButton).onclick = onHandshakeButtonClick;
	}

	var onHandshakeButtonClick = async function () {
		// TODO: Make reset pin a parameter
		// TODO: Make action timers a parameter

		// HM-1X is set HIGH, LOW, HIGH resetting
		// the Atmega or ATtiny.  Then, TSB handshake is sent.
		activeCommand = CommandEnum['handshake'];
		startCommandTimeoutTimer(3000);
		writeData("AT+PIO31");
		await sleep(200);
		writeData("AT+PIO30");
		await sleep(1200);
		writeData("AT+PIO31");
		await sleep(1200);
		writeData("@@@");
	}

	this.init = function (_receivedData) {
		onReceivedData = receivedData;
	}

	var writeData = function (data) {
		if (self.writeData) {
			self.writeData(data);
		}
	}

	this.setWriteMethod = function (writeMethod) {
		self.writeData = writeMethod;
	}

	this.setDisplayText = function (_displayText) {
		displayText = _displayText;
	}

	this.onReceivedData = function (event) {

		// TODO: Handle received data better.  
		// NOTE: the TX buffer for the HM-1X is only 20 bytes.  
		// But other devices differ.

		var receivedData = new Uint8Array(19);
		for (var i = 0; i < event.target.value.byteLength; i++) {
			receivedData[i] = event.target.value.getUint8(i);
		}
		if (activeCommand != CommandEnum['none']) {
			commandRouting(receivedData);
		}
	}

	var commandRouting = function (data) {
		switch (activeCommand) {
			case CommandEnum['handshake']:
				handshakeHandling(data);
				break;
			case CommandEnum['none']:
				break;
			case CommandEnum['failed']:
				// TODO Handle failed
				displayText("Failed command: " + commandKeys[activeCommand]);
				break;
			default:
				break;
		}
	}

	var handshakeHandling = function (data) {

		// 1. Check if handshake was succesful
		// 2. Decode device info.

		// A full handshake reply is 17 bytes.
		var handshakeReplyCheck = new TextDecoder("utf-8").decode(data);
		// ATtiny will reply 'tsb' and Atmega 'TSB'
		var prefixToCheck = handshakeReplyCheck.substring(0, 3)
		// Last character should be "!"
		var confirm = handshakeReplyCheck.substring(16, 17);
		if (handshakeReplyCheck.substring(0, 3) === 'tsb' ||
			handshakeReplyCheck.substring(0, 3) === 'TSB' &&
			data.length > 16 &&
			confirm === '!'
		) {

			activeCommand = CommandEnum['none'];
			displayText(" ");
			// TODO: Display what device by comparing device signature to known devices.
			displayText("Welcome to Lumi5");
			displayText("TinySafeBoot device succesfully connected");
			displayText(" ");

			// Format TSB handshake data
			var firmwareDatePieces = new Uint8Array(2);
			var firmwareStatus = 0x00;
			var signatureBytes = [];
			var pagesizeInWords = 0x00;
			var freeFlash = [];
			var eepromSize = [];

			firmwareDatePieces[0] = data[3];
			firmwareDatePieces[1] = data[4];
			firmwareStatus = data[5];
			signatureBytes[0] = data[6];
			signatureBytes[1] = data[7];
			signatureBytes[2] = data[8];
			pagesizeInWords = data[9];
			freeFlash[0] = data[10];
			freeFlash[1] = data[11];
			eepromSize[0] = data[12];
			eepromSize[1] = data[13];


			//; Current bootloader date coded into 16-bit number
			//.set    YY      =       16
			//.set    MM      =       10
			//.set    DD      =       27
			//.equ    BUILDDATE   = YY * 512 + MM * 32 + DD
			//; YY = Year - MM = Month - DD = Day

			//var test = 16 * 512 + 10 * 32 + 27; // = 0010000 1010 11011 OR 215B
			//     YY     MM   DD
			// Date of firmware
			var dateStamp = firmwareDatePieces[1] << 8 | firmwareDatePieces[0];
			var day = (dateStamp & 0x3F);
			var month = ((dateStamp & 0x3C0) >> 5);
			var year = ((dateStamp & 0xFC00) >> 9);

			displayText("Firmware Date: 20" + year + "-" + month + "-" + day);

			// Atmel device signature.
			deviceSignature = toByteString(signatureBytes[0]) + " " +
				toByteString(signatureBytes[1]) + " " +
				toByteString(signatureBytes[2]);

			displayText("Device Signature: " + deviceSignature);

			// TODO: Create a prototype for TSB Device
			// This will be used later
			var combinedDeviceSignature = (((signatureBytes[0] << 16) | signatureBytes[1] << 8) | signatureBytes[2]);


			// The size is in words, make it bytes.
			var pageSize = (pagesizeInWords * 2);
			displayText("Pages: " + pageSize);

			// Get flash size.
			var flashSize = ((freeFlash[1] << 8) | freeFlash[0]) * 2;
			displayText("Free Flash: " + flashSize);

			var numberOfPages = flashSize / pageSize;

			// Get EEPROM size.
			fullEepromSize = ((eepromSize[1] << 8) | eepromSize[0]) + 1;
			displayText("EEPROM Size: " + fullEepromSize);

			activeCommand = CommandEnum['none'];

		}
	}

	var toByteString = function (byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
	}

	return {
		init: init,
		writeData: writeData,
		setWriteMethod: setWriteMethod,
		onReceivedData: onReceivedData,
		setHandshakeButton: setHandshakeButton,
		getControllingSerial: getControllingSerial,
		setDisplayText: setDisplayText
	}
})();
