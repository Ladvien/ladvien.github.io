var FileHandler = (function () {

	// TODO Create a constructor for file which could be passed.
	// The data type could be passed back from the loadFile function 
	// and contain not only the event, but also the file information
	// for example, fileName, bytes, etc.
	
	var addTextToDisplay = function () {};
	var handleReadLoad = function () {};
	var onFinishedLoadingFile = function () {};

	// Async file loading
	// https://stackoverflow.com/questions/14438187/javascript-filereader-parsing-long-file-in-chunks

	var loadFile = function (event) {
		var files = event.target.files; // FileList object
		
		// TODO Switch to only handling one file at a time.
		var reader = new FileReader();
		if(onFinishedLoadingFile){
			reader.onload = onFinishedLoadingFile;			
		} else {
			// TODO Handle no onFinishedLoadingFile set.
		}

		reader.onerror = function (error) {
			// TODO File load error handling
		}
		reader.readAsArrayBuffer(files[0]);
	}

//	var onFinishedLoadingFile = function (event) {
//		var loadedFile = event.target.result;
//	}
	
	var setDisplayMethod = function (_addTextToDisplay) {
		addTextToDisplay = _addTextToDisplay;
	}
	
	var setOnFinishedLoadingFile = function (_onFinishedLoadingFile){
		onFinishedLoadingFile = _onFinishedLoadingFile;
	}

	return {
		loadFile: loadFile,
		setDisplayMethod: setDisplayMethod,
		setOnFinishedLoadingFile: setOnFinishedLoadingFile
	}

})();
