const { imageService } = require("../services/imageService");

const imageController = {
    recognize: (req, res) => {
        imageService.recognizeImage(req,res,(response) => {
            res.status = 200;
            res.send(response);
        })
    },    
}

module.exports = imageController;