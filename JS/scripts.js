// Initialize vars
var track_index = 1;
var track_display_duration = "";
var track_display_progress = "";
var tracks_path = "Assets/Music/";
var track = document.getElementById("track");

// Set press duration
$.Finger = {
	pressDuration: 3000,
};

$(function(){
    // Initialize track durations
    track_display_duration = secondsToDisplayTime(track.duration);
    
    // Activate music player
	$("#logo").on("press", function() {
		$("#main_content").css("opacity", "0.7");
        $("#main_content").css("transform", "scale(0.7)");
		$("#player").css("transform", "translate(-50%, 0)");
        track.play();
	});

    // When track...
	$(track).bind("playing", function(){ // is playing
		$("#play_pause").removeClass().addClass("fas fa-pause");
	});
	$(track).bind("pause", function(){ // is paused
		$("#play_pause").removeClass().addClass("fas fa-play");
	});
    $(track).bind("durationchange", function(){ // changes duration (when track changes, really)
		track_display_duration = secondsToDisplayTime(track.duration);
	});

    // Play/pause track
	$("#play_pause").on("tap", function() {
		$(this).hasClass("fa-play") ? track.play() : track.pause();
	});
	
    // Navigate library
	$("#prev_track, #next_track").on("tap", function() {
		this.id == "next_track" ? track_index >= track_count ? track_index = 1 : track_index++ : track_index <= 1 ? track_index = track_count : track_index--;;
		switchTrack(track_index);
	});
	
    // Update progress display
	$(track).bind("timeupdate", function(){
        track_display_progress = secondsToDisplayTime(track.currentTime);
        $("#track_progress").text(track_display_progress + " / " + track_display_duration);
	})

    // Autoplay
	$(track).bind("ended", function(){
		track_index >= track_count ? track_index = 1 : track_index++;
		switchTrack(track_index);
	});
}); 

// Switch tracks
function switchTrack(track_index) {
    $("#play_pause").removeClass().addClass("fas fa-spinner fa-pulse");
    $(track).attr("src", tracks_path + track_index + ".mp3");
	track.pause(); track.load(); track.play();
}

// Convert seconds to readable string
function secondsToDisplayTime(seconds) {
    return String(parseInt(Math.round(seconds) / 60)) + ":" + String(Math.round(seconds) % 60).padStart(2, '0');
}