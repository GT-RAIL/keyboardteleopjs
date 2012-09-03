var KeyboardTeleop = function(options) {
	var keyboardTeleop = this;
	options = options || {};
	keyboardTeleop.ros = options.ros;
	keyboardTeleop.topic = options.topic || '/cmd_vel';
	keyboardTeleop.throttle = options.throttle || 1;
	keyboardTeleop.slider = options.slider;

	// linear x and y movement and angular z movement
	var x = 0;
	var y = 0;
	var z = 0;

	var cmdVel = new keyboardTeleop.ros.Topic({
		name : keyboardTeleop.topic,
		messageType : 'geometry_msgs/Twist'
	});

	/*
	 * Sets up a key listener on the page used for keyboard teleoperation.
	 */
	function handleKey(keyCode, keyDown) {
		var scale = 0;
		// throttle the speed by the slider and throttle constant
		if (keyDown == true) {
			if (keyboardTeleop.slider) {
				scale = $('#' + keyboardTeleop.slider).slider('value') / 100;
			} else {
				scale = 1;
			}
			scale *= keyboardTeleop.throttle;
		}
		// check which key was pressed
		switch (keyCode) {
		case 65:
			// turn left
			z = 1 * scale;
			break;
		case 87:
			// up
			x = .5 * scale;

			break;
		case 68:
			// turn right
			z = -1 * scale;
			break;
		case 83:
			// down
			x = -.5 * scale;
			break;
		case 69:
			// strafe right
			y = -.5 * scale;
			break;
		case 81:
			// strafe left
			y = .5 * scale;
			break;
		}

		// publish the command
		var twist = new keyboardTeleop.ros.Message({
			angular : {
				x : 0,
				y : 0,
				z : z
			},
			linear : {
				x : x,
				y : y,
				z : z
			}
		});
		cmdVel.publish(twist);
	}

	// handle the key
	$('body').keydown(function(e) {
		handleKey(e.keyCode, true);
	});

	// sets the speed to 0 on keyup
	$('body').keyup(function(e) {
		handleKey(e.keyCode, false);
	});
};