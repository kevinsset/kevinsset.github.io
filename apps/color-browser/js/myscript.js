function redraw_red(canvas, red){
	for(var j=0; j<256; j++){
		for(var k=0; k<256; k++){
			canvas.fillStyle = "rgb("+red+","+(255-j)+","+k+")";
			canvas.fillRect(k, j, 1, 1);
		}
	}
}

function redraw_green(canvas, green){
	for(var j=0; j<256; j++){
		for(var k=0; k<256; k++){
			canvas.fillStyle = "rgb("+k+","+green+","+(255-j)+")";
			canvas.fillRect(k, j, 1, 1);
		}
	}
}

function redraw_blue(canvas, blue){
	
	for(var j=0; j<256; j++){
		for(var k=0; k<256; k++){
			canvas.fillStyle = "rgb("+(255-j)+","+k+","+blue+")";
			canvas.fillRect(k, j, 1, 1);
		}
	}
}

function refreshbg(){
	var redVal = document.getElementById("redValueDec").value;
	var greenVal = document.getElementById("greenValueDec").value;
	var blueVal = document.getElementById("blueValueDec").value;
	
	document.body.style.backgroundColor = "rgb("+redVal+","+greenVal+","+blueVal+")";
	
}

function setInputFilter(textbox, inputFilter, nextElem) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
		if(event=="keyup"){
			textbox.addEventListener(event, function(e) {
				if(e.keyCode === 13){
					this.blur();
					nextElem.focus();
				} else {
					if (inputFilter(this.value)) {
						this.oldValue = this.value;
						this.oldSelectionStart = this.selectionStart;
						this.oldSelectionEnd = this.selectionEnd;
					} else if (this.hasOwnProperty("oldValue")) {
						this.value = this.oldValue;
						this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
					} else {
						this.value = "";
					}
				}
			});
		} else {
			textbox.addEventListener(event, function() {
				if (inputFilter(this.value)) {
					this.oldValue = this.value;
					this.oldSelectionStart = this.selectionStart;
					this.oldSelectionEnd = this.selectionEnd;
				} else if (this.hasOwnProperty("oldValue")) {
					this.value = this.oldValue;
					this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
				} else {
					this.value = "";
				}
			});
		}
	});
}

function rgbToHex(red, green, blue) {
	var redHex = parseInt(red).toString(16);
	var greenHex = parseInt(green).toString(16);
	var blueHex = parseInt(blue).toString(16);
	
	if(redHex.length == 1){
		redHex = "0"+redHex;
	}
	if(greenHex.length == 1){
		greenHex = "0"+greenHex;
	}
	if(blueHex.length == 1){
		blueHex = "0"+blueHex;
	}
	
	return (redHex+greenHex+blueHex).toUpperCase();
}

