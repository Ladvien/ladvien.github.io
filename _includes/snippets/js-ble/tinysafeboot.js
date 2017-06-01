var TinySafeBoot = (function () {

    var self = this;
    
    // Depedency functions
    var receivedData = function () {};
    var writeData = function () {};
    var displayText = function () {};
    
    // Privates
    var controllingSerial = false;

    // Used for routing commands on received data.
    var CommandEnum = Object.freeze({
        none: 0,
        handshake: 1,
        failedCommand: 99
    })
    var activeCommand = CommandEnum['none'];
    var commandKeys = Object.keys(CommandEnum);
    
    var startCommandTimeoutTimer = async function(ms){
        await sleep(ms);
        if(activeCommand !== CommandEnum['none']){
            displayText("Failed command: " + commandKeys[activeCommand])
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
        // HM-1X is set HIGH, LOW, HIGH resetting
        // the Atmega or ATtiny.  Then, TSB handshake is sent.
        activeCommand = CommandEnum['handshake'];
        startCommandTimeoutTimer(5000);
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
    
    this.setDisplayText = function(_displayText){
        displayText = _displayText;
    }

    this.onReceivedData = function (event) {
        var receivedData = new Uint8Array(19);
        for (var i = 0; i < event.target.value.byteLength; i++) {
            receivedData[i] = event.target.value.getUint8(i);
            
            //console.log(event.target.value.getUint8(i) + ":" + //String.fromCharCode(event.target.value.getUint8(i)));
        }
        console.log(activeCommand);
        if(activeCommand != CommandEnum['none']){
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
            default:
                break;
        }
    }
    
    var handshakeHandling = function(data){
        
        // 1. Check if handshake was succesful
        // 2. Decode device info.
        
        // A full handshake reply is 17 bytes.
        var handshakeReplyCheck = new TextDecoder("utf-8").decode(data);
        // ATtiny will reply 'tsb' and Atmega 'TSB'
        var prefixToCheck = handshakeReplyCheck.substring(0, 3)
        // Last character should be "!"
        var confirm = handshakeReplyCheck.substring(16, 17);
        if(handshakeReplyCheck.substring(0, 3) === 'tsb' ||
          handshakeReplyCheck.substring(0, 3) === 'TSB' &&
          data.length > 16 &&
          confirm === '!'
          ){
            
            activeCommand = CommandEnum['none'];
            displayText(handshakeReplyCheck);
            
            // Format TSB handshake data
            var firmwareDatePieces = [];
            var firmwareStatus = 0x00;
            var signatureBytes = [];
            var pagesizeInWords = 0x00;
            var freeFlash = [];
            var eepromSize = [];
            
        }
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
