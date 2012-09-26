/*********************************************************************
 *
 * Software License Agreement (BSD License)
 *
 *  Copyright (c) 2012, Worcester Polytechnic Institute
 *  All rights reserved.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions
 *  are met:
 *
 *   * Redistributions of source code must retain the above copyright
 *     notice, this list of conditions and the following disclaimer.
 *   * Redistributions in binary form must reproduce the above
 *     copyright notice, this list of conditions and the following
 *     disclaimer in the documentation and/or other materials provided
 *     with the distribution.
 *   * Neither the name of the Worcester Polytechnic Institute nor the 
 *     names of its contributors may be used to endorse or promote 
 *     products derived from this software without specific prior 
 *     written permission.
 *
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 *  "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 *  LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
 *  FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 *  COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
 *  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
 *  BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 *  CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
 *  LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
 *  ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 *  POSSIBILITY OF SUCH DAMAGE.
 *
 *   Author: Russell Toris
 *  Version: September 26, 2012
 *
 *********************************************************************/

var KeyboardTeleop = function(options) {
	var keyboardTeleop = this;
	options = options || {};
	keyboardTeleop.ros = options.ros;
	keyboardTeleop.topic = options.topic || '/cmd_vel';
	// permanent throttle
	keyboardTeleop.throttle = options.throttle || 1;
	keyboardTeleop.slider = options.slider;
	// used to externally throttle the speed (e.g., from a slider)
	keyboardTeleop.scale = options.scale || 1;

	// linear x and y movement and angular z movement
	var x = 0;
	var y = 0;
	var z = 0;

	var cmdVel = new keyboardTeleop.ros.Topic({
		name : keyboardTeleop.topic,
		messageType : 'geometry_msgs/Twist'
	});

	// sets up a key listener on the page used for keyboard teleoperation
	var handleKey = function(keyCode, keyDown) {
		var speed = 0;
		// throttle the speed by the slider and throttle constant
		if (keyDown == true) {
			speed = keyboardTeleop.throttle * keyboardTeleop.scale;
		}
		// check which key was pressed
		switch (keyCode) {
		case 65:
			// turn left
			z = 1 * speed;
			break;
		case 87:
			// up
			x = .5 * speed;

			break;
		case 68:
			// turn right
			z = -1 * speed;
			break;
		case 83:
			// down
			x = -.5 * speed;
			break;
		case 69:
			// strafe right
			y = -.5 * speed;
			break;
		case 81:
			// strafe left
			y = .5 * speed;
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
	};

	// handle the key
	var body = document.getElementsByTagName('body')[0];
	body.addEventListener('keydown', function(e) {
		handleKey(e.keyCode, true);
	}, false);
	body.addEventListener('keyup', function(e) {
		handleKey(e.keyCode, false);
	}, false);
};