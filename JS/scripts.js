// Initialize vars
var player_activated = false;

var tracks_path = "Assets/Music/";

var track_index = 1;
var track_info = [];

var track_display_duration = "";
var track_display_progress = "";

var new_background_image = "";
var current_background_image = "background";

var track = document.getElementById("track");

var cheatcode = "isakov";
var cheatcode_cache = "";

// Initialize blinds timeout
var blinds_timeout = window.setTimeout(function() {
	$("#main").css("background-image", 'linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url("../Assets/Images/' + filename + '.gif")');
	$("#blinds").removeClass("closed");
}, 500);

$(function(){
	// Set hint text
	if (isMobile()) {
		$("#hint").html("Press and hold logo to enter.");
	} else {
		$("#cheatcode").attr("data-after", "Isakov");
	}

	// Show hint
	$("#hint").removeClass("hidden");

	// Shuffle library
	shuffleArray(track_list);

	// Initialize track
	$(track).attr("src", tracks_path + track_list[0]);

	// Initialize track durations
	track_display_duration = secondsToDisplayTime(track.duration);
	
	// Activate music player by logo
	$("#logo").on("longpress", function() {activatePlayer();});

	// Activate music player by keycode
	$(document).keypress(function(event) {
		cheatcode_cache += 96 < event.which && event.which < 123 ? event.key : "";
		for (let i = 0; i < cheatcode_cache.length; i++) { if (cheatcode_cache[i] != cheatcode[i]) { cheatcode_cache = ""; } }
		$("#cheatcode").attr("data-before", cheatcode_cache);
		$("#cheatcode").attr("data-after", cheatcode.slice(cheatcode_cache.length, cheatcode.length));
		if (cheatcode_cache == "isakov") { 
			$("#main_content").addClass("key-activated");
			activatePlayer(); 
		}
	});

	// When track...
	$(track).bind("playing", function(){ // begun to play
		$("#play_pause").removeClass().addClass("fas fa-pause");
		$("#dimmer").removeClass("active");
	});
	$(track).bind("pause", function(){ // is paused
		$("#play_pause").removeClass().addClass("fas fa-play");
		$("#dimmer").addClass("active");
	});
	$(track).bind("durationchange", function(){ // changes duration (when track changes, really)
		track_display_duration = secondsToDisplayTime(track.duration);
	});

	// Play/pause track
	$("#play_pause").on("click", function() {
		$(this).hasClass("fa-play") ? track.play() : track.pause();
	});
	
	// Navigate library
	$("#prev_track, #next_track").on("click", function() {
		this.id == "next_track" ? track_index >= track_count ? track_index = 1 : track_index++ : track_index <= 1 ? track_index = track_count : track_index--;
		switchTrack(track_index);
		getTrackInfo();
	});

	// Keyboard input
	$(document).keydown(function(event){
		if (player_activated) {
			var keycode = (event.keyCode ? event.keyCode : event.which); // Get keycode
			if (keycode == '32') { // Spacebar
				$("#play_pause").hasClass("fa-play") ? track.play() : track.pause(); // Play/pause
			} else if (keycode == '37' || keycode == '39') { // Left or right arrow
				if (keycode == '37'){track_index <= 1 ? track_index = track_count : track_index--;} // Previous track
				else {track_index >= track_count ? track_index = 1 : track_index++;} // Next track
				switchTrack(track_index);
				getTrackInfo();
			}
		}
	});
	
	// Update progress and name display
	$(track).bind("timeupdate", function(){
		track_display_progress = secondsToDisplayTime(track.currentTime);
		$("#track_progress").text(track_display_progress + " / " + track_display_duration);
	})

	// Autoplay
	$(track).bind("ended", function(){
		track_index >= track_count ? track_index = 1 : track_index++;
		switchTrack(track_index);
		getTrackInfo();
	});
}); 

// Activate player
function activatePlayer() {
	if (!player_activated) {
		player_activated = true;
		$("#track_info, #player").removeClass("hidden");
		$("#main_content").addClass("player-active");
		$("#hint").addClass("hidden");
		getTrackInfo();
		track.play();
	}
}

// Switch tracks
function switchTrack(track_index) {
	$("#play_pause").removeClass().addClass("fas fa-spinner fa-pulse");
	$(track).attr("src", tracks_path + track_list[track_index - 1]);
	track.pause(); track.load(); track.play();
}

// Convert seconds to readable string
function secondsToDisplayTime(seconds) {
	return String(parseInt(Math.round(seconds) / 60)) + ":" + String(Math.round(seconds) % 60).padStart(2, '0');
}

// Shuffle Array
function shuffleArray(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
	}
}

// Get track info
function getTrackInfo() {
	// Set track info display text
	track_info = track_list[track_index - 1].replace(".mp3", "").split(" - ");
	$("#track_artist").text(track_info[0]);
	$("#track_title").text(track_info[1]);

	// Change background gif if possible
	new_background_image = $.inArray(track_info[0] + ".gif", image_list) != -1 ? track_info[0] : "background";
	changeBackgroundImage(new_background_image);
	current_background_image = new_background_image;

	// Set page title
	document.title = track_info[0] + " - " + track_info[1] + " | Aarush Kumbhakern";
}

// Change Background Image
function changeBackgroundImage(filename) {
	if (filename != current_background_image) {
		$("#blinds").addClass("closed");
		window.clearTimeout(blinds_timeout);
		blinds_timeout = window.setTimeout(function() {
			$("#main").css("background-image", 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url("../Assets/Images/' + filename + '.gif")');
			$("#blinds").removeClass("closed");
		}, 500);
	}
}

// Detect mobile device 
function isMobile() { 
	return ('ontouchstart' in document.documentElement); 
}