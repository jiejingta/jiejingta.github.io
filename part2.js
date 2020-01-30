

var WILL = {
	backgroundColor: Module.Color.WHITE,
	color: Module.Color.from(204, 204, 204, 0.5),
    Minvalue: 1,

	init: function(width, height) {
		this.initInkEngine(width, height);
		this.initEvents();
	},

	initInkEngine: function(width, height) {
		this.canvas = new Module.InkCanvas(document.getElementById("canvas"), width, height);
		this.canvas.clear(this.backgroundColor);

		this.brush = new Module.DirectBrush();

		this.speedPathBuilder = new Module.SpeedPathBuilder();
		this.speedPathBuilder.setNormalizationConfig(182, 3547);
		this.speedPathBuilder.setPropertyConfig(Module.PropertyName.Width, 1, 10, 0.72, NaN, Module.PropertyFunction.Power, 1.19, false);

		if (window.PointerEvent) {
			this.pressurePathBuilder = new Module.PressurePathBuilder();
			this.pressurePathBuilder.setNormalizationConfig(0.195, 0.88);
			this.pressurePathBuilder.setPropertyConfig(Module.PropertyName.Width, 1, 10, 0.72, NaN, Module.PropertyFunction.Power, 1.19, false);
		}

		this.strokeRenderer = new Module.StrokeRenderer(this.canvas, this.canvas);
		this.strokeRenderer.configure({brush: this.brush, color: this.color});
	},

	initEvents: function() {
		var self = this;

		if (window.PointerEvent) {
			Module.canvas.addEventListener("pointerdown", function(e) {self.beginStroke(e);});
			Module.canvas.addEventListener("pointermove", function(e) {self.moveStroke(e);});
			document.addEventListener("pointerup", function(e) {self.endStroke(e);});
		}
		else {
			Module.canvas.addEventListener("mousedown", function(e) {self.beginStroke(e);});
			Module.canvas.addEventListener("mousemove", function(e) {self.moveStroke(e);});
			document.addEventListener("mouseup", function(e) {self.endStroke(e);});

			if (window.TouchEvent) {
				Module.canvas.addEventListener("touchstart", function(e) {self.beginStroke(e);});
				Module.canvas.addEventListener("touchmove", function(e) {self.moveStroke(e);});
				document.addEventListener("touchend", function(e) {self.endStroke(e);});
			}
		}

		document.ontouchmove = function(е) {
			е.preventDefault();
		}
	},

    getBrush: function(idstr) {
        var tempBrush = new Module.DirectBrush()
        switch (idstr){
            case "1":
                tempBrush = new Module.DirectBrush();
                break;
            case "2":
                tempBrush = new Module.ParticleBrush(false);
                tempBrush.configure(true, {x: 0, y: 0}, 0.15, 0.05, Module.RotationMode.RANDOM);
                tempBrush.configureShape("shape.png");
                tempBrush.configureFill("fill.png");
                break;
        }
        console.log('return brush', tempBrush);
        return tempBrush;
    },

	getPressure: function(e) {
		return (window.PointerEvent && e instanceof PointerEvent && e.pressure !== 0.5)?e.pressure:NaN;
	},

	beginStroke: function(e) {
		// ????\???\??
        var transparencySliderValue=document.getElementById("transparencySliderValue");
		var colorValue = document.getElementsByClassName('sp-input')[0].value;
        var brushID = $('#brushSelected').val();
		var drawColor = Module.Color.from(parseInt(colorValue.substr(1,2), 16), parseInt(colorValue.substr(3,2), 16), parseInt(colorValue.substr(5,2), 16), transparencySliderValue.value)
		this.strokeRenderer.configure({brush: this.getBrush(brushID), color: drawColor});
        // ??????
        var pxSliderValue=document.getElementById("pxSliderValue");
		WILL.speedPathBuilder.setPropertyConfig(Module.PropertyName.Width, WILL.Minvalue, parseFloat(pxSliderValue.value), 0.72, NaN, Module.PropertyFunction.Power, 1.19, false);
        WILL.speedPathBuilder.setPropertyConfig(Module.PropertyName.Alpha, 0.2, 0.3, NaN, NaN, Module.PropertyFunction.Power, 1, false);

		WILL.pressurePathBuilder.setPropertyConfig(Module.PropertyName.Width, WILL.Minvalue, parseFloat(pxSliderValue.value), 0.72, NaN, Module.PropertyFunction.Power, 1.19, false);
		WILL.pressurePathBuilder.setPropertyConfig(Module.PropertyName.Alpha, 0.2, 0.3, NaN, NaN, Module.PropertyFunction.Power, 1, false);

		if (["mousedown", "mouseup"].contains(e.type) && e.button != 0) return;
		if (e.changedTouches) e = e.changedTouches[0];

		this.inputPhase = Module.InputPhase.Begin;
		this.pressure = this.getPressure(e);
		this.pathBuilder = isNaN(this.pressure)?this.speedPathBuilder:this.pressurePathBuilder;

		this.buildPath({x: e.offsetX, y: e.offsetY});
		this.drawPath();
	},

	moveStroke: function(e) {
		if (!this.inputPhase) return;
		if (e.changedTouches) e = e.changedTouches[0];

		this.inputPhase = Module.InputPhase.Move;
		this.pointerPos = {x: e.offsetX, y: e.offsetY};
		this.pressure = this.getPressure(e);

		if (WILL.frameID != WILL.canvas.frameID) {
			var self = this;

			WILL.frameID = WILL.canvas.requestAnimationFrame(function() {
				if (self.inputPhase && self.inputPhase == Module.InputPhase.Move) {
					self.buildPath(self.pointerPos);
					self.drawPath();
				}
			}, true);
		}
	},

	endStroke: function(e) {
		if (!this.inputPhase) return;
		if (e.changedTouches) e = e.changedTouches[0];

		this.inputPhase = Module.InputPhase.End;
		this.pressure = this.getPressure(e);

		this.buildPath({x: e.offsetX, y: e.offsetY});
		this.drawPath();

		delete this.inputPhase;
	},

	buildPath: function(pos) {
		var pathBuilderValue = isNaN(this.pressure)?Date.now() / 1000:this.pressure;

		var pathPart = this.pathBuilder.addPoint(this.inputPhase, pos, pathBuilderValue);
		var pathContext = this.pathBuilder.addPathPart(pathPart);

		this.pathPart = pathContext.getPathPart();
	},

	drawPath: function() {
		this.strokeRenderer.draw(this.pathPart, this.inputPhase == Module.InputPhase.End);
	},

	clear: function() {
		this.canvas.clear(this.backgroundColor);
	}
};

Module.addPostScript(function() {
	WILL.init(800, 600);
	// WILL.init(screen.width, screen.height);
});