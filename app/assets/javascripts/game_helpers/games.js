
// timer class
function Timer(func, millisec) {
	this.func = func;
	this.millisec = millisec;
	this.timer;
	this.is_running = false;
	this.start = function() {
		this.timer = setInterval(this.func, this.millisec);
		this.is_running = true;
	}
	this.stop = function() {
		clearInterval(this.timer);
		this.is_running = false;
	};
};

// create timer
function create_timer(func, millisec) {
	return new Timer(func, millisec);
};

// frame class
function Frame() {
	this.draw_handler;

	this.set_draw_handler = function(draw) {
		this.draw_handler = draw_handler;
		function draw_handler() {
			draw();
			requestAnimationFrame(draw_handler);
		}
		
	};
	
	this.start = function(){
		if (this.draw_handler) {
			requestAnimationFrame(this.draw_handler);
		};
	};
};

// create frame
function create_frame() {return new Frame();};