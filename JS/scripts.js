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
	$("#blinds").removeClass("closed");
}, 500);

$(function(){
	// Set hint text
	if (isMobile()) {
		$("#hint").html("<span>Press and hold logo to activate player.</span>");
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

	// Show/hide content
	$("#content_button").on("click", function() {
		if ($(this).text() == "View Content") {
			$(this).text("Hide Content");
			$("#feature").addClass("content-mode"); 
			$("#hero_logo").hide("slow");
		} else {
			$(this).text("View Content");
			$("#feature").removeClass("content-mode"); 
			$("#hero_logo").show();
		}
	});
	
	// Activate music player by logo
	$("#hero_logo").on("longpress", function() {activatePlayer();});

	// Activate music player by keycode
	$(document).keypress(function(event) {
		cheatcode_cache += 96 < event.which && event.which < 123 ? event.key : "";
		for (let i = 0; i < cheatcode_cache.length; i++) { if (cheatcode_cache[i] != cheatcode[i]) { cheatcode_cache = ""; } }
		$("#cheatcode").attr("data-before", cheatcode_cache);
		$("#cheatcode").attr("data-after", cheatcode.slice(cheatcode_cache.length, cheatcode.length));
		if (cheatcode_cache == "isakov") { 
			$("#feature").addClass("key-activated");
			activatePlayer(); 
		}
	});

	// When track...
	$(track).bind("playing", function(){ // begun to play
		$("#play_pause").attr("src", "Assets/Images/Main/pause.svg");
		$("#feature").removeClass("player-paused").addClass("player-playing");
	});
	$(track).bind("pause", function(){ // is paused
		$("#play_pause").attr("src", "Assets/Images/Main/play.svg");
		$("#feature").removeClass("player-playing").addClass("player-paused");
	});
	$(track).bind("durationchange", function(){ // changes duration (when track changes, really)
		track_display_duration = secondsToDisplayTime(track.duration);
	});

	// Play/pause track
	$("#play_pause").on("click", function() {
		togglePlayPause();
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
				togglePlayPause();// Play/pause
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
		$("#feature").addClass("player-active");
		getTrackInfo();
		track.play();
	}
}

// Toggle play/pause
function togglePlayPause() {
	$("#feature").hasClass("player-paused") ? track.play() : track.pause();
}

// Switch tracks
function switchTrack(track_index) {
	$("#play_pause").attr("src", "Assets/Images/Main/loading.svg");
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
	document.title = track_info[0] + " · " + track_info[1];
}

// Change Background Image
function changeBackgroundImage(filename) {
	if (filename != current_background_image) {
		$("#blinds").addClass("closed");
		window.clearTimeout(blinds_timeout);
		blinds_timeout = window.setTimeout(function() {
			$("#feature").css("background-image", 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url("Assets/Images/Covers/' + filename + '.gif")');
			$("#blinds").removeClass("closed");
		}, 500);
	}
}

// Detect mobile device 
function isMobile() { 
	return ('ontouchstart' in document.documentElement); 
}