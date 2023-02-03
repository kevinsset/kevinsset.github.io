var board = new Array();
var msg = new Array();
var status = "";

class Field {
	constructor(y, x){
		this.x = x;
		this.y = y;
		
		this.quad_x = Math.floor(x/3);
		this.quad_y = Math.floor(y/3);
		
		this.is_affected = false;
		this.fix_value = null;
		this.prob_value = [1, 2, 3, 4, 5, 6, 7, 8, 9];
		this.ghost_value = null;
		this.ori_input = false;
		this.is_duplicate = false;
	}
	
	remove_prob(sudo_val){
		for(var i=0; i<9; i++){
			if(i != this.x){
				if(board[this.y][i].fix_value == null){
					var index = board[this.y][i].prob_value.findIndex(v => v == sudo_val);
					if(index >= 0){
						board[this.y][i].prob_value.splice(index, 1);
						board[this.y][i].is_affected = true;
					}
				}
			}
			
			if(i != this.y){
				if(board[i][this.x].fix_value == null){
					var index = board[i][this.x].prob_value.findIndex(v => v == sudo_val);
					if(index >= 0){
						board[i][this.x].prob_value.splice(index, 1);
						board[i][this.x].is_affected = true;
					}
				}
			}
		}
		
		for(var n=0; n<3; n++){
			var group_y = this.quad_y*3 + n;
			for(var m=0; m<3; m++){
				var group_x = this.quad_x*3 + m;
				if(group_y != this.y || group_x != this.x){
					if(board[group_y][group_x].fix_value == null){
						var index = board[group_y][group_x].prob_value.findIndex(v => v == sudo_val);
						if(index >= 0){
							board[group_y][group_x].prob_value.splice(index, 1);
							board[group_y][group_x].is_affected = true;
						}
					}
				}
			}
		}
	}
	
	set_fix(sudo_val){
		if(this.fix_value == null){
			this.fix_value = sudo_val;
			this.prob_value = [];
			this.is_affected = false;
			
			this.remove_prob(sudo_val);
		}
	}
	
	check_fix(){
		if(this.fix_value == null){
			if(this.prob_value.length == 1){
				this.set_fix(this.prob_value[0]);
			} else {
				for(var c=0; c<this.prob_value.length; c++){
					var dupli_x = false;
					var dupli_y = false;
					var dupli_q = false;
					
					for(var i=0; i<9; i++){
						if(i != this.x){
							var index = board[this.y][i].prob_value.findIndex(v => v == this.prob_value[c]);
							if(index >= 0){
								dupli_x = true;
							}
						}
						
						if(i != this.y){
							var index = board[i][this.x].prob_value.findIndex(v => v == this.prob_value[c]);
							if(index >= 0){
								dupli_y = true;
							}
						}
					}
					
					for(var n=0; n<3; n++){
						var group_y = this.quad_y*3 + n;
						for(var m=0; m<3; m++){
							var group_x = this.quad_x*3 + m;
							if(group_y != this.y || group_x != this.x){
								var index = board[group_y][group_x].prob_value.findIndex(v => v == this.prob_value[c]);
								if(index >= 0){
									dupli_q = true;
								}
							}
						}
					}
					
					if(dupli_x == false || dupli_y == false || dupli_q == false){
						this.set_fix(this.prob_value[c]);
						break;
					}
				}
			}
		}
	}
	
	check_ghost(sudo_val){
		var dupli_x = false;
		var dupli_y = false;
		var dupli_q = false;
		this.ghost_value = null;
		
		for(var i=0; i<9; i++){
			if(i != this.x){
				if(board[this.y][i].ghost_value == sudo_val){
					dupli_x = true;
				}
			}
			
			if(i != this.y){
				if(board[i][this.x].ghost_value == sudo_val){
					dupli_y = true;
				}
			}
		}
		
		for(var n=0; n<3; n++){
			var group_y = this.quad_y*3 + n;
			for(var m=0; m<3; m++){
				var group_x = this.quad_x*3 + m;
				if(group_y != this.y || group_x != this.x){
					if(board[group_y][group_x].ghost_value == sudo_val){
						dupli_q = true;
					}
				}
			}
		}
		
		if(dupli_x == false && dupli_y == false && dupli_q == false){
			this.ghost_value = sudo_val;
			return true;
		} else {
			return false;
		}
	}
}

