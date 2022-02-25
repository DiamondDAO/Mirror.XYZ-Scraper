// const fs = require("fs");
const fs = require('fs');
const path = require('path');

const testPost = "BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU"
const filePath = path.join("./data", testPost + '.json');

fs.readFile(filePath, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        // let post = JSON.parse(JSON.parse(data));
        // let contributor = post["authorship"]["contributor"];
        // let title = post["content"]["title"];
        // let date_published = post["content"]["timestamp"];
        // let body = post["content"]["body"];

        // let associated_twitters = getTwitterAccounts(body);
        let parsed_data = parseMirrorData(data);
        console.log(post["content"]);
        // console.log(JSON.parse(data));
    }
});

function parseMirrorData(content) {
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

    return dict;
}

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