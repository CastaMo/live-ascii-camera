;var ascii = (function() {
	var characters = (" .,:;i1tfLCG08@").split("");
	function asciiFromCanvas(canvas, options) {
		var context = canvas.getContext("2d");
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		
		var asciiCharacters = "";
		var changeArr = [];
		var asciiStr = "";
		var contrastFactor = (259 * (options.contrast + 255)) / (255 * (259 - options.contrast));

		var imageData = context.getImageData(0, 0, canvasWidth, canvasHeight);
		for (var y = 0; y < canvasHeight; y += 2) { 
			for (var x = 0; x < canvasWidth; x++) {

				var asciiNumber = 0;

				//先把第一个数据压到这个ASCII码二进制的低四位
				asciiNumber += getCharacterIndex(x, y, canvasWidth, imageData, contrastFactor);;

				x++;

				//再把第二个数据压到这个ASCII码二进制的高四位，这样可以达到一个ASCII码二进制储存两个数据
				asciiNumber += (getCharacterIndex(x, y, canvasWidth, imageData, contrastFactor) << 4);

				//转换成ASCII码再加到传输的字符串上
				asciiStr += String.fromCharCode(asciiNumber);
			}
		}
		options.callback(asciiStr);
	}
	
	function getCharacterIndex(x, y, canvasWidth, imageData, contrastFactor) {
		var offset = (y * canvasWidth + x) * 4;

		var color = getColorAtOffset(imageData.data, offset);
		
		var contrastedColor = {
			red: bound(Math.floor((color.red - 128) * contrastFactor) + 128, [0, 255]),
			green: bound(Math.floor((color.green - 128) * contrastFactor) + 128, [0, 255]),
			blue: bound(Math.floor((color.blue - 128) * contrastFactor) + 128, [0, 255]),
			alpha: color.alpha
		};
		var brightness = (0.299 * contrastedColor.red + 0.587 * contrastedColor.green + 0.114 * contrastedColor.blue) / 255;
		
		var index = (characters.length - 1) - Math.round(brightness * (characters.length - 1));
		return index;
	}

	function getColorAtOffset(data, offset) {
		return {
			red: data[offset],
			green: data[offset + 1],
			blue: data[offset + 2],
			alpha: data[offset + 3]
		};
	}

	function bound(value, interval) {
		return Math.max(interval[0], Math.min(interval[1], value));
	}

	return {
		fromCanvas: function(canvas, options) {
			options = options || {};
			options.contrast = (typeof options.contrast === "undefined" ? 128 : options.contrast);
			options.callback = options.callback || doNothing;

			return asciiFromCanvas(canvas, options);
		}
	};
})();