function getElementPosition(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function getEventLocation(element,event){
    var pos = getElementPosition(element);
    
    return {
    	x: (event.pageX - pos.x),
      	y: (event.pageY - pos.y)
    };
}



window.onload = function(){
	
	var canvas_r = document.getElementById("canvas-red");
	var cvs_r = canvas_r.getContext("2d");
	var canvas_g = document.getElementById("canvas-green");
	var cvs_g = canvas_g.getContext("2d");
	var canvas_b = document.getElementById("canvas-blue");
	var cvs_b = canvas_b.getContext("2d");
	
	var redValDec = document.getElementById("redValueDec");
	var greenValDec = document.getElementById("greenValueDec");
	var blueValDec = document.getElementById("blueValueDec");
	
	var redSlider = document.getElementById("range-red");
	var greenSlider = document.getElementById("range-green");
	var blueSlider = document.getElementById("range-blue");
	
	var hexVal = document.getElementById("hexValue");
	
	
	setInputFilter(redValDec, function(value) {
		return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 255); 
	}, greenValDec);
	setInputFilter(greenValDec, function(value) {
		return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 255); 
	}, blueValDec);
	setInputFilter(blueValDec, function(value) {
		return /^\d*$/.test(value) && (value === "" || parseInt(value) <= 255); 
	}, redValDec);
	setInputFilter(hexVal, function(value) {
		return /^[0-9a-f]*$/i.test(value); 
	}, canvas_r);
	
	
	redSlider.oninput = function() {
		redValDec.value = this.value;
		redraw_red(cvs_r, this.value);
		refreshbg();
		hexVal.value = rgbToHex(this.value, greenValDec.value, blueValDec.value);
	}
	greenSlider.oninput = function() {
		greenValDec.value = this.value;
		redraw_green(cvs_g, this.value);
		refreshbg();
		hexVal.value = rgbToHex(redValDec.value, this.value, blueValDec.value);
	}
	blueSlider.oninput = function() {
		blueValDec.value = this.value;
		redraw_blue(cvs_b, this.value);
		refreshbg();
		hexVal.value = rgbToHex(redValDec.value, greenValDec.value, this.value);
	}
	
	redValDec.onblur = function() {
		if(this.value==""){
			this.value = 0;
		}
		redSlider.value = this.value;
		redraw_red(cvs_r, this.value);
		refreshbg();
		hexVal.value = rgbToHex(this.value, greenValDec.value, blueValDec.value);
	}
	greenValDec.onblur = function() {
		if(this.value==""){
			this.value = 0;
		}
		greenSlider.value = this.value;
		redraw_green(cvs_g, this.value);
		refreshbg();
		hexVal.value = rgbToHex(redValDec.value, this.value, blueValDec.value);
	}
	blueValDec.onblur = function() {
		if(this.value==""){
			this.value = 0;
		}
		blueSlider.value = this.value;
		redraw_blue(cvs_b, this.value);
		refreshbg();
		hexVal.value = rgbToHex(redValDec.value, greenValDec.value, this.value);
	}
	
	hexVal.onblur = function() {
		if(this.value==""){
			this.value = "000000";
		}
		
		var redDec = parseInt(this.value.substring(0,2), 16);
		var greenDec = parseInt(this.value.substring(2,4), 16);
		var blueDec = parseInt(this.value.substring(4,6), 16);
		
		redSlider.value = redDec;
		greenSlider.value = greenDec;
		blueSlider.value = blueDec;
		
		redValDec.value = redDec;
		greenValDec.value = greenDec;
		blueValDec.value = blueDec;
		
		redraw_red(cvs_r, redDec);
		redraw_green(cvs_g, greenDec);
		redraw_blue(cvs_b, blueDec);
		refreshbg();
		hexVal.value = this.value.toUpperCase();
	}
	
	canvas_r.addEventListener("click",function(event){
		var eventLocation = getEventLocation(this,event);
		var pixelData = cvs_r.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
		
		greenValDec.value = pixelData[1];
		blueValDec.value = pixelData[2];
		greenSlider.value = pixelData[1];
		blueSlider.value = pixelData[2];
		redraw_green(cvs_g, pixelData[1]);
		redraw_blue(cvs_b, pixelData[2]);
		refreshbg();
		hexVal.value = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
	},false);
	
	canvas_g.addEventListener("click",function(event){
		var eventLocation = getEventLocation(this,event);
		var pixelData = cvs_g.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
		
		redValDec.value = pixelData[0];
		blueValDec.value = pixelData[2];
		redSlider.value = pixelData[0];
		blueSlider.value = pixelData[2];
		redraw_red(cvs_r, pixelData[0]);
		redraw_blue(cvs_b, pixelData[2]);
		refreshbg();
		hexVal.value = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
	},false);
	
	canvas_b.addEventListener("click",function(event){
		var eventLocation = getEventLocation(this,event);
		var pixelData = cvs_b.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
		
		redValDec.value = pixelData[0];
		greenValDec.value = pixelData[1];
		redSlider.value = pixelData[0];
		greenSlider.value = pixelData[1];
		redraw_red(cvs_r, pixelData[0]);
		redraw_green(cvs_g, pixelData[1]);
		refreshbg();
		hexVal.value = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
	},false);
	
	
	redValDec.value = 0;
	greenValDec.value = 0;
	blueValDec.value = 0;
	
	redraw_red(cvs_r, 0);
	redraw_green(cvs_g, 0);
	redraw_blue(cvs_b, 0);
	
}