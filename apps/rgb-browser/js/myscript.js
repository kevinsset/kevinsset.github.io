//Main Function

function showCube(){
	document.getElementById("content-gradation").style.display = "none";
	document.getElementById("content-contrastion").style.display = "none";
	document.getElementById("content-cube").style.display = "block";
	
}

function showGradation(){
	document.getElementById("content-cube").style.display = "none";
	document.getElementById("content-contrastion").style.display = "none";
	document.getElementById("content-gradation").style.display = "block";
}

function showContrastion(){
	document.getElementById("content-cube").style.display = "none";
	document.getElementById("content-gradation").style.display = "none";
	document.getElementById("content-contrastion").style.display = "block";
}

function toogleModule(){
	if (document.getElementById('menu-cube').checked) {
		showCube();
	} else if(document.getElementById('menu-grad').checked){
		showGradation();
	} else if(document.getElementById('menu-contra').checked){
		showContrastion();
	}
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

function hexToRGB(hex){
	var redDec = parseInt(hex.substring(0,2), 16);
	var greenDec = parseInt(hex.substring(2,4), 16);
	var blueDec = parseInt(hex.substring(4,6), 16);
	
	return [redDec, greenDec, blueDec];
}

function redrawPreview(fieldId, red, green, blue){
	var prevField = document.getElementById(fieldId);
	prevField.style.backgroundColor = "rgb("+red+","+green+","+blue+")";
}

function setInputFilter(textbox, inputFilter, nextElem) {
	["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
		if(event=="keyup"){
			textbox.addEventListener(event, function(e) {
				if(e.keyCode === 13){
					this.blur();
					if(nextElem){
						nextElem.focus();
					}
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

function previewByHex(baseElem, prevElem){
	if(baseElem.value==""){
		baseElem.value = "000000";
	} else {
		if(baseElem.value.length < 6){
			for(var ch=baseElem.value.length; ch<6; ch++){
				baseElem.value = "0"+baseElem.value;
			}
		}
		baseElem.value = baseElem.value.toUpperCase();
	}
	var prevRGB = hexToRGB(baseElem.value);
	redrawPreview(prevElem, prevRGB[0], prevRGB[1], prevRGB[2]);
}

//1st module function (Color Cube)

function redraw_bg(red, green, blue){
	document.body.style.backgroundColor = "rgb("+red+","+green+","+blue+")";	
}

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

function synCube(colValue, mode, colType){
	var valInput = document.getElementById(colType+"ValueDec");
	var valSlider = document.getElementById("range-"+colType);
	var valHex = document.getElementById("hexValue");
	
	if(mode == "input"){
		valSlider.value = colValue;
	} else if(mode == "slider"){
		valInput.value = colValue;
	}
	
	var redVal = document.getElementById("redValueDec").value;
	var greenVal = document.getElementById("greenValueDec").value;
	var blueVal = document.getElementById("blueValueDec").value;
	
	valHex.value = rgbToHex(redVal, greenVal, blueVal);
	
	if(colType == "red"){
		var canvas_r = document.getElementById("canvas-red");
		var cvs_r = canvas_r.getContext("2d");
		redraw_red(cvs_r, colValue);
	} else if(colType == "green"){
		var canvas_g = document.getElementById("canvas-green");
		var cvs_g = canvas_g.getContext("2d");
		redraw_green(cvs_g, colValue);
	} else if(colType == "blue"){
		var canvas_b = document.getElementById("canvas-blue");
		var cvs_b = canvas_b.getContext("2d");
		redraw_blue(cvs_b, colValue);
	}
	redraw_bg(redVal, greenVal, blueVal);
}

function synColor(elem, mode, colorType){
	if(elem.value==""){
		elem.value = 0;
	}
	synCube(elem.value, mode, colorType);
}

function syncRGBValue(red, green, blue){
	var redVal = document.getElementById("redValueDec");
	var greenVal = document.getElementById("greenValueDec");
	var blueVal = document.getElementById("blueValueDec");
	var redSlide = document.getElementById("range-red");
	var greenSlide = document.getElementById("range-green");
	var blueSlide = document.getElementById("range-blue");
	
	redVal.value = red;
	greenVal.value = green;
	blueVal.value = blue;
	redSlide.value = red;
	greenSlide.value = green;
	blueSlide.value = blue;
	
	var canvas_r = document.getElementById("canvas-red");
	var cvs_r = canvas_r.getContext("2d");
	var canvas_g = document.getElementById("canvas-green");
	var cvs_g = canvas_g.getContext("2d");
	var canvas_b = document.getElementById("canvas-blue");
	var cvs_b = canvas_b.getContext("2d");
	
	redraw_red(cvs_r, red);
	redraw_green(cvs_g, green);
	redraw_blue(cvs_b, blue);
	
	redraw_bg(red, green, blue);
}

function syncByHex(){
	var hexVal = document.getElementById("hexValue");
	if(hexVal.value==""){
		hexVal.value = "000000";
	} else {
		if(hexVal.value.length < 6){
			for(var ch=hexVal.value.length; ch<6; ch++){
				hexVal.value = "0"+hexVal.value;
			}
		}
		hexVal.value = hexVal.value.toUpperCase();
	}
	var rgbVal = hexToRGB(hexVal.value);
	syncRGBValue(rgbVal[0], rgbVal[1], rgbVal[2])
}

//2nd module function (Color Gradation)

function redrawPreviewInfo(red, green, blue, mode){
	var redInfo = document.getElementById(mode+"-red-info");
	var greenInfo = document.getElementById(mode+"-green-info");
	var blueInfo = document.getElementById(mode+"-blue-info");
	var hexInfo = document.getElementById(mode+"-hex-info");
	
	redInfo.innerHTML = red;
	greenInfo.innerHTML = green;
	blueInfo.innerHTML = blue;
	hexInfo.innerHTML = rgbToHex(red, green, blue);
}

function redrawCanvas(cvs, mode, red1, green1, blue1, red2, green2, blue2){
	if (document.getElementById('opt-'+mode+'-8').checked) {
		for(var x=0; x<8; x++){
			cvs.fillStyle = "rgb("+Math.round(red1+(x/7*(red2-red1)))+","+Math.round(green1+(x/7*(green2-green1)))+","+Math.round(blue1+(x/7*(blue2-blue1)))+")";
			cvs.fillRect((x*32), 0, 32, 90);
		}
	} else if (document.getElementById('opt-'+mode+'-16').checked) {
		for(var x=0; x<16; x++){
			cvs.fillStyle = "rgb("+Math.round(red1+(x/15*(red2-red1)))+","+Math.round(green1+(x/15*(green2-green1)))+","+Math.round(blue1+(x/15*(blue2-blue1)))+")";
			cvs.fillRect((x*16), 0, 16, 90);
		}
	} else if (document.getElementById('opt-'+mode+'-smooth').checked) {
		for(var x=0; x<256; x++){
			cvs.fillStyle = "rgb("+Math.round(red1+(x/255*(red2-red1)))+","+Math.round(green1+(x/255*(green2-green1)))+","+Math.round(blue1+(x/255*(blue2-blue1)))+")";
			cvs.fillRect(x, 0, 1, 90);
		}
	}
}

function redrawGradA(baseElem, prevElem){
	previewByHex(baseElem, prevElem);
	var rgbColorA = hexToRGB(baseElem.value);
	var rgbColorB = hexToRGB(document.getElementById("grad-color2").value);
	var canvas = document.getElementById("canvas-gradation");
	var cvs_con = canvas.getContext("2d");
	redrawCanvas(cvs_con, "grad", rgbColorA[0], rgbColorA[1], rgbColorA[2], rgbColorB[0], rgbColorB[1], rgbColorB[2]);
}

function redrawGradB(baseElem, prevElem){
	previewByHex(baseElem, prevElem);
	var rgbColorA = hexToRGB(document.getElementById("grad-color1").value);
	var rgbColorB = hexToRGB(baseElem.value);
	var canvas = document.getElementById("canvas-gradation");
	var cvs_con = canvas.getContext("2d");
	redrawCanvas(cvs_con, "grad", rgbColorA[0], rgbColorA[1], rgbColorA[2], rgbColorB[0], rgbColorB[1], rgbColorB[2]);
}

function redrawGradOpt(){
	var rgbColorA = hexToRGB(document.getElementById("grad-color1").value);
	var rgbColorB = hexToRGB(document.getElementById("grad-color2").value);
	var canvas = document.getElementById("canvas-gradation");
	var cvs_con = canvas.getContext("2d");
	redrawCanvas(cvs_con, "grad", rgbColorA[0], rgbColorA[1], rgbColorA[2], rgbColorB[0], rgbColorB[1], rgbColorB[2]);
}

//3rd module function (Color Contrastion)

function redrawContra(baseElem, prevElem){
	previewByHex(baseElem, prevElem)
	var rgb = hexToRGB(baseElem.value);
	var canvas_dark = document.getElementById("canvas-contra-dark");
	var canvas_light = document.getElementById("canvas-contra-light");
	var cvs_cdark = canvas_dark.getContext("2d");
	var cvs_clight = canvas_light.getContext("2d");
	redrawCanvas(cvs_cdark, "contra-dark", 0, 0, 0, rgb[0], rgb[1], rgb[2]);
	redrawCanvas(cvs_clight, "contra-light", rgb[0], rgb[1], rgb[2], 255, 255, 255);
}

function redrawContraOpt(){
	var rgb = hexToRGB(document.getElementById("contra-color").value);
	var canvas_dark = document.getElementById("canvas-contra-dark");
	var canvas_light = document.getElementById("canvas-contra-light");
	var cvs_cdark = canvas_dark.getContext("2d");
	var cvs_clight = canvas_light.getContext("2d");
	redrawCanvas(cvs_cdark, "contra-dark", 0, 0, 0, rgb[0], rgb[1], rgb[2]);
	redrawCanvas(cvs_clight, "contra-light", rgb[0], rgb[1], rgb[2], 255, 255, 255);
}

//Final function

function setPreviewOnClick(cvsElem, cvsContext, module){
	cvsElem.addEventListener("click", function(event){
		var eventLocation = getEventLocation(this,event);
		var pixelData = cvsContext.getImageData(eventLocation.x, eventLocation.y, 1, 1).data; 
		if(module == 1) {
			syncRGBValue(pixelData[0], pixelData[1], pixelData[2]);
			var hexVal = document.getElementById("hexValue");
			hexVal.value = rgbToHex(pixelData[0], pixelData[1], pixelData[2]);
		} else if(module == 2){
			redrawPreview("grad-preview", pixelData[0], pixelData[1], pixelData[2]);
			redrawPreviewInfo(pixelData[0], pixelData[1], pixelData[2], "grad")
		} else if(module == 3){
			redrawPreview("contra-preview", pixelData[0], pixelData[1], pixelData[2]);
			redrawPreviewInfo(pixelData[0], pixelData[1], pixelData[2], "contra")
		}
	})
}


window.onload = function(){
	//init
	showCube();
	
	
	//init 1st Module
	var redValDec = document.getElementById("redValueDec");
	var greenValDec = document.getElementById("greenValueDec");
	var blueValDec = document.getElementById("blueValueDec");
	
	var redSlider = document.getElementById("range-red");
	var greenSlider = document.getElementById("range-green");
	var blueSlider = document.getElementById("range-blue");
	
	var canvas_r = document.getElementById("canvas-red");
	var cvs_r = canvas_r.getContext("2d");
	var canvas_g = document.getElementById("canvas-green");
	var cvs_g = canvas_g.getContext("2d");
	var canvas_b = document.getElementById("canvas-blue");
	var cvs_b = canvas_b.getContext("2d");
	
	var hexVal = document.getElementById("hexValue");
	
	
	//init 2nd Module
	var gradColorA = document.getElementById("grad-color1");
	var gradColorB = document.getElementById("grad-color2");
	
	var canvas_grad = document.getElementById("canvas-gradation");
	var cvs_grad = canvas_grad.getContext("2d");
	
	
	//init 3rd Module
	var contraBase = document.getElementById("contra-color");
	
	var canvas_contra_dark = document.getElementById("canvas-contra-dark");
	var cvs_cdark = canvas_contra_dark.getContext("2d");
	var canvas_contra_light = document.getElementById("canvas-contra-light");
	var cvs_clight = canvas_contra_light.getContext("2d");
	
	
	//1st Module
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
	}, null);
	setPreviewOnClick(canvas_r, cvs_r, 1);
	setPreviewOnClick(canvas_g, cvs_g, 1);
	setPreviewOnClick(canvas_b, cvs_b, 1);
	
	setTimeout(function () {
        redraw_red(cvs_r, 0);
		redraw_green(cvs_g, 0);
		redraw_blue(cvs_b, 0);
    }, 250);
	
	
	//2nd Module
	setInputFilter(gradColorA, function(value) {
		return /^[0-9a-f]*$/i.test(value); 
	}, gradColorB);
	setInputFilter(gradColorB, function(value) {
		return /^[0-9a-f]*$/i.test(value); 
	}, null);
	setPreviewOnClick(canvas_grad, cvs_grad, 2);
	
	
	//3rd Module
	setInputFilter(contraBase, function(value) {
		return /^[0-9a-f]*$/i.test(value); 
	}, null);
	setPreviewOnClick(canvas_contra_dark, cvs_cdark, 3);
	setPreviewOnClick(canvas_contra_light, cvs_clight, 3);
	
}