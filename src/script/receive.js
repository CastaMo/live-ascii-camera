(function() {
    var asciiContainer = document.getElementById("ascii");
    grid.initial(160, 60);
    var ws = new WebSocket("ws://brae.co:8125");
    ws.onmessage = function(e) {
    	grid.operArr(JSON.parse(e.data));
        //asciiContainer.innerHTML = e.data;
    }
})();
