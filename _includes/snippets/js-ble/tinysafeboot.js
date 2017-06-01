var TinySafeBoot = (function(){
    
    var self = this;
    var receivedData = function(){};
    var writeData; 
    
    this.init = function(_receivedData){
        onReceivedData = receivedData;
        self.tsbWriteData("HELLO!");
    }
    
    this.tsbWriteData = function(data) {
        if(self.writeData){
            self.writeData(data);
        }
    }
    
    this.setWriteMethod = function(writeMethod){
        self.writeData = writeMethod;
    }
    
    this.onReceivedData = function(event){
        var receivedData = "";
        for (var i = 0; i < event.target.value.byteLength; i++) {
            console.log(event.target.value.getUint8(i));
        }
    }
    
    return {
        init: init,
        tsbWriteData: tsbWriteData,
        setWriteMethod: setWriteMethod,
        onReceivedData: onReceivedData
    }
})();