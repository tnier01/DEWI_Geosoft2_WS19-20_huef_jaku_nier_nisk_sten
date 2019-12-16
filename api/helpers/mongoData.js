// jshint esversion: 8
// jshint node: true
"use strict";

const Tweet = require('../models/tweet');
// Tweet.index({text: 'text'});
const {bboxToPolygon} = require('./geoJSON');


const postTweet = async function (tweet) {
    var coordinates = [];
    var geometry = {};
    geometry['type'] = 'Point';
    console.log(tweet);
    console.log("Storing Tweet..");

    if (tweet) {
        // mongoose: findOneAndUpdate
        /*try {
            var savedTweet = await Tweet.findOneAndUpdate({
                tweetId: tweet.tweetId
            }, {
                tweet
            }, {
                new: true,
                upsert: true,
                rawResult: true,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send({
                message: 'Error while storing data in MongoDB.'
            });
        }*/
        var tweetsWithId = await Tweet.find({tweetId: tweet.tweetId});
        console.log("size: " + tweetsWithId.length);

        if (tweetsWithId.length > 0) {
            return "Tweet is already stored in database.";
        } else {
            coordinates.push(tweet.places.coordinates.lng);
            coordinates.push(tweet.places.coordinates.lat);
            geometry['coordinates'] = coordinates;
            console.log(" Geometry: " + JSON.stringify(geometry));
            var newTweet = new Tweet({
                tweetId: tweet.tweetId,
                url: tweet.url,
                text: tweet.text,
                createdAt: tweet.createdAt,
                geometry: geometry,
                placeName: tweet.places.placeName,
                author: tweet.author,
                media: tweet.media
                // author und media noch splitten oder einfach als Mixed definieren??
            });
            try {
                console.log(newTweet);
                await newTweet.save();
                return "tweet stored in db.";
            } catch (e) {
                return e;
            }
        }
    }
};

const getTweetsFromMongo = async function (filter, bbox) {
    // write words in the filter in a String to search for them
    // assumes the filter words format is an array
    var words = filter[0];
    if (filter.length > 1) {
        for (var i = 1; i < filter.length; i++) {
            words = filter[i] + " " + words;
        }
    }
    var polygonCoords = [bboxToPolygon(bbox)];
    var polygon = {type: 'Polygon', coordinates: polygonCoords};
    console.log(polygon);
    try {
        const result = await Tweet.find({
            $text: {$search: words},
            geometry: {$geoWithin: {$geometry: polygon}}
        });
        console.log("filtered Tweets: ");
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    postTweet,
    getTweetsFromMongo
};