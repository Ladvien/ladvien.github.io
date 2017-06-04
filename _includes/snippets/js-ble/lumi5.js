//https://developer.mozilla.org/en-US/docs/Web/API/BluetoothRemoteGATTServer
var log = console.log;
//var writeCharacteristic;
var descriptor;
var receivedString = "";
var terminalLineCounter = 0;
var displayDOM = 'terminal';
var handshakeButton = 'handshake-btn';
var file;
var rawHexArrayBuffer;
var hexArrayBuffer;

let primaryService = document.getElementById('optionalServices').value;

function onScanButtonClick() {
	lumiBle.searchAndConnect(parseInt(primaryService), terminal.addSystemText).
	then(() => {
		lumiBle.addReceivedDataCallback(onReceivedData);
		lumiBle.addReceivedDataCallback(tsb.onReceivedData);
		document.getElementById("search-and-connect-btn").classList.remove('tsb-button-file-parse');
		document.getElementById("search-and-connect-btn").classList.add('tsb-button-search-and-connect-complete');
	})
}


function onReceivedData(event) {
	if (!tsb.getControllingSerial()) {
		for (var i = 0; i < event.target.value.byteLength; i++) {
			receivedString += String.fromCharCode(event.target.value.getUint8(i));
		}
		terminal.addTerminalLine(displayDOM, receivedString, '<- ', 'received-text');
		receivedString = "";
	}
}

function onWriteButtonClick() {
	let textToWrite = document.getElementById('textToWrite').value;
	lumiBle.writeData(textToWrite, terminal.addSystemText)
		.then(_ => {
			terminal.addTerminalLine(displayDOM, textToWrite, '-> ', 'sent-text');
		})
}


var fileFinishedLoading = function (event) {
	file = event.target;
	rawHexArrayBuffer = file.result;
	document.getElementById("file-parse-btn").classList.remove('tsb-button-file-parse');
	document.getElementById("file-parse-btn").classList.add('tsb-button-file-parse-complete');

	document.getElementById("upload-btn").classList.remove('tsb-button-upload');
	document.getElementById("upload-btn").classList.add('tsb-button-upload-visible');
	hexDataHandler.setData(rawHexArrayBuffer);
}

var onConnectedToTSB = function () {
	document.getElementById("handshake-btn").classList.remove('tsb-button-handshake');
	document.getElementById("handshake-btn").classList.add('tsb-button-handshake-complete');
	
}

var onCompletedParsingFile = function() {
	var dataArray = hexDataHandler.getAllData();
	console.log(dataArray);
}

// Setup the display terminal
var terminal = Terminal;
terminal.setDisplayDOM(displayDOM);

// Setup Web API BLE device
var lumiBle = LumiBluetooth;

// Prepare the uploader
var tsb = TinySafeBoot;
tsb.setHandshakeButton(handshakeButton);
tsb.setDisplayText(terminal.addSystemText);
tsb.setOnConnectedToTSB(onConnectedToTSB);

// Get the file handler set.
var fileHandler = FileHandler;
fileHandler.setDisplayMethod(terminal.addSystemText);
fileHandler.setOnFinishedLoadingFile(fileFinishedLoading)

var hexDataHandler = HexDataHandler;
hexDataHandler.setAddTextToDisplayMethod(terminal.addSystemText);
hexDataHandler.setOnCompletedParsingFile(onCompletedParsingFile);

document.getElementById('search-and-connect-btn').onclick = onScanButtonClick;
document.getElementById('btn-write-ble').onclick = onWriteButtonClick;
document.getElementById('file-parse-btn').addEventListener('change', fileHandler.loadFile, false);
document.getElementById('file-upload').addEventListener('change', null, false);