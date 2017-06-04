var HexDataHandler = (function () {

	var StringOfHexData = function (byteLength,
		numberOfLines,
		dataString) {

		this.data = data;
		this.byteLength = byteLength;
		this.numberOfLines = numberOfLines;
		this.dataString = dataString;
	}
	var stringOfHexData;

	var LineOfHexData = function (BYTE_COUNT,
		ADDRESS,
		RECORD_TYPE,
		DATA,
		CHECK_SUM) {

		this.byteCount = BYTE_COUNT;
		this.address = ADDRESS;
		this.recordType = RECORD_TYPE;
		this.data = DATA;
		this.checkSum = CHECK_SUM;
	}
	var parsedHexData = [];

	var addTextToDisplay = function () {};
	var onCompletedParsingFile = function () {};

	var setData = function (_data) {

		var data = _data;

		var dataLength = data.byteLength;
		var lines = data.split(/\n/);
		var lineCount = lines.length;

		var arrHexLines = [];
		for (var lineIndex = 0; lineIndex < lines.length; lineIndex++) {

			var pos = 0;
			var byte;

			// Clear ':', '\r' or '\n'
			thisHexLine = clearSpecialChar(lines[lineIndex]);

			var byteCount = ascii2Hex(thisHexLine.substring(pos, pos + 2));
			pos += 2;

			var addressOne = ascii2Hex(thisHexLine.substring(pos, pos + 2));
			pos += 2;

			var addressTwo = ascii2Hex(thisHexLine.substring(pos, pos + 2));
			pos += 2;

			// Combined the address
			var address = ((addressOne << 8) | addressTwo);

			var recordType = ascii2Hex(thisHexLine.substring(pos, pos + 2));
			pos += 2;

			var data = [];
			for (var i = 0; i < byteCount * 2; i += 2) {
				data[i / 2] = ascii2Hex(thisHexLine.substring(pos, pos + 2));
				pos += 2;
			}

			var checkSum = getCheckSum(byteCount,
				addressOne,
				addressTwo,
				recordType,
				data);

			if (recordType === 0) {
				if (checkSum != ascii2Hex(thisHexLine.substring(pos, pos + 2))) {
					return "Error parsing HEX file."
				}
			}

			// Only save lines with data in them.
			lineOfHexData = new LineOfHexData(byteCount,
				address,
				recordType,
				data,
				checkSum
			);
			parsedHexData.push(lineOfHexData);
		}
		onCompletedParsingFile();
	}

	var clearSpecialChar = function (hexLine) {
		hexLine = hexLine.replace(":" || "\r" || "\r", "");
		return hexLine;
	}

	var ascii2Hex = function (dataByteAsString) {
		return parseInt(dataByteAsString, 16);
	}



	var getCheckSum = function (byteCount,
		addressOne,
		addressTwo,
		recordType,
		data
	) {
		var sum = 0;
		sum = (byteCount + addressOne + addressTwo + recordType) & 0xFF;
		for (var i = 0; i < data.length; i++) {
			sum += data[i] & 0xFF;
		}
		return ((0x100 - sum) & 0xFF);
	}

	var getHexLine = function (index) {
		return parsedHexData[index];
	}

	var setAddTextToDisplayMethod = function (_addTextToDisplayMethod) {
		addTextToDisplay = _addTextToDisplayMethod;
	}

	var setOnCompletedParsingFile = function (_onCompletedParsingFile) {
		onCompletedParsingFile = _onCompletedParsingFile;
	}

	var getAllData = function () {
		if (!parsedHexData) {
			return false;
		}
		var dataArray = [];
		var totalElements = 0;
		for (var i = 0; i < parsedHexData.length; i++) {
			if (parsedHexData[i].data.length > 0) {
				if (parsedHexData[i].recordType === 0) {
					for (var j = 0; j < parsedHexData[i].data.length; j++) {
						dataArray.push(parsedHexData[i].data[j]);
					}
				}
			}
		}
		return dataArray;
	}

	return {
		setData: setData,
		setAddTextToDisplayMethod: setAddTextToDisplayMethod,
		setOnCompletedParsingFile: setOnCompletedParsingFile,
		getHexLine: getHexLine,
		getAllData: getAllData
	}

})();