function initPage(){
	board = [];
	msg['msg'] = "Enter the numbers below";
	msg['type'] = "info";
	status = "Program Standby";
}

function constructBoard(){
	for(var n=0; n<9; n++){
		board[n] = new Array();
		for(var m=0; m<9; m++){
			board[n][m] = new Field(n, m);
		}
	}
}

function checkValidation(){
	var duplicate = false;
	for(var y=0; y<9; y++){
		for(var x=0; x<9; x++){
			if(board[y][x].fix_value){
				for(var i=0; i<9; i++){
					if(i != x){
						if(board[y][x].fix_value == board[y][i].fix_value){
							duplicate = true;
							board[y][x].is_duplicate = true;
							board[y][i].is_duplicate = true;
							break;
						}
					}
					
					if(i != y){
						if(board[y][x].fix_value == board[i][x].fix_value){
							duplicate = true;
							board[y][x].is_duplicate = true;
							board[i][x].is_duplicate = true;
							break;
						}
					}
				}
				
				for(var n=0; n<3; n++){
					var group_y = board[y][x].quad_y*3 + n;
					for(var m=0; m<3; m++){
						var group_x = board[y][x].quad_x*3 + m;
						if(group_y != y || group_x != x){
							if(board[y][x].fix_value == board[group_y][group_x].fix_value){
								duplicate = true;
								board[y][x].is_duplicate = true;
								board[group_y][group_x].is_duplicate = true;
								break;
							}
						}
					}
				}
				
				if(duplicate){
					break;
				}
			}
		}
		
		if(duplicate){
			break;
		}
	}
	
	if(duplicate){
		msg['msg'] = "Input number is duplicate!";
		msg['type'] = "failed";
		return false;
	} else {
		return true;
	}
}

function initBoard(){
	for(var n=0; n<9; n++){
		for(var m=0; m<9; m++){
			var fieldVal = document.getElementById('field_'+n+'_'+m).value;
			if(fieldVal){
				board[n][m].set_fix(fieldVal);
				board[n][m].ori_input = true;
			}
		}
	}
}

function backTrack(){
	var i = 0;
	const ghost_u = new Array();
	const ghost = new Array();
	var solvable = true;
	for(var y=0; y<9; y++){
		for(var x=0; x<9; x++){
			if(board[y][x].fix_value == null){
				ghost_u[i] = new Array();
				ghost_u[i]['x'] = x;
				ghost_u[i]['y'] = y;
				ghost_u[i]['quad_x'] = board[y][x].quad_x;
				ghost_u[i]['quad_y'] = board[y][x].quad_y;
				ghost_u[i]['prob'] = new Array();
				for(var c=0; c<board[y][x].prob_value.length; c++){
					ghost_u[i]['prob'][c] = board[y][x].prob_value[c];
				}
				ghost_u[i]['i_prob'] = 0;
				i++;
			}
		}
	}
	
	var c_prob = 2;
	var i_ghost = 0;
	do{
		for(var ig=0; ig<ghost_u.length; ig++){
			if(ghost_u[ig]['prob'].length == c_prob){
				ghost[i_ghost] = ghost_u[ig];
				i_ghost++;
			}
		}
		c_prob++;
	} while (i_ghost < ghost_u.length);
	
	for(var l=0; l<ghost.length; l++){
		if(l == -1){
			solvable = false;
			break;
		} else {
			var ghost_check = false;
			if(ghost[l]['i_prob'] < ghost[l]['prob'].length){
				for(var z=ghost[l]['i_prob']; z<ghost[l]['prob'].length; z++){
					ghost[l]['i_prob'] = z;
					ghost_check = board[ghost[l]['y']][ghost[l]['x']].check_ghost(ghost[l]['prob'][z]);
					if(ghost_check){
						break;
					}
				}
				ghost[l]['i_prob']++;
				
				if(ghost_check == false){
					board[ghost[l]['y']][ghost[l]['x']].ghost_value = null;
					ghost[l]['i_prob'] = 0;
					l = l-2;
				}
			} else {
				board[ghost[l]['y']][ghost[l]['x']].ghost_value = null;
				ghost[l]['i_prob'] = 0;
				l = l-2;
			}
		}
	}
	
	if(solvable){
		for(var y=0; y<9; y++){
			for(var x=0; x<9; x++){
				board[y][x].set_fix(board[y][x].ghost_value);
			}
		}
		msg['msg'] = "Sudoku has been solved";
		msg['type'] = "succeed";
	} else {
		msg['msg'] = "Sudoku is unsolvable";
		msg['type'] = "failed";
	}
}

