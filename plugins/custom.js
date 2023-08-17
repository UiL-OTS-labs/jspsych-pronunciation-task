// Custom trial types that override some functionality of the standard jsPsych plugins


class AudioResponseWithTimer extends jsPsychHtmlAudioResponse {
    showDisplay(display_element, trial) {
	super.showDisplay(display_element, trial);

	this.countdownView = document.createElement('span');
	display_element.append(this.countdownView);
    }

    setupRecordingEvents(display_element, trial) {
	super.setupRecordingEvents(display_element, trial);

	let interval;

	let updateCountdown = function() {
	    if (!this.recorder_start_time) {
		// recording hasn't started yet
		return;
	    }

	    let diff = (performance.now() - this.recorder_start_time);
	    if (diff > 0) {
		this.countdownView.innerText = ((trial.recording_duration - diff) / 1000).toFixed(1);
	    }
	    else {
		clearInterval(interval);
	    }
	}

	this.recorder.addEventListener("start", () => {
	    interval = setInterval(updateCountdown.bind(this), 100);
	});

	this.recorder.removeEventListener('stop', this.stop_event_handler);
	this.recorder.addEventListener('stop', () => {
	    const data = new Blob(this.recorded_data_chunks, { type: this.recorded_data_chunks[0].type });
	    this.audio_url = URL.createObjectURL(data);
	    const reader = new FileReader();
	    reader.addEventListener("load", () => {
		const base64 = reader.result.split(",")[1];
		this.response = base64;
		this.load_resolver();
	    });
	    reader.readAsDataURL(data);
	});
    }
}


class TestRecording extends AudioResponseWithTimer {
    showPlaybackControls(display_element, trial) {
	super.showPlaybackControls(display_element, trial);
	display_element.insertAdjacentHTML('afterbegin', trial.playback_instructions);
    }
}
