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

	var setData = function (_data) {

		data = _data;

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
			if (recordType === 0) {
				lineOfHexData = new LineOfHexData(byteCount,
					address,
					recordType,
					data,
					checkSum
				);
				parsedHexData.push(lineOfHexData);
			}
			console.log(parsedHexData[lineIndex]);
		}
		

	}
	var data;

	var countLines = function (data) {
		var countOfEOL = 0;
		for (var i = 0; i < data.Length; i++) {
			if (data[i] === '\n') {
				countOfEOL++;
			}
		}
		return countOfEOL;
	}

	var getChar = function (hexString, index) {

	}

	var clearSpecialChar = function (hexLine) {
		hexLine = hexLine.replace(":" || "\r" || "\r", "");
		return hexLine;
	}

	var ascii2Hex = function (dataByteAsString) {
		return parseInt(dataByteAsString, 16);
	}

	var setAddTextToDisplayMethod = function (_addTextToDisplayMethod) {
		addTextToDisplay = _addTextToDisplayMethod;
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

	return {
		setData: setData,
		setAddTextToDisplayMethod: setAddTextToDisplayMethod
	}

})();
