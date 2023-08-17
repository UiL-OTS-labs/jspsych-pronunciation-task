let jsPsych = initJsPsych({
    exclusions: {
        min_width : MIN_WIDTH,
        min_height : MIN_HEIGHT
    }
});

 // I liked RandomError too :-)
class SprRandomizationError extends Error {
    constructor(message) {
        super(message);
        this.name = SprRandomizationError;
    }
}

const KEY_CODE_SPACE = ' ';
const G_QUESTION_CHOICES = [FALSE_BUTTON_TEXT, TRUE_BUTTON_TEXT];

let welcome_screen = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : WELCOME_INSTRUCTION,
    choices : [KEY_CODE_SPACE],
    response_ends_trial : true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

let instruction_screen_practice = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : PRE_PRACTICE_INSTRUCTION,
    choices : [KEY_CODE_SPACE],
    response_ends_trial : true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

let microphone_instructions = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : `<p>在接下來的視窗，我們將請你選擇同意啟用麥克風以便在實驗中錄製你的回答</p>
    <p>按空白鍵繼續</p>`,
    choices : [KEY_CODE_SPACE],
    response_ends_trial : true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

let initialize_microphone = {
    type: jsPsychInitializeMicrophone,
    device_select_message: "<p>請選擇麥克風</p>",
    button_label: '選擇'
};

let fixcross = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: '<span style="font-size:40px;">+</span>',
    choices: "NO_KEYS",
    trial_duration: FIX_DUR,
    on_finish: function(data) {
        if (typeof data.rt == "number") {
            data.rt = Math.round(data.rt);
        }
    }
};

let mic_check = {
    type: TestRecording,
    stimulus: '請測試錄音',
    recording_duration: 5000,
    stimulus_duration: 5000,
    allow_playback: true,
    show_done_button: false,
    playback_instructions: '<p>請聽你的錄音，確認是否聽得清楚</p>',
    accept_button_label: '我聽得很清楚',
    record_again_button_label: '重試',
};

let record_item = {
    type: AudioResponseWithTimer,
    stimulus: () => '<span style="font-size:3em">' + jsPsych.timelineVariable('stimulus', true) + '</span>',
    recording_duration: 3000,
    stimulus_duration: 3000,
    allow_playback: false,
    show_done_button: false,
    on_finish: (data) => {
	data.condition = jsPsych.timelineVariable('item_type')
    }
};

let end_practice_screen = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : PRE_TEST_INSTRUCTION,
    choices : [KEY_CODE_SPACE],
    response_ends_trial : true,
    on_finish: function (data) {
        data.rt = Math.round(data.rt);
    }
};

let end_experiment = {
    type : jsPsychHtmlKeyboardResponse,
    stimulus : POST_TEST_INSTRUCTION,
    choices : [],
    on_load: function() {
        if (true || consent_given) {
            uil.saveData();
        }
        else {
            document.body.innerHTML = FINISHED_NO_CONSENT;
        }
    }
}

/**
 * Randomize a table of stimuli
 */
function randomizeStimuli(table) {
    let shuffled = uil.randomization.randomizeStimuli(
        table,
        max_same_type=MAX_SUCCEEDING_ITEMS_OF_TYPE
    );

    if (shuffled !== null)
        table = shuffled;
    else {
            console.error('Unable to shuffle stimuli according constraints.');
            let msg = "Unable to shuffle the stimuli, perhaps loosen the " +
                      "constraints, or check the item_types on the stimuli.";
            throw new SprRandomizationError(msg);
    }

    return table; // shuffled table if possible original otherwise
}

/**
 * Get the timeline for a table of stimuli
 */
function getTimeline(table) {
    //////////////// timeline /////////////////////////////////
    let timeline = [];

    // Welcome the participant and guide them through the
    // consent forms and survey.
    timeline.push(welcome_screen);

    // Obtain informed consent.
    timeline.push(consent_procedure);

    // add survey
    timeline.push(survey_procedure);

    timeline.push(microphone_instructions);
    timeline.push(initialize_microphone);
    timeline.push(mic_check);

    timeline.push(instruction_screen_practice);

    let practice = {
        timeline: [
            fixcross,
	    record_item,
        ],
        timeline_variables: PRACTICE_ITEMS
    };

    timeline.push(practice);
    timeline.push(end_practice_screen);

    if (PSEUDO_RANDOMIZE) {
        table = randomizeStimuli(table);
    }

    let test = {
        timeline: [
            fixcross,
	    record_item,
        ],
        timeline_variables: table
    }

    timeline.push(test);
    timeline.push(end_experiment);
    return timeline;
}


function main() {
    // Make sure you have updated your key in globals.js
    uil.setAccessKey(ACCESS_KEY);
    uil.stopIfExperimentClosed();

    // Option 1: client side randomization:
    let stimuli = pickRandomList();
    kickOffExperiment(getTimeline(stimuli.table), stimuli.list_name);

    // Option 2: server side balancing:
    // Make sure you have matched your groups on the dataserver with the
    // lists in stimuli.js..
    // This experiment uses groups/lists list1, and list2 by default (see
    // stimuli.js).
    // Hence, unless you change lists here, you should created matching
    // groups there.
    // uil.session.start(ACCESS_KEY, (group_name) => {
    //     let stimuli = findList(group_name);
    //     kickOffExperiment(getTimeline(stimuli));
    // });
}



// this function will eventually run the jsPsych timeline
function kickOffExperiment(timeline, list_name) {

    let subject_id = uil.session.isActive() ?
        uil.session.subjectId() : jsPsych.randomization.randomID(8);

    // data one would like to add to __all__ trials, according to:
    // https://www.jspsych.org/overview/data/
    jsPsych.data.addProperties (
        {
            subject : subject_id,
            list : list_name,
        }
    );

    // Start jsPsych when running on a Desktop or Laptop style pc.
    uil.browser.rejectMobileOrTablet();
    jsPsych.run(timeline);
}

/**
 * This function will pick a random list from the TEST_ITEMS array.
 *
 * Returns an object with a list and a table, the list will always indicate
 * which list has been chosen for the participant.
 *
 * @returns {object} object with list_name and table fields
 */
function pickRandomList() {
    let range = function (n) {
        let empty_array = [];
        let i;
        for (i = 0; i < n; i++) {
            empty_array.push(i);
        }
        return empty_array;
    }
    let num_lists = TEST_ITEMS.length;
    var shuffled_range = jsPsych.randomization.repeat(range(num_lists), 1)
    var retlist = TEST_ITEMS[shuffled_range[0]];
    return retlist
}

function findList(name) {
    let list = TEST_ITEMS.find((entry) => entry.list_name === name);
    if (!list) {
        let found = TEST_ITEMS.map((entry) => `"${entry.list_name}"`).join(', ');
        console.error(
            `List not found "${name}".\n` +
                'This name was configured on the UiL datastore server.\n' +
                `The following lists exist in stimuli.js: \n${found}`)
    }
    return list;
}
