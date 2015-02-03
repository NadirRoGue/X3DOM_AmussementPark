var contentPane = d3.select('#contentPane');
var x3dtree = contentPane.append('x3d')
				.attr('width','1000px')
				.attr('height','700px');

var scene = x3dtree.append('scene');
var paused = false;
var elapsed;

//#########################################################

function log(str) {
	document.getElementById('console').innerHTML = str;
}

//#########################################################

function createBox(root, diffuseColor, size) {
	var shape = root.append('shape');
	shape.append('appearance')
		.append('material')
			.attr('diffuseColor',diffuseColor)
			.attr('specularColor','0.5 0.5. 0.5');
			
	shape.append('box')
		.attr('size',size)
		.attr('onclick','pickFunction()');
}

//#########################################################

function createTexturedBox(root, texture, size) {
	var shape = root.append('shape');
	var app = shape.append('appearance');
	
	app.append('material')
		.attr('diffuseColor','1 1 1')
		.attr('specularColor','0.5 0.5 0.5');
	app.append('ImageTexture')
		.attr('url',texture);
			
	shape.append('box')
		.attr('size',size)
		.attr('onclick','pickFunction()');
}

//#########################################################

function setUpViewer() {
	scene.append('viewpoint')
		.attr('orientation','1 0 0 1.1')
		.attr('position','0 -150 80');
}

//#########################################################

function createLight() {
	scene.append('directionallight')
		.attr('direction','0 50 150');
		//.attr('shadowIntensity','0.7');
}

//#########################################################

function createSky(radius) {

	var rotationAngle = -(Math.PI/2);

	var rot = scene.append('Transform')
		.attr('rotation','0 1 0 '+rotationAngle);

	var shape = rot.append('shape');
	
	shape.append('appearance')
		.append('ImageTexture')
			.attr('url','"textures/sky.jpg"');
			
	shape.append('sphere')
		.attr('radius',radius.toString())
		.attr('solid','false');
}

//#########################################################

function createFloor(squareSize) {

	var shape = scene.append('shape');
	
	var app = shape.append('appearance');
	
	app.append('material')
		.attr('diffuseColor','1 1 1');
	app.append('ImageTexture')
		.attr('url','"textures/cesped.jpg"');
	
	app.append('TextureTransform')
		.attr('scale','25 25');
		
	shape.append('plane')
		.attr('size',squareSize.toString()+' '+squareSize.toString());
}

//#########################################################

function createSupport(root) {
	
	var tr = root.append('transform');
	tr.attr('translation','0 0 0.5');
	createTexturedBox(tr, '"textures/noria_support_ground.jpg"', '30 1.8 1.8');
	
	var angle = (Math.PI / 8);
	var a1 = angle * 3;	

	var tr1 = root.append('transform');
	tr1.attr('rotation','0 1 0 '+(-a1).toString());
	tr1.attr('translation', '-6 0 10');
	createTexturedBox(tr1, '"textures/noria_support.png"', '20 1 1');
	
	var tr2 = root.append('transform');
	tr2.attr('rotation','0 1 0 '+a1.toString())
	tr2.attr('translation','6 0 10');
	createTexturedBox(tr2, '"textures/noria_support.png"', '20 1 1');
	
	tr3 = root.append('transform');
	tr3.attr('rotation', '0 1 0 '+(-angle).toString());
	tr3.attr('translation', '-1 0 19');
	createTexturedBox(tr3, '"textures/noria_support.png"', '2.7 1 1');
		
	tr4 = root.append('transform');
	tr4.attr('rotation', '0 1 0 '+angle.toString());
	tr4.attr('translation', '1 0 19');
	createTexturedBox(tr4, '"textures/noria_support.png"', '2.7 1 1');
}

//#########################################################

function createAxis(root) {
	
	var shape = root.append('shape');
	shape.append('appearance')
		.append('ImageTexture')
			.attr('url', '"textures/noria_beam.jpg"');
	shape.append('cylinder')
		.attr('height', '14')
		.attr('radius', '0.5')
		.attr('onclick','pickFunction()');
}

//#########################################################

function createWheel(root, radius, parts) {
	var angleStep = (2 * Math.PI) / parts;
	var angle = angleStep;
	
	var side = Math.sqrt((radius*radius)+(radius*radius)-(2*radius*radius*Math.cos(angleStep)));
	
	for(var i = 0; i < parts; i++) {
		
		if(i < (parts / 2)) {
			var trRad = root.append('transform');
			trRad.attr('rotation','0 1 0 '+angle.toString());
			trRad.tran
			createBox(trRad, 'gray', (radius * 2).toString()+' 0.2 0.2');
		}
		
		var x = Math.cos(angle) * radius;
		var y = Math.sin(angle) * radius;
		
		var tr = root.append('transform');
		tr.attr('rotation', '0 1 0 '+(-angle).toString());
		tr.attr('translation', x.toString()+' 0 '+y.toString());
		createTexturedBox(tr, '"textures/noria_beam.jpg"', '1 1 '+side.toString());
			
		var xSphere = Math.cos(angle + (angleStep / 2.0)) * (radius + 0.4);
		var ySphere = Math.sin(angle + (angleStep / 2.0)) * (radius + 0.4);
		
		var trSp = root.append('transform');
		trSp.attr('translation',xSphere.toString()+' 0 '+ySphere.toString());
		
		var shSp = trSp.append('shape');
		shSp.append('appearance')
			.append('material')
				.attr('diffuseColor', 'red');
		shSp.append('sphere')
			.attr('radius','0.7')
			.attr('onclick','pickFunction()');
			
		angle = angle + angleStep;
	}
}

