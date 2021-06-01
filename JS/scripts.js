// Initialize vars
var tracks_path = "Assets/Music/";

var track_index = 1;
var track_info = [];

var track_display_duration = "";
var track_display_progress = "";

var new_background_image = "";
var current_background_image = "background";

var track = document.getElementById("track");

// Set press duration
$.Finger = {
	pressDuration: 2000,
};

$(function(){
	// Shuffle library
	shuffleArray(track_list);

	// Initialize track
	$(track).attr("src", tracks_path + track_list[0]);

    // Initialize track durations
    track_display_duration = secondsToDisplayTime(track.duration);
    
    // Activate music player
	$("#logo").on("press", function() {
		$("#track_info").css("opacity", "1");
		$("#main_content").css("opacity", "0.7");
        $("#main_content").css("transform", "scale(0.7)");
		$("#player").css("transform", "translate(-50%, 0)");
        track.play();
	});

    // When track...
	$(track).bind("playing", function(){ // begun to play
		$("#play_pause").removeClass().addClass("fas fa-pause");
		track_info = track_list[track_index - 1].replace(".mp3", "").split(" - ");
		$("#track_artist").text(track_info[0]);
		$("#track_title").text(track_info[1]);

		// Change background gif if possible
		new_background_image = $.inArray(track_info[0] + ".gif", image_list) != -1 ? track_info[0] : "background";
		changeBackgroundImage(new_background_image);
		current_background_image = new_background_image;
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
	
    // Update progress and name display
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

// Change Background Image
function changeBackgroundImage(filename) {
	if (filename != current_background_image) {
		$("#blinds").css("opacity", "1").on('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd', function() {
			$("#main").css("background-image", 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.85)), url("../Assets/Images/' + filename + '.gif")');
			$(this).css("opacity", "0");
		});
	}
}