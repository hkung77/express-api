const got = require('got');

const getImage = async (name) => {
    const key = process.env.GOOGLE_KEY;
    const URL = 'https://www.googleapis.com/customsearch/v1';
    const params = `q=${name}&num=1&start=1&imgSize=medium&searchType=image&cx=014045533171696612546:exxk4b7fi_w`

    return await got(`${URL}?${params}&key=${key}`, {responseType: 'json', resolveBodyOnly: true })
        .catch(error => 
           console.error(error)
        );
};

module.exports = getImage;