//#########################################################

function createCabins(root, radius, amount) {
	var angleStep = (2 * Math.PI) / amount;
	var angle = 0.0;
	
	for(var i = 0; i < amount; i++) {
		
		var x = (Math.cos(angle) * radius);
		var y = (Math.sin(angle) * radius);
		
		// Support axis
		var supportTr = root.append('transform');
		supportTr.attr('translation', x.toString()+' 0 '+y.toString());
		var supportSh = supportTr.append('shape');
		supportSh.append('appearance')
					.append('material')
						.attr('diffuseColor','1 1 0');
		supportSh.append('cylinder')
					.attr('height','10')
					.attr('radius','0.1')
					.attr('onclick','pickFunction()');

		// Cabin
		var cabinTr = root.append('transform');			
		cabinTr.attr('translation', x.toString()+' 0 '+y.toString());
		var cfix = cabinTr.append('transform');
		cfix.attr('DEF','cabin_fix_'+i.toString());
		createTexturedBox(cfix,'"textures/cabin.jpg"','4 4 3');
		
		angle += angleStep;
	}
}

//#########################################################

function initializeAnimation() {
	
	var timer = scene.append('timesensor');
	timer.attr('id','time_sensor');
	timer.attr('DEF', 'pulse_timer');
	timer.attr('cycleInterval', '30');
	timer.attr('loop', 'true');
	
	// Spin interpolator
	var interpolator = scene.append('orientationInterpolator');
	interpolator.attr('DEF','spin');
	interpolator.attr('key','0 0.25 0.5 0.75 1');
	interpolator.attr('keyValue','0 1 0 0  0 1 0 '+(Math.PI/2).toString()+'  0 1 0 '+Math.PI+'  0 1 0 '+((Math.PI * 3)/2).toString()+'  0 1 0 '+(Math.PI * 2).toString());
	
	// Cabin rotation fix interpolator
	var interpolatorFix = scene.append('orientationInterpolator');
	interpolatorFix.attr('DEF','spin_fix');
	interpolatorFix.attr('key','0 0.25 0.5 0.75 1');
	interpolatorFix.attr('keyValue','0 1 0 0  0 1 0 '+((Math.PI * 3)/2).toString()+' 0 1 0 '+(Math.PI).toString()+'  0 1 0 '+(Math.PI/2).toString()+'  0 1 0 '+((Math.PI * 2).toString()));
	
	var interpolatorTicker = scene.append('route');
	interpolatorTicker.attr('fromNode','pulse_timer');
	interpolatorTicker.attr('fromField','fraction_changed');
	interpolatorTicker.attr('toNode','spin');
	interpolatorTicker.attr('toField','set_fraction');
	
	var interpolatorFixTicker = scene.append('route');
	interpolatorFixTicker.attr('fromNode','pulse_timer');
	interpolatorFixTicker.attr('fromField','fraction_changed');
	interpolatorFixTicker.attr('toNode','spin_fix');
	interpolatorFixTicker.attr('toField','set_fraction');
}

//#########################################################

function pickFunction() {
	var timesensor = d3.select('#time_sensor');
	if(paused) {
		timesensor.attr('pauseTime','0');
		timesensor.attr('resumeTime','1');
		paused = false;
	} else {
		log('Activo');
		timesensor.attr('resumeTime','0');
		timesensor.attr('pauseTime','1');
		paused = true;
	}
}

//#########################################################

function init() {
	// Enviroment
	setUpViewer();
	createLight();
	createSky(400);
	createFloor(800);
	
	//Scale
	var scale = scene.append('transform');
	scale.attr('scale','3 3 3');
	
	// Noria support
	
	var transSupport1 = scale.append('transform');
	transSupport1.attr('translation', '0 6 0');
	createSupport(transSupport1);
	
	var transSupport2 = scale.append('transform');
	transSupport2.attr('translation', '0 -6 0');
	createSupport(transSupport2);
	
	var wheelRadius = 12;
	
	var translation = scale.append('transform');
	translation.attr('translation', '0 0 '+(wheelRadius * 1.6).toString());
	
	// Rotation axis
	var trans = translation.append('transform');
	trans.attr('DEF','animation');
	createAxis(trans);
	
	var trW1 = trans.append('transform');
	trW1.attr('translation','0 -4.7 0');
	createWheel(trW1,wheelRadius,12);
	var trW2 = trans.append('transform');
	trW2.attr('translation','0 4.7 0');
	createWheel(trW2,wheelRadius,12);
	
	var cabinAmount = 12;
	
	createCabins(trans, wheelRadius, cabinAmount);
	
	initializeAnimation();
	
	scene.append('route')
		.attr('fromNode','spin')
		.attr('fromField','value_changed')
		.attr('toNode','animation')
		.attr('toField','set_rotation');
	
	for(var i = 0; i < cabinAmount; i++) {
		scene.append('route')
			.attr('fromNode','spin_fix')
			.attr('fromField','value_changed')
			.attr('toNode','cabin_fix_'+i.toString())
			.attr('toField','set_rotation');
	}
}

//#########################################################

init();