function constraintProgramming(){
	var solvable = true;
	var affected = 0;
	do{
		affected = 0;
		var is_fix = 0;
		for(var n=0; n<9; n++){
			for(var m=0; m<9; m++){
				board[n][m].check_fix();
			}
		}
		
		for(var n=0; n<9; n++){
			for(var m=0; m<9; m++){
				if(board[n][m].is_affected){
					affected++;
					board[n][m].is_affected = false;
				}
				
				if(board[n][m].fix_value){
					is_fix++;
				} else if(board[n][m].prob_value.length == 0){
					solvable = false;
				}
			}
		}
	} while(affected > 0);
	
	if(is_fix == 81){
		msg['msg'] = "Sudoku has been solved";
		msg['type'] = "succeed";
	} else if(solvable == false){
		msg['msg'] = "Sudoku is unsolvable";
		msg['type'] = "failed";
	} else {
		backTrack();
	}
}

function showResult(){
	for(var y=0; y<9; y++){
		for(var x=0; x<9; x++){
			if(board[y][x].ori_input){
				var field = document.getElementById('field_'+y+'_'+x);
				field.value = board[y][x].fix_value;
				if(board[y][x].is_duplicate){
					field.classList.add("is-duplicate");
				}
			} else if(msg['type']=="succeed"){
				var field = document.getElementById('field_'+y+'_'+x);
				field.value = board[y][x].fix_value;
				field.classList.add("is-solution");
			}
		}
	}
}

function showMessage(){
	var lblMsg = document.getElementById("lbl-msg");
	lblMsg.innerHTML = msg['msg'];
	if(msg['type'] == "succeed"){
		lblMsg.className = "message-success";
	} else if(msg['type'] == "failed"){
		lblMsg.className = "message-failed";
	} else {
		lblMsg.className = "";
	}
	
	var lblStat = document.getElementById("lbl-status");
	lblStat.innerHTML = status;
}

function solve(){
	var startTime, endTime;
	startTime = new Date();
	constructBoard();
	initBoard();
	
	var inp = document.getElementsByClassName("sudo-input");
	for(var i=0; i<inp.length; i++){
		inp[i].setAttribute('readonly', 'readonly');
	}
	
	if(checkValidation()){
		constraintProgramming();
	}
	showResult();
	if(msg['type']=="failed"){
		status = "Error. ";
	} else {
		status = "Finished. ";
	}
	endTime = new Date();
	status = status + "Process Time = " + (Math.round(endTime - startTime)/1000) + " sec"; 
	
	showMessage();
}

function resetField() {
	initPage();
	
	var x = document.getElementById("lbl-msg");
	x.innerHTML = msg['msg'];
	x.className = "";
	
	var y = document.getElementById("lbl-status");
	y.innerHTML = status;
	
	var inp = document.getElementsByClassName("sudo-input");
	for(var i=0; i<inp.length; i++){
		inp[i].removeAttribute('readonly');
		inp[i].className = "sudo-input is-input";
		inp[i].value = "";
	}
}

function testinput(elem) {
	elem.value=elem.value.replace(/[^1-9]/g,'');
}


