//=require_tree ./game_helpers
$(document).ready(function() {
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var frame = create_frame();
	var canvas_width = 800;
	var canvas_height = 100;
	var card_width = canvas_width/16;
	var card_height = canvas.height/4;
	var clicked = [];
	var cards = [];
	var time_spent = 0;
	var matched_pairs = 0;
	var matched = false;
	var to_be_unexposed = [];
	for (var i = 0; i < 10; i++) {
		cards.push(new Card(i, card_width, card_height));
		cards.push(new Card(i, card_width, card_height));
	};
	shuffle(cards);

	var timer = create_timer(function() {
		time_spent++;
		// console.log(format_time(output));
		$("#time").text(format_time(time_spent));
	}, 100);
	// $("#time").click(function() {("#time").innerHTML = "eee";});
	$("#btn_start").click(function() {
		if (!timer.is_running) {
			timer.start();
			// console.log('r');
			
		};
	})

	$("#btn_reset").click(function() {
		for (var i = 0; i < cards.length; i++) {cards[i].unexpose();};
		shuffle(cards);
		matched_pairs = 0;
		time_spent = 0;
		clicked = [];
		timer.stop();
		$("#time").text("0:00:0");
	});
	
	frame.set_draw_handler(draw);
	frame.start();

	$("#canvas").click(function(e) {
		if (timer.is_running) {
			var idx = Math.floor(e.offsetY/card_height) * 5 + Math.floor(e.offsetX/card_width);
			if (!cards[idx].get_expose()) {
				if (to_be_unexposed.length > 0) {
					var idx1 = to_be_unexposed[0];
					var idx2 = to_be_unexposed[1];
					cards[idx1].unexpose();
					cards[idx2].unexpose();
					to_be_unexposed = [];
				};
				cards[idx].expose();
				clicked.push(idx);
				if (clicked.length == 2) {
					var idx1 = clicked[0], idx2 = clicked[1];
					if (cards[idx1].get_val() == cards[idx2].get_val()) {
						matched = true;
						matched_pairs++;
						if (matched_pairs == 10) {
							timer.stop();
							setTimeout(function() {
								var msg = 'you spent ' + format_time(time_spent) + "!";
								if (!$("#guest").length > 0) {
									msg += " Do you want to save this record?";
									if (confirm(msg)) {
										var score = time_spent; 
										$.ajax({url: '/memories', type: 'POST', data: {memory: {score: score}}});
										alert('saved');
									};
								} else {
									var msg = 'you spent ' + format_time(time_spent);
									alert(msg);
								}
							}, 1000);
						}
					} else {
						to_be_unexposed = [idx1, idx2];
					};
					clicked = [];
				};
			};
		};
	});

	function format_time(t) {
		var min = Math.floor(t/600);
		var second = Math.floor((t%600)/10);
		var tenth_sec = (t%600)%10;
		var tens_second = Math.floor(second/10);
    	var second = second%10;
    	return min + ":" + tens_second + second + ":" + tenth_sec;
	}

	function draw() {
		for (var i = 0; i < cards.length; i++) {
			var x = card_width * (i%5);
			cards[i].draw(x, Math.floor(i/5) * card_height);
		}
	};
	
	function Card(val, width, height) {
	this.value = val;
	this.width = width;
	this.height = height;
	this.exposed = false;
	this.get_val = function() {return this.value;};
	this.get_expose = function() {return this.exposed};
	this.expose = function() {this.exposed = true};
	this.unexpose = function() {this.exposed = false};
	this.draw = function(x,y) {
		if (this.exposed) {
			ctx.fillStyle = "yellow";
			ctx.fillRect(x, y, this.width, this.height);
			ctx.fillStyle = "black";
			ctx.font = "24px serif";
			ctx.fillText(this.value, x + this.width/2 - 5, y + this.height/2 + 10);
			ctx.strokeRect(x, y, this.width, this.height);
		} else {
			ctx.fillStyle = "green";
			ctx.fillRect(x, y, this.width, this.height);
			ctx.fillStyle = "black";
			ctx.strokeRect(x, y, this.width, this.height);
		};
	};
};
	
});



function copy_array(array) {
	var res = [];
	for (var i = 0; i < array.length; i++) {
		res[i] = array[i];
	};
	return res;
}

function shuffle(array) {
	for (var i =0; i < array.length; i++) {
		var randomIdx = Math.floor(Math.random() * (array.length - i)) + i;
		var tmp = array[i];
		array[i] = array[randomIdx];
		array[randomIdx] = tmp;
	};
}