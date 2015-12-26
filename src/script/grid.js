;var grid = (function(win, doc, undefined) {
    "use strict";

   	var append, query, createDom, is, deepCopy;


   	/*---------------------辅助函数 Start----------------------------*/
    append = function(parentNode, childNode) {
    	if (typeof childNode === "string") {
    		var previousHTML = parentNode.innerHTML;
    		return parentNode.innerHTML = previousHTML + childNode;
    	} else {
    		return parentNode.appendChild(childNode);
    	}
    }

    query = function(string, parentNode) {
        if (parentNode) {
            return parentNode.querySelector(string);
        } else {
            return doc.querySelector(string);
        }
    }

    createDom = function(tagName) {
        return document.createElement(tagName);
    }

    is = function(obj, type) {
        var toString = Object.prototype.toString;
        return (type === 'Null' && obj == null) ||
            (type == "Undefined" && Object === undefined) ||
            toString.call(obj).slice(8, -1) === type;
    }

    deepCopy = function(oldObj, newObj) {
        for (var key in oldObj) {
            var copy = oldObj[key];
            if (oldObj === copy) continue; //如window.window === window，会陷入死循环，需要处理一下
            if (is(copy, "Object")) {
                newObj[key] = deepCopy(copy, newObj[key] || {});
            } else if (is(copy, "Array")) {
                newObj[key] = []
                newObj[key] = deepCopy(copy, newObj[key] || []);
            } else {
                newObj[key] = copy;
            }
        }
        return newObj;
    }

   	/*---------------------辅助函数 End----------------------------*/

    var _asciiDom,
    	_cells,
    	characters;


    _asciiDom = query("#ascii");
    _cells = [];
    characters = (" .,:;i1tfLCG08@").split("");

    function initial(width, height) {
    	for (var y = 0; y < height; y++) {
    		var row;
    		row = new Row({seqNum: y});
    		_cells[y] = [];
    		for (var x = 0; x < width; x++) {
    			var cell;
    			cell = new Cell({
    				rowSeqNum: y,
    				seqNum: x
    			}, row.rowDom);
    		}
    	}
    }

    function operArr(arr) {

    }


    var Row = (function() {
        var Row;

        function _getRowDom(row) {
        	var dom = createDom("div");
        	dom.id = "row-" + row.seqNum;
            append(_asciiDom, dom);
            return dom;
        }

        function Row(options) {
            deepCopy(options, this);
            this.init();
        }

        Row.prototype = {
            init: function() {
                this.initRowDom();
            },

            initRowDom: function() {
                this.rowDom = _getRowDom(this);
            }
        }

        return Row;
    })();


    var Cell = (function() {
        var Cell;

        function _getCellDom(cell, rowDom) {
        	var dom = createDom("span");
        	dom.id = "cell-" + cell.rowSeqNum + "-" + cell.seqNum;
        	dom.innerHTML = "@";
            append(rowDom, dom);
            return dom;
        }

        function Cell(options, rowDom) {
            deepCopy(options, this);
            this.init(rowDom);
            _cells[this.rowSeqNum].push(this);
        }

        Cell.prototype = {
            init: function(rowDom) {
                this.initCellDom(rowDom);
                this.initConfig();
            },

            initCellDom: function(rowDom) {
                this.cellDom = _getCellDom(this, rowDom);
            },

            initConfig: function() {
            	this.index = -1;
            },

            changeWord: function(index) {
            	var changeColor = (Math.abs(index - this.index)) > 6;
            	this.index = index;
            	this.cellDom.innerHTML = characters[index];
            	if (changeColor) {
            		this.cellDom.style.color = "red";
            	} else {
            		this.cellDom.style.color = "#000";
            	}
            }
        }

        return Cell;
    })();

    return {
        initial: initial,
        operArr: operArr
    };

})(window, document);
