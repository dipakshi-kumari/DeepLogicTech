const express = require('express');
const https = require('https');

const app = express();
const port = 3000;

app.get('/latest-stories', (req, res) => {
    https.get('https://time.com', (response) => {
        let data = '';
    
        //Extracting time.com html
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            const stories = parseStories(data);
            res.json(stories);
        });
    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.status(500).send('Error fetching stories');
    });


});

//Function to search for latest stories in html
function parseStories(html) {
    const stories = [];
    let index = 0;

    while (stories.length < 6) {
        // Finding the start of the link and title
        let linkStart = html.indexOf('<li class="latest-stories__item">', index);
        if (linkStart === -1) break;
        linkStart = html.indexOf('href="', linkStart) + 6;
        let linkEnd = html.indexOf('"', linkStart);
        let titleStart = html.indexOf('<h3 class="latest-stories__item-headline">', linkEnd) + '<h3 class="latest-stories__item-headline">'.length;
        let titleEnd = html.indexOf('</h3>', titleStart);

        // Extracting link and title
        const link = html.substring(linkStart, linkEnd);
        const title = html.substring(titleStart, titleEnd);

        //Pushing title to stories
        stories.push({ title, link: `https://time.com${link}` });

        // Updating index to search for the next story
        index = titleEnd;
    }

    return stories;
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 