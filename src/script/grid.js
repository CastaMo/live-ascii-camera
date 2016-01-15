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
    	characters,
    	canvasWidth, canvasHeight;


    _asciiDom = query("#ascii");
    _cells = [];
    characters = (" .,:;i1tfLCG08@").split("");

    function initial(width, height) {
    	canvasWidth = width;
    	canvasHeight = height;
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

    function blackAll() {
    	for (var i = 0, len1 = _cells.length; i < len1; i++) {
    		for (var j = 0, len2 = _cells[i].length; j < len2; j++) {
                var _ref = _cells[i][j];
                var _refDom = _ref.cellDom;
    			_refDom.style.color = "#000";
                _refDom.innerHTML = characters[_ref.index];
    		}
    	}
    }
    
    function operArr(asciiStr) {
    	for (var i = 0, len = asciiStr.length; i < len; i++) {
    		try {
                //获取每一个ASCII码
	    		var asciiNumber = asciiStr.charCodeAt(i);

                //因为原先的字符串在'宽度'上被压缩成原来的一半，所以这里对字符串做行列切割的时候要注意'宽度'也要变为原来的一半
	    		var y = Math.floor(i / (Math.floor(canvasWidth / 2)));
	    		var x = Math.floor(i % (Math.floor(canvasWidth / 2)));

                //取出低四位和高四位数据的具体内容
	    		var f1 = Math.floor(asciiNumber % 16);
	    		var f2 = Math.floor(asciiNumber / 16);

                //因为传输前把两个数据压到一个ASCII上，所以在解密时，要注意对应的位置里的实际数据
	    		var cell1 = _cells[y][x*2];
	    		var cell2 = _cells[y][x*2+1];
                //为考虑到网页的性能，先判断是否需要改变原来的字符，不需要则不做任何操作。
	    		if (cell1.checkNeedChange(f1)) {
	    			cell1.changeWord(f1);
	    		}
	    		if (cell2.checkNeedChange(f2)) {
	    			cell2.changeWord(f2);
	    		}
	    	} catch(e) {
	    		console.log(e);
	    	}
    	}
    }

    function judgeNeedChange(y, x, index) {
    	return _cells[y][x].checkNeedChange(index);
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
            	this.index = 16;
            },

            emphaDom: function() {
                this.count = 5;
                this.cellDom.innerHTML = "@";
                this.cellDom.style.color = "#CE0000";
            },

            recoverDom: function() {
                this.cellDom.innerHTML = characters[this.index];
                this.cellDom.style.color = "#000";
            },

            changeWord: function(index) {
            	var changeColor = (Math.abs(index - this.index)) > 6;
            	this.index = index;
            	if (changeColor) {
            		this.emphaDom();
            	} else {
                    this.cellDom.innerHTML = characters[index];
                }
            },

            checkNeedChange: function(index) {
                if (this.count > 0) {
                    this.count--;
                    if (this.count === 0) {
                        this.recoverDom();
                    }
                } 
            	return (this.index !== index);
            }
        }

        return Cell;
    })();

    return {
        initial: initial,
        operArr: operArr,
        judgeNeedChange: judgeNeedChange,
        blackAll: blackAll
    };

})(window, document);
