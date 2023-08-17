
// Keeps track whether or not consent has been given.
let consent_given = false;

/*
 * This fragment of html will be displayed in the beginning of you experiment.
 * You should fillout the contents of your information letter here.
 * It is displayed as html, the current html should be replace with
 * your information letter.
 */
const CONSENT_HTML =
    '<p>' +
        '歡迎來到<中文讀音實驗 23-058-01>的線上問卷！' +
    '</p>' +
    '<p>' +
    	'本實驗為關於中文讀音的心理語言學研究，由Chenyang Lin (c.lin7@students.uu.nl) 設計並執行，資料管理人為指導教授Iris Mulders (I.C.M.C.Mulders@uu.nl)。' +
    '</p>'+
    '<p>' +
    	'本實驗最多只會花5分鐘左右，未提供任何報酬敬請見諒。' +
    '</p>'+
    '<p>' +
    	'本實驗將蒐集錄音為wav或WebM檔，以及年齡、母語、多語環境、閱讀障礙、性別和慣用手等個人資訊。本實驗會錄受試者的聲音，也可能錄到背景音效，資料將於YoDA (https://www.uu.nl/en/research/yoda) 安全儲存至少十年，化名為XXXX_XXXX_XXXX.webm的格式以標明實驗日期，主要研究員Dr. Iris Mulders允許才得以存取。本實驗和外部公司或機構並無合作，亦無分享資料給任何第三方。' +
    '</p>' +
    '<p>' +
    	'受試者為自願參與，唯有受試者同意才得以蒐集資料。若決定不參與，無須更多其他動作；若決定參與，亦得隨時中止參與。此外，18歲以下或69歲以上，或是有閱讀障礙的受試者將無法參與實驗，資料也將不會儲存。' +
    '</p>' +
    '<p>' +
    	'本實驗已通過人文學科倫理審查委員會(FEtC-H)審核，若對實驗進行方式有任何意見，請寄信至fetc-gw@uu.nl。' +
    '<\p>' +
    '<p>' +
    	'若你對個資處理有任何意見或問題，請寄信至法律事務部門(privacy@uu.nl)，其將協助你行使隱私法規賦予的權利，或是聯繫烏特勒支大學的DPO(data protection officer，fg@uu.nl)，其遵守保密協議，將為你保密處理。' +
    '</p>' +
    '<p>'+
    	'此外，你亦有權向https://www.autoriteitpersoonsgegevens.nl/en申訴。' +
    '</p>' +
    '<p>' +
    	'實驗中或實驗後有任何更多問題，請洽詢Iris Mulders (I.C.M.C.Mulders@uu.nl)；'  +
    '</p>' +
    '<p>' +
    	'更多資訊參見' +
        '<a href="https://fetc-gw.wp.hum.uu.nl/en/" target="_blank"> '         +
            'FEtC-H網站'                                                   +
        '</a>'                                                                 +
    '</p>';

/*
 * Debrieving given when the participant doesn't consent.
 */
const DEBRIEF_MESSAGE_NO_CONSENT =
    "<h1>"                                          +
        "實驗結束"                     +
    "</h1>"                                         +
    "<h2>"                                          +
        "不同意(若你是不小心沒勾選到同意，請重新整理頁面)"                +
    "</h2>";

const CONSENT_STATEMENT =
    '是，我已詳閱並理解上述資訊，同意將我的回答用於上述科研目的';

const CONSENT_REFERENCE_NAME = 'consent';
const IF_REQUIRED_FEEDBACK_MESSAGE =
    "你必須勾選" + CONSENT_STATEMENT +
    "才能繼續實驗";

