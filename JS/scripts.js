// Initialize vars
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


// Set initial main background image 
var intial_background_image_css = "linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.75)), url(Assets/Images/Main/Backgrounds/" + bg_image_list[Math.floor(Math.random() * bg_image_list.length)] + ")"
$("#feature").css("background-image", intial_background_image_css);

// Initialize blinds timeout
var blinds_timeout = window.setTimeout(function() {
	$("#blinds").removeClass("closed");
}, 500);


// Main function
$(function(){
	// Initialize hint
	if (isMobile()) {$("#hint").html("<span>Press and hold logo to activate player.</span>");}

	// Shuffle library and initialize track
	shuffleArray(track_list);
	$(track).attr("src", tracks_path + track_list[0]);
	track_display_duration = secondsToDisplayTime(track.duration);

	// Toggle text elements
	$("[data-toggle-text]").on("click", function() {
		[$(this)[0].innerHTML, $(this)[0].dataset.toggleText] = [$(this)[0].dataset.toggleText, $(this)[0].innerHTML];
	});

	// Show/hide scroll indicator 
	$("#feature_content").on("scroll", function() {
		if (($(this)[0].scrollHeight - $(this).scrollTop()) - $(this).outerHeight() < 20) {
			$("#content_scroll_indicator").addClass("hidden");
		} else {
			$("#content_scroll_indicator").removeClass("hidden");;
		}
	});
	
	// Activate music player...
	$("#hero_logo").on("long-press", function() { // ...by logo
		if (!$("#feature").hasClass("player-activated")) { 
			$("#feature").addClass("player-activated");
			togglePlayer();
		}
	});
	$(document).keypress(function(event) { // ...by keycode
		if (!$("#feature").hasClass("player-activated")) {
			cheatcode_cache += 96 < event.which && event.which < 123 ? event.key : "";
			for (let i = 0; i < cheatcode_cache.length; i++) { if (cheatcode_cache[i] != cheatcode[i]) { cheatcode_cache = ""; } }
			$("#cheatcode").attr("data-before", cheatcode_cache);
			$("#cheatcode").attr("data-after", cheatcode.slice(cheatcode_cache.length, cheatcode.length));
			if (cheatcode_cache == "isakov") {
				$("#feature").addClass("player-activated");
				togglePlayer();
			}
		}
	});

	// When track...
	$(track).bind("playing", function() { // ...begun to play
		$("#play_pause img").attr("src", "Assets/Images/Main/Icons/pause.svg");
		$("#feature").removeClass("player-paused").addClass("player-playing");
	});
	$(track).bind("pause", function() { // ...is paused
		$("#play_pause img").attr("src", "Assets/Images/Main/Icons/play.svg");
		$("#feature").removeClass("player-playing").addClass("player-paused");
	});
	$(track).bind("durationchange", function() { // ...changes duration (when track changes, really)
		track_display_duration = secondsToDisplayTime(track.duration);
	});
	$(track).bind("timeupdate", function() { // ...continues to play
		track_display_progress = secondsToDisplayTime(track.currentTime);
		$("#track_progress").text(track_display_progress + " / " + track_display_duration);
	})
	$(track).bind("ended", function() { // ...ends
		track_index >= track_list.length ? track_index = 1 : track_index++;
		switchTrack(track_index);
	});

	// Player controls
	$("#play_pause").on("click", function() {togglePlayPause();}); // Play/pause
	$("#prev_track, #next_track").on("click", function() {
		if (this.id == "next_track") {track_index >= track_list.length ? track_index = 1 : track_index++;} // Next track
		else { track_index <= 1 ? track_index = track_list.length : track_index--;} // Previous track
		switchTrack(track_index);
	});

	// Keyboard input player controls
	$(document).keydown(function(event){
		if ($("#feature").hasClass("player-active")) {
			var keycode = (event.keyCode ? event.keyCode : event.which); // Get keycode
			if (keycode == '32') { // Spacebar
				togglePlayPause(); // Play/pause
				replayAnimation("#play_pause_keyboard_shortcut_hint", "key-flash 0.3s ease");
			} else if (keycode == '37' || keycode == '39') {
				if (keycode == '37') { // Left arrow
					track_index <= 1 ? track_index = track_list.length : track_index--; // Previous track
					replayAnimation("#prev_track_keyboard_shortcut_hint", "key-flash 0.3s ease");
				} else { // Right arrow
					track_index >= track_list.length ? track_index = 1 : track_index++; // Next track
					replayAnimation("#next_track_keyboard_shortcut_hint", "key-flash 0.3s ease");
				}
				switchTrack(track_index);
			}
		}
	});
}); 


// Detect mobile device 
function isMobile() { 
	return ('ontouchstart' in document.documentElement); 
}

// Change Background Image
function changeBackgroundImage(new_background_image_css) {
	if ($("#feature").css("background-image") != new_background_image_css) {
		$("#blinds").addClass("closed");
		window.clearTimeout(blinds_timeout);
		blinds_timeout = window.setTimeout(function() {
			$("#feature").css("background-image", new_background_image_css);
			$("#blinds").removeClass("closed");
		}, 500);
	}
}

// Replay animation
function replayAnimation(element, animation) {
	$(element).css("animation", animation).on("animationend webkitAnimationEnd", function() {
		$(this).css("animation", "none");
	});
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
	new_background_image_css = "linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url('Assets/Images/Covers/" + track_info[0] + ".gif')"
	changeBackgroundImage(new_background_image_css);

	// Set page title
	document.title = track_info[0] + " · " + track_info[1];
}

// Toggle content mode 
function toggleContentMode() {
	$('#feature').toggleClass('content-mode');
	$('#feature').hasClass('content-mode') ? $("#hero_logo").hide("slow") : $("#hero_logo").show();
}

// Toggle player
function togglePlayer() {
	if ($("#feature").hasClass("player-active")) {
		changeBackgroundImage(intial_background_image_css);
		track.pause();
	} else {
		getTrackInfo();
		track.play();
	}
	$("#feature").toggleClass("player-active");
}

// Toggle play/pause
function togglePlayPause() {track.paused ? track.play() : track.pause();}

// Switch tracks
function switchTrack(track_index) {
	$("#play_pause").attr("src", "Assets/Images/Main/Icons/loading.svg");
	$(track).attr("src", tracks_path + track_list[track_index - 1]);
	getTrackInfo();
	track.pause(); 
	track.load(); 
	track.play();
}