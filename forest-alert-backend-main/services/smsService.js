const request = require('request');
const env = require('../env')
const smsService = {
    sendSms: async (phoneNumber, message) => {
        const options = {
            method: "POST",
            url: `https://maker.ifttt.com/trigger/SMS_EVENT/with/key/${env.API_KEY_IFTTT}`,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"value1": phoneNumber,"value2": message})
        };

        //Uncomment below function to enable SMS
        
        // request(options, (err, response, body) => {
        //     if(err) {
        //         console.log(err);
        //     }
        // });
    }
}

module.exports = { smsService };