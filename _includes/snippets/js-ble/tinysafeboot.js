// TODO Read in Hexfile
// TODO Capture display and release
// var string = new TextDecoder().decode(loadedFile.slice(10, 120));

var TinySafeBoot = (function () {

	var self = this;

	function TSBDevice(
		deviceName,
		firmwareDate,
		deviceSignature,
		numberOfPages,
		freeFlash,
		eepromSize
	) {
		this.deviceName = deviceName;
		this.firmwareDate = firmwareDate;
		this.deviceSignature = deviceSignature;
		this.numberOfPages = numberOfPages;
		this.freeFlash = freeFlash;
		this.eepromSize = eepromSize;
	};
	var connectedDevice;

	// Depedency functions
	var receivedData = function () {};
	var writeData = function () {};
	var displayText = function () {};
	var onConnectedToTSB = function () {};

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
			var date = ("20" + year + "-" + month + "-" + day);

			// Atmel device signature.
			deviceSignature = toByteString(signatureBytes[0]) + " " +
				toByteString(signatureBytes[1]) + " " +
				toByteString(signatureBytes[2]);

			// TODO: Create a prototype for TSB Device
			// This will be used later
			var combinedDeviceSignature = (((signatureBytes[0] << 16) | signatureBytes[1] << 8) | signatureBytes[2]);

			var deviceName = getDeviceFromSignature(combinedDeviceSignature);

			// The size is in words, make it bytes.
			var pageSize = (pagesizeInWords * 2);

			// Get flash size.
			var flashSize = ((freeFlash[1] << 8) | freeFlash[0]) * 2;
			var numberOfPages = flashSize / pageSize;

			// Get EEPROM size.
			fullEepromSize = ((eepromSize[1] << 8) | eepromSize[0]) + 1;

			activeCommand = CommandEnum['none'];

			connectedDevice = new TSBDevice(deviceName,
				date,
				combinedDeviceSignature,
				pageSize,
				flashSize,
				fullEepromSize
			)

			displayText("Welcome to Lumi5");
			displayText("TinySafeBoot connected to: " + deviceName);
			displayText(" ");
			displayText("Free Flash: 		" + flashSize);
			displayText("Pages: 			" + pageSize);
			displayText("EEPROM Size: 		" + fullEepromSize);
			displayText("Firmware Date: 	" + date);
			displayText("Device Signature: 	" + deviceSignature);

			if (onConnectedToTSB) {
				onConnectedToTSB();
			}
		}
	}

	var toByteString = function (byte) {
		return ('0' + (byte & 0xFF).toString(16)).slice(-2).toUpperCase();
	}

	var getDeviceFromSignature = function (signature) {
		for (key in DEVICE_SIGNATURES) {
			if (DEVICE_SIGNATURES[key] === signature) {
				return key;
			}
		}
	}

	var DEVICE_SIGNATURES = Object.freeze({
		ATTINY_13A: 0x1E9007,
		ATTINY_13: 0x1E9007,
		ATTINY_1634: 0x1E9412,
		ATTINY_167: 0x1E9487,
		ATTINY_2313A: 0x1E910A,
		ATTINY_2313: 0x1E910A,
		ATTINY_24A: 0x1E910B,
		ATTINY_24: 0x1E910B,
		ATTINY_25: 0x1E910B,
		ATTINY_261A: 0x1E910C,
		ATTINY_261: 0x1E910C,
		ATTINY_4313: 0x1E920D,
		ATTINY_44A: 0x1E9207,
		ATTINY_44: 0x1E9207,
		ATTINY_441: 0x1E9215,
		ATTINY_45: 0x1E9206,
		ATTINY_461A: 0x1E9208,
		ATTINY_461: 0x1E9208,
		ATTINY_48: 0x1E9209,
		ATTINY_84A: 0x1E930C,
		ATTINY_84: 0x1E930C,
		ATTINY_841: 0x1E9315,
		ATTINY_85: 0x1E930B,
		ATTINY_861A: 0x1E930D,
		ATTINY_861: 0x1E930D,
		ATTINY_87: 0x1E9387,
		ATTINY_88: 0x1E9311,
		ATMEGA_162: 0x1E9403,
		ATMEGA_164A: 0x1E940F,
		ATMEGA_164PA: 0x1E940A,
		ATMEGA_164P: 0x1E940A,
		ATMEGA_165A: 0x1E9410,
		ATMEGA_165PA: 0x1E9407,
		ATMEGA_165P: 0x1E9407,
		ATMEGA_168A: 0x1E9406,
		ATMEGA_168: 0x1E9406,
		ATMEGA_168PA: 0x1E940B,
		ATMEGA_168P: 0x1E940B,
		ATMEGA_169A: 0x1E9411,
		ATMEGA_169PA: 0x1E9405,
		ATMEGA_169P: 0x1E9405,
		ATMEGA_16A: 0x1E9403,
		ATMEGA_16: 0x1E9403,
		ATMEGA_16HVA: 0x1E940C,
		ATMEGA_16HVB: 0x1E940D,
		ATMEGA_16ATMEGA_1: 0x1E9484,
		ATMEGA_16U2: 0x1E9489,
		ATMEGA_16U4: 0x1E9488,
		ATMEGA_324A: 0x1E9515,
		ATMEGA_324PA: 0x1E9511,
		ATMEGA_324P: 0x1E9508,
		ATMEGA_3250A: 0x1E950E,
		ATMEGA_3250: 0x1E9506,
		ATMEGA_3250PA: 0x1E950E,
		ATMEGA_3250P: 0x1E950E,
		ATMEGA_325A: 0x1E9505,
		ATMEGA_325: 0x1E9505,
		ATMEGA_325PA: 0x1E9505,
		ATMEGA_325P: 0x1E950D,
		ATMEGA_328: 0x1E9514,
		ATMEGA_328P: 0x1E950F,
		ATMEGA_3290A: 0x1E950C,
		ATMEGA_3290: 0x1E9504,
		ATMEGA_3290PA: 0x1E950C,
		ATMEGA_3290P: 0x1E950C,
		ATMEGA_329A: 0x1E9503,
		ATMEGA_329: 0x1E9503,
		ATMEGA_329PA: 0x1E950B,
		ATMEGA_329P: 0x1E950B,
		ATMEGA_32A: 0x1E9502,
		ATMEGA_32C1: 0x1E9586,
		ATMEGA_32: 0x1E9502,
		ATMEGA_32HVB: 0x1E9510,
		ATMEGA_32ATMEGA_1: 0x1E9584,
		ATMEGA_32U2: 0x1E958A,
		ATMEGA_32U4: 0x1E9587,
		ATMEGA_406: 0x1E9507,
		ATMEGA_48A: 0x1E9205,
		ATMEGA_48: 0x1E9205,
		ATMEGA_48PA: 0x1E920A,
		ATMEGA_48P: 0x1E920A,
		ATMEGA_640: 0x1E9608,
		ATMEGA_644A: 0x1E9609,
		ATMEGA_644: 0x1E9609,
		ATMEGA_644PA: 0x1E960A,
		ATMEGA_644P: 0x1E960A
	});

	var setOnConnectedToTSB = function (_onConnectedToTSB) {
		onConnectedToTSB = _onConnectedToTSB;
	}

	return {
		init: init,
		writeData: writeData,
		setWriteMethod: setWriteMethod,
		onReceivedData: onReceivedData,
		setHandshakeButton: setHandshakeButton,
		getControllingSerial: getControllingSerial,
		setDisplayText: setDisplayText,
		setOnConnectedToTSB: setOnConnectedToTSB
	}
})();
