// defining the variables to grab the npm packages
var twitter = require('twitter');
var spotifyAPI = require('spotify-web-api-node');
var request = require('request');
var inquirer = require('inquirer');

// used to read files later
var fs = require('fs');

// loading twitter and spotify keys information from keys.js file
var keys = require('./keys.js');

// loading twitter credentials
var client = new twitter({
    consumer_key: keys.twitterKeys.consumer_key,
    consumer_secret: keys.twitterKeys.consumer_secret,
    access_token_key: keys.twitterKeys.access_token_key,
    access_token_secret: keys.twitterKeys.access_token_secret
})

// loading spotify credentials
var spotify = new spotifyAPI({
    clientId: keys.spotifyKeys.client_ID,
    clientSecret: keys.spotifyKeys.client_secret,
})

// take in the arguments
var action = process.argv[2];
var itemName = process.argv[3];


// MAIN ACTION=========================================

switch (action) {
    case "my-tweets":
        readTweets();
        break;
    case "spotify-this-song":
        findSong();
        break;
    case "movie-this":
        findMovie();
        break;
    case "do-what-it-says":
        doIt();
        break;
}


// FUNCTIONS===========================================
// handling twitter
function readTweets() {

    var params = { q: 'nodejs', count: 20 };
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
        if (!error) {
            for (var i = 0; i < 20; i++) {
                console.log(i + 1 + ":   " + tweets[i].text);
                console.log("Date added: " + tweets[i].created_at);
                console.log("====================");
            }

        }
    });

}


// handling spotify
function findSong() {
    var songName = ''; //this is a string
    for (var i = 3; i < process.argv.length; i++) {
        var a = process.argv[i];
        songName += a + ' ';
    }

    var searchResults = [];


    if (songName) {
        spotify.searchTracks(songName, { limit: 5, offset: 0 }).then(function(data) {
            for (var i = 0; i < 5; i++) {
                searchResults.push(data.body.tracks.items[i].name + ' by ' + data.body.tracks.items[i].artists[0].name);
            }
            console.log("====================");
            inquirer.prompt({
                type: 'list',
                name: 'songs',
                message: "Here are the top 5 results. Which one do you want to know more about?",
                choices: searchResults,

            }).then(function(answer) {
                for (var i = 0; i < 5; i++) {
                    if (answer.songs.split(' by ')[0] == data.body.tracks.items[i].name && answer.songs.split(' by ')[1] == data.body.tracks.items[i].artists[0].name) {
                        console.log("====================");
                        console.log("Song name: " + data.body.tracks.items[i].name);
                        console.log("Artist(s): " + data.body.tracks.items[i].artists[0].name);
                        console.log("From album: " + data.body.tracks.items[i].album.name);
                        console.log("Preview link: " + data.body.tracks.items[i].preview_url);
                        console.log("====================");
                    }
                }
            })

        }, function(err) {
            console.log('Error occurred: ' + err);

        })

    } else {
        spotify.searchTracks('track:The Sign artist:Ace of Base').then(function(data) {
            console.log("====================");
            console.log("Song name: " + data.body.tracks.items[i].name);
            console.log("Artist(s): " + data.body.tracks.items[i].artists[0].name);
            console.log("From album: " + data.body.tracks.items[i].album.name);
            console.log("Preview link: " + data.body.tracks.items[i].preview_url);
            console.log("====================");
        }, function(err){
            return console.log(err);
        });
    }

}

// function findMovie() {
//     // Then run a request to the OMDB API with the movie specified
//     var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";

//     // This line is just to help us debug against the actual URL.
//     console.log(queryUrl);

//     request(queryUrl, function(error, response, body) {

//         // If the request is successful
//         if (!error && response.statusCode === 200) {

//             // Parse the body of the site and recover just the imdbRating
//             // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
//             console.log("Release Year: " + JSON.parse(body).Year);
//         }
//     });

// }
