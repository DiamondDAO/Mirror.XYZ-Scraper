// const fs = require("fs");
const fs = require('fs');
const path = require('path');

const testPost = "BiSkFNbcQt5aI1Zr-I0E-DGjf-Qk44FSyJds036EiKU"
const filePath = path.join("./data", testPost + '.json');

fs.readFile(filePath, function(err, data) {
    if (err) {
        console.log(err);
    } else {
        let post = JSON.parse(JSON.parse(data));
        let contributor = post["authorship"]["contributor"];
        let title = post["content"]["title"];
        let date_published = post["content"]["timestamp"];
        let body = post["content"]["body"];

        getTwitterAccounts(body);
        console.log(post["content"]);
        // console.log(JSON.parse(data));
    }
});

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