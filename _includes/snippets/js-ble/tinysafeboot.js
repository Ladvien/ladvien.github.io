var TinySafeBoot = (function () {

    var self = this;
    var receivedData = function () {};
    var writeData;
    var writeToTerminal;
    var controllingSerial = false;

    var CommandEnum = Object.freeze({
        none: 0,
        handshake: 1
    })
    var activeCommand;

    var setControllingSerial = function (isTrue) {
        controllingSerial = isTrue;
    }

    var getControllingSerial = function () {
        return controllingSerial;
    }

    var sleep = function (ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    this.setHandshakeButton = function (handshakeButton) {
        document.getElementById(handshakeButton).onclick = onHandshakeButtonClick;
    }

    var onHandshakeButtonClick = async function () {
        activeCommand = CommandEnum['handshake'];
        setControllingSerial(true);
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
        var handshakeReplyCheck = new TextDecoder("utf-8").decode(data);
        console.log(handshakeReplyCheck.substring(0, 3));
        if(handshakeReplyCheck.substring(0, 3) === 'tsb'){
            console.log("Well! Helo there!");
        }
    }


    return {
        init: init,
        writeData: writeData,
        setWriteMethod: setWriteMethod,
        onReceivedData: onReceivedData,
        setHandshakeButton: setHandshakeButton,
        setControllingSerial: setControllingSerial,
        getControllingSerial: getControllingSerial
    }
})();
