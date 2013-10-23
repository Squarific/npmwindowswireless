module.exports = new function () {
	var exec = require('child_process').exec;
	this.wirelessList = function (cb) {
		exec("netsh wlan show networks MODE=BSSID", function (error, stdout, stderr) {
			if (error || stderr) {
				throw "ERROR: error: <" + error + "> AND stderr: <" + stderr + ">";
			}
			if (!stdout) {
				console.log("Debug: Missing stdout");
			}
			var lines = stdout.split(/\r\n|\r|\n/);
			var networks = [];
			for (var k = 0; k < lines.length; k++) {
				if (lines[k].indexOf("SSID") === 0) {
					networks.push({name: lines[k].split(" : ")[1]});
				} else {
					var signal = lines[k].indexOf("%");
					if (signal !== -1) {
						signal = parseInt(lines[k].substr(signal - 3, 3));
						if (networks.length > 0) {
							networks[networks.length - 1].signal = signal;
						} else {
							throw "Signal detected but no network ssid provided.";
						}
					}
				}
			}
			cb(networks);
		});
	};
};