'use strict';
const snoowrap = require('snoowrap');
const dotenv = require('dotenv').config();

const r = new snoowrap({
    userAgent: process.env.USERAGENT,
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
    username: process.env.USERNAME,
    password: process.env.PASSWORD
  });

let cache = [];

let surfWaves = async () => {
    console.log('Surfing....'); 
    let subListing = await r.getSubreddit('vexillologycirclejerk').getNew()

            //Get the first ten submissions...
    subListing.slice(0,10).forEach(submission => {
        if (cache.indexOf(submission.id) >= 0){
            console.log(`🙈 We've seen ${submission.id} already.`);
        } else {
            cache.push(submission.id); 
            submission.comments.fetchAll().then(comments => {
                console.log(`👀 We haven't seen ${submission.id} before...`)
                //If no comments contain !wave...
                if(!comments.some(comment => comment.body.includes('!wave'))){
                    console.log(`  ✅ Adding !wave... ${submission.id} — ${submission.title}`); 
                    r.getSubmission(submission.id).reply('!wave');
                } else {
                    console.log(`  ⛔️ No need, someone got here first. (${submission.id})`);
                }
            });
        }
    }); 
}

export const handler = async (event, context) => {
    await surfWaves(); 
}
