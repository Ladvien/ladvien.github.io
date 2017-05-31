var tinySafeBoot = (function(){
    
    var receivedData;
    var writeData = function(data)
    
    this.init = function(_receivedData){
        onReceivedData = receivedData;
        tsbWriteData("HELLO!");
    }
    
    this.tsbWriteData = function(data) {
        writeData(data);
    }
    
    this.setWriteMethod = function(writeMethod){
        writeData = writeMethod;
    }
    
    this.onReceivedData = function(data){
        
    }
    
    return {
        init: init,
        tsbWriteData: tsbWriteData,
        setWriteMethod: setWriteMethod,
        onReceivedData: onReceivedData
    }
    
})();