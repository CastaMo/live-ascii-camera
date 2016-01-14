(function() {
	var count = 0;
    var asciiContainer = document.getElementById("ascii");
    grid.initial(160, 60);
    var ws = new WebSocket("ws://brae.co:8125");
    ws.onmessage = function(e) {
    	if (count++ % 10 == 0) {
			grid.blackAll();
		}
    	grid.operArr(e.data);
    }
})();
