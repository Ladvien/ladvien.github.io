var FileHandler = (function () {

	var loadFile = function (event) {
		console.log("ASSA");
		var files = event.target.files; // FileList object

		// files is a FileList of File objects. List some properties.
		var output = [];
		for (var i = 0, f; f = files[i]; i++) {
			output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
				f.size, ' bytes, last modified: ',
				f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
				'</li>');
		}
	}

	return {
		loadFile: loadFile
	}

})();
