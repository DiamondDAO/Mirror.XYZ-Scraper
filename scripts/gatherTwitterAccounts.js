// const fs = require("fs");
const fs = require('fs');
const path = require('path');

// const testPost = "BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU"
let posts = [];

// iterate through each file
fs.readdir("./data", (err, fileList) => {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log(fileList);
        // loop through each file in directory
        for (file of fileList) {
            if (!file.toLowerCase().endsWith(".json")) continue;
            // start the parsing
            let filePath = path.join("./data", file);
            
            // get the arweave tx from filename (remove .json extension)
            let arweaveTx = file.split(".json")[0];

            // parse the data
            fs.readFile(filePath, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    // parse the Mirror data and return a dictionary
                    let parsed_data = parseMirrorData(data, arweaveTx);
                    
                    // add to list
                    posts.push(parsed_data);
                }
            });
        }
    }
    // write the file
    fs.writeFile("./MirrorTwitterData.json", JSON.stringify(posts), function(err) {
        if(err) {
            console.log(err);
        } 
        else {
            console.log("Output saved to MirrorTwitterData.");
        }
    }); 
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