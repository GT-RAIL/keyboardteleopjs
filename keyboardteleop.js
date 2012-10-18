/**
 * Author: Russell Toris
 * Version: October 18, 2012
 */

var KeyboardTeleop = function(options) {
  var keyboardTeleop = this;
  options = options || {};
  keyboardTeleop.ros = options.ros;
  keyboardTeleop.topic = options.topic || '/cmd_vel';
  // permanent throttle
  keyboardTeleop.throttle = options.throttle || 1.0;
  // used to externally throttle the speed (e.g., from a slider)
  keyboardTeleop.scale = options.scale || 1.0;

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
    // used to check for changes in speed
    var _x = x;
    var _y = y;
    var _z = z;

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

    // check for changes
    if (_x !== x || _y !== y || _z !== z) {
      keyboardTeleop.emit('change', twist);
    }
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
KeyboardTeleop.prototype.__proto__ = EventEmitter2.prototype;