// const fs = require("fs");
const fs = require('fs');
const { dirname } = require('path');
const path = require('path');
const { callbackify } = require('util');

// const testPost = "BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU"

const dir = "./data";

// iterate through each file
fs.readdir(dir, (err, fileList) => {
    if (err) {
        console.error(err);
        return;
    } else {
        // let posts = [];
        // loop through each file in directory
        fileList.slice(19560, 19564).forEach(function(filename) {
            // if (!filename.toLocaleLowerCase().endsWith(".json")) continue;
            // combine the directory and filename
            let filePath = path.join(dir, filename);
            // extract arweave transaction from the filename
            let arweaveTx = filename.split(".json")[0];
            fs.readFile(filePath, function(err, data) {
                if (err) {
                    console.error(err);
                } else {
                    // parse the Mirror data and return a dictionary
                    let parsed_data = parseMirrorData(data, arweaveTx);
                    // add to list
                    posts.push(parsed_data);
                    // console.log(posts);
                }
            }); // finish processing a file
        }); // finish looping through all files
        callback(posts);
        // write the file
        const outdir = "./analysis/MirrorTwitterNetwork/data/";
        const outFile = "MirrorTwitterData.json";

        fs.writeFile(outdir + outFile, JSON.stringify(posts), function(err) {
            if(err) {
                console.log(err);
            } 
            else {
                console.log("Output saved to MirrorTwitterData.");
                console.log()
            }
        }); // finish writing files
    }
});


// returns a simplified JSON object from a Mirror post data object.
function parseMirrorData(content, txString) {
    dict = {};

    // parse the Mirror post
    let post = JSON.parse(JSON.parse(content));
    let contributor = post["authorship"]["contributor"];
    let title = post["content"]["title"];
    let date_published = post["content"]["timestamp"];
    let body = post["content"]["body"];
    let digest = post["originalDigest"];
    let associated_twitters = getTwitterAccounts(body);

    // fill dictionary with parsed data
    dict["contributor"] = contributor;
    dict["title"] = title;
    dict["date_published"] = date_published;
    dict["body"] = body;
    dict["originalDigest"] = digest;
    dict["associated_twitters"] = associated_twitters;
    dict["arweave_tx"] = txString;
    return dict;
}

// parses the body of a Mirror post JSON object and returns a list of twitter accounts.
function getTwitterAccounts(content){
    twitter_account_list = [];
    // regex expression to get embedded twitter account link
    let re = /(twitter.com\/)[\w]+/g;

    // match every twitter account and add to a list that gets returned
    let accounts = content.matchAll(re);

    for (account of accounts) {
        twitter_account_list.push(account[0]);
    }

    return twitter_account_list
}