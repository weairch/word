const moment = require("moment");

function formatMessage(text,username) {
    return {
        username,
        text,
        time: moment().format("h:mm:ss a")
    };
}



module.exports = {
    formatMessage    
};