
// global repeat boolean
// If the survey is filled out incorrectly the questionaire
// is repeated.
let repeat_survey = false;

// 1th survey question

const AGE_PROMPT = "<p>請填寫以下資料</p>";
const AGE_HTML = `
    <label for="birth_year">出生年份</label>
    <input type="number" id="birth_year"
        name="birth_year" placeholder=1999 min=1919 max=2019 required>
    <span class="validity"></span>

    <br>
    <br>

    <label for="birth_month">出生月份</label>
    <input type="number" id="birth_month" name="birth_month"
        placeholder=7 min=1 max=12 required>
    <span class="validity"></span>

    <br>
    <br>

    <label for="native_language">母語</label>
    <input type="text" id="native_language" name="native_language" placeholder="中文" required>
    <span class="validity"></span>
    <br>
    <br>
    `;

const survey_1 = {
    type :      jsPsychSurveyHtmlForm,
    data: {
        uil_save : true,
        survey_data_flag: true
    },
    preamble :  AGE_PROMPT,
    html :      AGE_HTML,
    button_label : CONTINUE_BUTTON_TEXT,

    on_finish : function(data) {
        data.rt = Math.round(data.rt);
    }
};


// 2nd survey question

const BILINGUAL_QUESTION = `
    <a href="https://zh.wikipedia.org/wiki/多语制" target="_blank">多語(日常生活頻繁使用一種以上語言)</a>
    
    `;

const BILINGUAL_OPTIONS = ["否","是"];

const DYSLEXIC_QUESTION = `
    <a href="https://zh.wikipedia.org/wiki/失讀症" target="_blank">閱讀障礙</a>
    `;
const DYSLEXIC_OPTIONS = ["否", "是"];

const SEX_QUESTION = `
    <a href="https://zh.wikipedia.org/zh-hant/性别" target="_blank">生理性別</a>
    `;
const SEX_OPTIONS = ["女", "男", "其他", "不方便透露"];

const HAND_QUESTION = '慣用手';
const HAND_OPTIONS = ["左", "右"];

const survey_2 = {
    type: jsPsychSurveyMultiChoice,
    button_label: CONTINUE_BUTTON_TEXT,
    data: {
        uil_save : true,
        survey_data_flag : true
    },
    questions: [
        {
            prompt : BILINGUAL_QUESTION,
            name : 'Multilingual',
            options : BILINGUAL_OPTIONS,
            required :true,
            horizontal : true
        },
        {
            prompt : DYSLEXIC_QUESTION,
            name : 'Dyslexic',
            options : DYSLEXIC_OPTIONS,
            required : true,
            horizontal : true
        },
        {
            prompt : SEX_QUESTION,
            name : 'Sex',
            options : SEX_OPTIONS,
            required : true,
            horizontal : true
        },
        {
            prompt : HAND_QUESTION,
            name : 'HandPreference',
            options : HAND_OPTIONS,
            required : true,
            horizontal : true
        }
    ],

    on_finish: function(data){
        data.rt = Math.round(data.rt);
    }
};

let survey_review = {
    type: jsPsychHtmlButtonResponse,
    stimulus: function(data){

        let survey_1 =
            jsPsych.data.get().last(2).values()[0].response;

        let survey_2 =
            jsPsych.data.get().last(1).values()[0].response;

        let b_year = survey_1.birth_year;
        let b_month = survey_1.birth_month;
        let n_lang = survey_1.native_language;

        let bilingual = survey_2.Multilingual;
        let dyslexic = survey_2.Dyslexic;
        let sex = survey_2.Sex;
        let hand_pref = survey_2.HandPreference;

        return `
            <h1>你的回答</h1>

            <div><strong>出生年份</strong>: ${b_year} </div>
            <div><strong>出生月份</strong>: ${b_month} </div>
            <div><strong>母語</strong>: ${n_lang} </div>
            <div><strong>多語</strong>: ${bilingual} </div>
            <div><strong>閱讀障礙</strong>: ${dyslexic} </div>
            <div><strong>性別</strong>: ${sex} </div>
            <div><strong>慣用手</strong>: ${hand_pref} </div>

            <br><br>
            <p>以上資訊正確與否?</p>
            `;
    },
    choices: [TRUE_BUTTON_TEXT, FALSE_BUTTON_TEXT],
    response_ends_trial: true,
    on_finish: function(data){
        // Repeat the survey if true (0) was not pressed
        repeat_survey = data.response !== 0;
        data.rt = Math.round(data.rt);
    }
};


const SURVEY_REJECTION_MESSAGE = '個人資料不符實驗要求，感謝參與❤️';
// a rejection screen for participants who do not match our recruitment criteria
// based on their survey responses
let rejection_end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: SURVEY_REJECTION_MESSAGE,
    choices: [],
    trial_duration: 5000,
    on_finish: function() {
        // actually stop the experiment
        jsPsych.endExperiment()
    }
};


let survey_check_rejection = {
    timeline: [rejection_end_screen],

    // when the following function returns false, we skip the rejection screen
    conditional_function: function() {
        let last = jsPsych.data.get().last(3).values();
        let survey_1 = last[0].response;
        let survey_2 = last[1].response;

        // log all survey responses
        console.log(survey_1);
        console.log(survey_2);
        
        // an innacurate representation of the participant's birth date for calculating age        
        let birth_date = new Date(survey_1.birth_year, parseInt(survey_1.birth_month) - 1, 1);
        let age = ((new Date()) - birth_date) / 3.15576e+10;  // milliseconds per yaer

        if (survey_2.Dyslexic == "是" || age < 18 || age >= 70) {
            return true;
        }
        return false;
    }
};

let survey_procedure = {
    timeline : [
        survey_1,
        survey_2,
        survey_review,
        survey_check_rejection
    ],
    loop_function : function () {
        if (repeat_survey) {
            // clear last trials of the survey
            let collection = jsPsych.data.get();
            let trials = collection.values();
            trials.length = trials.length - this.timeline.length;
        }
        return repeat_survey;
    }
};
