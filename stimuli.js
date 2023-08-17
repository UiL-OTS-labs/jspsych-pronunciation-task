// Item types
const FILLER = "FILLER";
const PRAC = "PRAC";
const NGCONDITION = "not generalized";
const GCONDITION = "generalized";

// Lists
const LISTS = [
    "list1"
    // "list3"
];

const PRACTICE_ITEMS = [
    {
        id : 1,
        item_type : PRAC,
        stimulus: '文'
    },
    {
        id : 2,
        item_type : PRAC,
        stimulus: '字'
    }
];

//not generalized

const LIST_GROUP1 = [
    {
        id : 1,
        item_type: NGCONDITION,
        stimulus: '韇',
    },
    {
        id : 2,
        item_type: NGCONDITION,
        stimulus: '扗'
    },
    {
        id : 3,
        item_type: NGCONDITION,
        stimulus: '吷'
    },
    {
        id : 4,
        item_type: NGCONDITION,
        stimulus: '燝'
    },
    {
        id : 5,
        item_type: NGCONDITION,
        stimulus: '鉯'
    },
    {
        id : 6,
        item_type: NGCONDITION,
        stimulus: '衳'
    },
    {
        id : 7,
        item_type: NGCONDITION,
        stimulus: '鯒'
    },
    {
        id : 8,
        item_type: NGCONDITION,
        stimulus: '稒'
    },
    {
        id : 9,
        item_type: NGCONDITION,
        stimulus: '諣'
    },
    {
        id : 10,
        item_type: NGCONDITION,
        stimulus: '酭'
    },
    
// generalized

    {
        id : 11,
        item_type: GCONDITION,
        stimulus: '蚐'
    },
    {
        id : 12,
        item_type: GCONDITION,
        stimulus: '髇'
    },
    {
        id : 13,
        item_type: GCONDITION,
        stimulus: '蹡'
    },
    {
        id : 14,
        item_type: GCONDITION,
        stimulus: '䦿'
    },
    {
        id : 15,
        item_type: GCONDITION,
        stimulus: '碮'
    },
    {
        id : 16,
        item_type: GCONDITION,
        stimulus: '眏'
    },
    {
        id : 17,
        item_type: GCONDITION,
        stimulus: '柾'
    },
    {
        id : 18,
        item_type: GCONDITION,
        stimulus: '躰'
    },
    {
        id : 19,
        item_type: GCONDITION,
        stimulus: '窢'
    },
    {
        id : 20,
        item_type: GCONDITION,
        stimulus: '繏'
    }
];

// Add a third list of stimuli when required.
// const LIST_GROUP3 = [
// ...
// ]

// These lists are not a between subjects variable, but
// define which list a participant gets.
const TEST_ITEMS = [
    {list_name: LISTS[0], table: LIST_GROUP1}
    // Add a third list here, put a comma on the
    // end of the line above here.
    // {list_name: LISTS[1], table: LIST_GROUP3}
];
