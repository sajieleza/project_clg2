const fs = require('fs');
const request = require('request');
const env = require('../env');

const imageService = {
    recognizeImage : async (req,res) => {
        const options = {
            method: "POST",
            url: `http://${env.HOST}:${env.DOCKER_PORT}/image`,
            formData : {
                "data" : fs.createReadStream(`${PATH}/image.jpg`)
            }
        };
        request(options, (err, response, body) => {
            if(err) {
                console.log(err);
            }
            if(response.body)
            {
                const responseBody = JSON.parse(response.body);

                if(responseBody.animal !== "")
                {
                    const animal = responseBody.animal;
                    if(animal !== "")
                    {
                        fs.writeFileSync("./animal.txt" , animal);
                    }
                }
                else
                {
                    fs.writeFileSync("./animal.txt" , "No animal");
                }
            }
            res.status = 200;
            res.send(body);
        });      
    }
}

module.exports = { imageService };