(function() {
	var asciiContainer = document.getElementById("ascii");
        var ws = new WebSocket("ws://brae.co:8125");
        ws.onmessage = function(e)
        {
             asciiContainer.innerHTML = e.data;
        }
})();