// Adds UU styling to the consent forms.
const CONSENT_HTML_STYLE_UU = `<style>
        body {
            background: rgb(246, 246, 246);
            font-family: "Open Sans","Frutiger",Helvetica,Arial,sans-serif;
            color: rgb(33, 37, 41);
            text-align: left;
        }

        p {
            line-height: 1.4; /* Override paragraph for better readability */
        }

        label {
            margin-bottom: 0;
        }

        h1, h2{
            font-size: 2rem;
        }

        h6 {
            font-size: 1.1rem;
        }

        /* Input styles */

        form > table th {
            padding-left: 10px;
            vertical-align: middle;
        }

        input, textarea, select {
            border-radius: 0;
            border: 1px solid #d7d7d7;
            padding: 5px 10px;
            line-height: 20px;
            font-size: 16px;
        }

        input[type=submit], input[type=button], button, .button, .jspsych-btn {
            background: #000;
            color: #fff;
            border: none;
            font-weight: bold;
            font-size: 15px;
            padding: 0 20px;
            line-height: 42px;
            width: auto;
            min-width: auto;
            cursor: pointer;
            display: inline-block;
            border-radius: 0;
        }

        input[type="checkbox"], input[type="radio"]
        {
            width: auto;
        }

        button[type=submit], input[type=submit], .button-colored {
            background: #ffcd00;
            color: #000000;
        }

        button[type=submit].button-black, input[type=submit].button-black {
            background: #000;
            color: #fff;
        }

        button a, .button a,
        button a:hover, .button a:hover,
        a.button, a.button:hover {
            color: #fff;
            text-decoration: none;
        }

        .button-colored a,
        .button-colored a:hover,
        a.button-colored,
        a.button-colored:hover {
            color: #000;
        }

        /* Table styles */
        table thead th {
            border-bottom: 1px solid #ccc;
        }

        table tfoot th {
            border-top: 1px solid #ccc;
        }

        table tbody tr:nth-of-type(odd) {
            background: #eee;
        }

        table tbody tr:hover {
            background: #ddd;
        }

        table tbody tr.no-background:hover, table tbody tr.no-background {
            background: transparent;
        }

        table tbody td, table thead th, table tfoot th {
            padding: 6px 5px;
        }

        /* Link styles */
        a {
            color: rgb(33, 37, 41);
            text-decoration: underline;
            transition: 0.2s ease color;
        }

        a:hover {
            transition: 0.2s ease color;
            color: rgb(85, 85, 95);
        }

        </style>
        `;

// displays the informed consent page
let consent_block = {
    type: jsPsychSurveyMultiSelect,
    data : {uil_save : true},
    preamble: CONSENT_HTML_STYLE_UU + CONSENT_HTML,
    required_message: IF_REQUIRED_FEEDBACK_MESSAGE,
    button_label: CONTINUE_BUTTON_TEXT,
    questions: [
        {
            prompt: "",
            options: [CONSENT_STATEMENT],
            horizontal: true,
            required: false,
            button_label: CONTINUE_BUTTON_TEXT,
            name: CONSENT_REFERENCE_NAME
        }
    ],
    on_finish: function(data){
        data.consent_choice_response = data.response.consent[0];
        data.rt = Math.round(data.rt);
    }
};

/**
 * Obtains the consent of the participant.
 *
 * @returns {string}
 */
function getConsentData()
{
    let data = jsPsych.data.get().select('consent_choice_response');
    return data.values[0];
}

// Is displayed when no consent has been given.
let no_consent_end_screen = {
    type: jsPsychHtmlButtonResponse,
    stimulus: DEBRIEF_MESSAGE_NO_CONSENT,
    choices: [],
    trial_duration: FINISH_TEXT_DUR,
    on_finish: function (data){
        jsPsych.endExperiment()
        data.rt = Math.round(data.rt);
    }
};

// Tests wheter consent has been given.
// If no consent has been given It displays the
// no_consent_screen.
//
let if_node_consent = {
    timeline: [no_consent_end_screen],
    conditional_function: function(data) {
        let mydata = getConsentData();
        if (mydata == CONSENT_STATEMENT) {
            consent_given = true;
            return false;
        } else {
            return true;
        }
    }
}

let consent_procedure = {
    timeline: [consent_block, if_node_consent]
}
