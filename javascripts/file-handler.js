var FileHandler = (function () {

	var loadFile = function (event) {
		var files = event.target.files; // FileList object

		// files is a FileList of File objects. List some properties.
		var output = [];

		var reader = new FileReader();
		reader.onload = function () {
			var arrayBuffer = reader.result;
			console.log(arrayBuffer);
		};
		return reader.readAsText(files[0]);
		//		for (var i = 0, f; f = files[i]; i++) {
		//
		//			console.log(files[i]);
		//
		//
		//		}
	}

	return {
		loadFile: loadFile
	}

})();
