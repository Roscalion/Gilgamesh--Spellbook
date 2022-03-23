/*
Package name: M1L0 
Description: GQ-CLI command interface for Discord and the Guild Quest metaverse
Author: Jon Senterfitt
Version: 1.0.0
*/
require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const crypto = require('crypto');
const { mint, send } = require('./xrpl.js');
const { generateFromSqKM, generateLandForEarth, generateForBoraBora } = require('./geospatial.js');
const Tatum = require('@tatumio/tatum');

// Global / local configuration for the guild
let debug = false; // Set debug mode
const globalTimeout = 2000; // Standard timeouts
let awayUsers = []; // Away messages for the server

// The server
app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});
app.post('/', (req, res) => {
    // respond to the payload from the ultima function for an exchange of 10 HYPE
    res.send('ok');
});
server.listen(9999, () => {
    console.log('listening on *:9999');
});


// Discord related functionallity
const { Client, MessageEmbed, Intents, joinVoiceChannel } = require('discord.js');
const qrcode = require('qrcode');
const axios = require("axios").default;
const admin = require("firebase-admin");
const moment = require('moment')
const chalk = require('chalk');
const config = require('./config');

// Initialize Discord bot
let bot = new Client({
    fetchAllMembers: true, // Remove this if the bot is in large guilds.
    intents: ["GUILDS", "GUILD_MESSAGES", "DIRECT_MESSAGES"],
    partials: ["CHANNEL"],
    presence: {
        status: 'online',
        activity: {
            name: `${config.prefix}help`,
            type: 'LISTENING'
        }
    }
});

// Serve and listen for commands
require('./server')();
bot.login(config.token);

bot.on('ready', () => console.log(`Logged in as ${bot.user.tag}.`));

const newCard = async (message) => {
    let command = message.content;

    let card = {
        name: '',
        description: '',
        image: '',
        rarity: '',
        type: '',
        cost: '',
        effect: '',
        owner: message.author.id,
        owner_name: message.author.username,
        owner_guild: message.guild.name,
        owner_guild_id: message.guild.id,
        submittedAt: firebase.database.ServerValue.TIMESTAMP
    }

    console.log('Hey', card);

    let args = message.content.split(' ');

    // Using args to fill in the metadata
    if (command.includes('-n')) {
        // Get all the words after the -n
        let name = args.slice(args.indexOf('-n') + 1).join(' ');
        card.name = name;
    }

    if (command.includes('-d')) {
        // Get all the words after the -d
        let description = args.slice(args.indexOf('-d') + 1).join(' ');
        card.description = description;
    }

    return card;
}

const playCard = (message, card) => {
    // Check if the user exists already
}

const mintCard = (message, card) => {

}

const activateCard = (message, card) => {

}

const tradeCard = (message, card) => {

}

const useHasCard = (message, card) => {

}

// Monitor for messages in the Discord
bot.on('message', async message => {
    let channelID = message.channel.id;
    let channel = message.channel.name;
    let position = message.channel.rawPosition;
    let parent = message.channel.parentID;
    let lastMessageID = message.channel.lastMessageID;

    let guild = message.guild;
    let sent = new Date().getTime()
    let fromNow = moment(sent).fromNow();

    // Guild name
    let guildName = guild.name;

    guildQuestGame(message, message.content);

    // Add to terminal logs
    console.log(guildName, channel, chalk.cyanBright('@' + message.author.username), message.content || 'No content');

    let response = {
        "channel": {
            "id": channelID,
            "name": channel,
            "position": position || 0,
            "parent": parent || null,
            "lastMessageID": lastMessageID || null,
        },
        "message": {
            "id": message.id,
            "author": message.author.username,
            "message": message.content,
            "url": message.url,
            "type": message.type || '',
            "sentAt": sent,
            "channel": channelID,
            "fromNow": fromNow,
        },
    }

    admin.database().ref('/channels/' + channelID + '/info').update(response.channel);
    admin.database().ref('/channels/' + channelID + '/messages').push(response.message);


    var db = admin.database();
    const ref = db.ref('commands').push().set(response);

    let c = message.content;

    // GQ CLI - Gilgamesh's Spell Book Prefix
    if (c.startsWith(config.prefix)) {

        if (c.includes('activate debug controls')) {
            debug = true;
        }

        if (debug) {
            message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: 'Command',
                    description: `${message.author.username} issued the command: ${c}`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Gatekeeper'
                    }
                }
            });
        }
    }

    // GQ CLI - Globals
    if (c) {
        if (c.includes(config.prefix)) {
            console.log(chalk.bgGreen('Command detected', c));
            if (c.includes('berserker')) {
                if (debug) {
                    message.channel.send('Berserker detected')
                }
                berserker(message, c)

                // check if includes initiate
                if (c.includes('initiate')) {
                    if (debug) {
                        message.channel.send('Initiate detected')
                    }

                    // Attach agif to the message
                    message.channel.send({
                        files: ['https://c.tenor.com/QB9sHepsNpYAAAAC/fate-berserker.gif']
                    })
                }
            }

            else if (c.includes('caster')) {
                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://wanabrar.files.wordpress.com/2015/05/32.gif']
                    })
                }
                caster(message, c)
            }

            else if (c.includes('saber')) {
                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/9MVL06mTZXMAAAAC/fate-saber-magic.gif']
                    })
                }
            }

            else if (c.includes('rider')) {
                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/fox5aDn4UHEAAAAC/fate-zero-fate-grand-order.gif']
                    })
                }
            }

            else if (c.includes('lancer')) {
                if (debug) {
                    message.channel.send('Lancer detected')
                }
                lancer(message, c)
            }

            else if (c.includes('gatekeeper')) {
                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/ZZcS1kZo5UkAAAAS/gilgamesh-kunai.gif']
                    })
                }
                gatekeeper(message, c)
            }

            else if (c.includes('archer')) {
                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/BgZtjm1Dk5kAAAAC/emiya-archer.gif']
                    })
                }
                archer(message, c)
            }

            else if (c.includes('gilgamesh')) {
                gilgamesh(message, c)
            }

            else if (c.includes('ruler')) {

                if (c.includes('initiate')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/V79Qe7cAakoAAAAS/fate-jeanne-d-arc.gif']
                    })
                }

                if (c.includes('encourage')) {

                }

                if (c.includes('peace')) {
                    message.channel.send({
                        files: ['https://c.tenor.com/V79Qe7cAakoAAAAC/fate-jeanne-d-arc.gif']
                    })
                }

                // Check if !raid is in the message
                if (c.includes('raid')) {
                    message.channel.send('Chaining example: Step 2 - Raid detected')

                    // new raid detected
                    if (c.includes('new')) {
                        message.channel.send('Chaining example: Step 3 - New raid detected')

                        // Add a raid to the database
                        let words = c.split(' ') || [];
                        let payload = {
                            "raid_payload": c,
                        }

                        // Post the message to the firebase
                        var db = admin.database();
                        const ref = db.ref('raids').push().set(payload);

                        // Notify the channel that the raid has been created
                        message.channel.send({
                            embed: {
                                color: 0x0099ff,
                                title: 'Raid Created',
                                description: `${message.author.username} created a new raid`,
                                timestamp: new Date(),
                                footer: {
                                    text: 'Gatekeeper'
                                }
                            }
                        });
                    }
                }

                if (c.includes('olympus')) {
                    message.channel.send('Chaining example: Step 4 - Olympus detected')

                    // brooadcast the message
                    if (c.includes('broadcast')) {
                        message.channel.send('Chaining example: Step 5 - Broadcast detected')
                    }
                }

                if (c.includes('proposals')) {
                    // create a hash of the proposal to store on the Hyperion Blockchain

                    // check if the proposal is new
                    if (c.includes('new')) {
                        console.log(chalk.bgGreen('New proposal detected', c));
                        message.channel.send('Chaining example: Step 6 - New proposal detected')

                        // Attach a gif
                        message.channel.send({
                            files: ['https://c.tenor.com/V79Qe7cAakoAAAAC/fate-jeanne-d-arc.gif']
                        })
                    }
                }


            }
        }

        if (c.includes('!mewto')) {


            if (c.includes('command')) {

                if (c.includes('cast')) {

                    if (c.includes('initiate')) {

                        message.channel.send('Wild Mewto appeared!')
                        message.channel.send({
                            files: ['https://media3.giphy.com/media/7ProItiELBagM/giphy.gif']
                        })
                    }

                    if (c.includes('bot army')) {
                        message.channel.send({
                            files: ['https://c.tenor.com/esaTulyVSNEAAAAC/mewtwo.gif']
                        })

                        if (c.includes('deflect')) {
                            message.channel.send({
                                files: ['https://thumbs.gfycat.com/OpulentOpulentKillifish-size_restricted.gif']
                            })
                        }

                    }
                }
            }
        }

        if (c.includes('!game master')) {

            if (c.includes('tekken')) {

                if (c.includes('start')) {
                    message.channel.send({
                        embed: {
                            color: 0x0099ff,
                            title: `${message.author.username} is starting a tekken match`,
                            description: `Scan the QR to get your access pin.`,
                            timestamp: new Date(),
                            footer: {
                                text: 'Game Master'
                            }
                        }
                    });

                    createGame(message, c);

                    message.channel.send({
                        files: ['https://c.tenor.com/RLGECF3fMkwAAAAC/tekken-jin.gif']
                    })

                }

                if (c.includes('join')) {

                }

                if (c.includes('list')) {
                    showOpenGames(message);
                }

            }


            // Start a new small rocket league match
            if (c.includes('rl start')) {
                message.channel.send({
                    files: ['https://media3.giphy.com/media/nXg2lqVpal6KgSC8Zq/200.gif']
                })
                // Announce with a 
                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `${message.author.username} is looking for teammates.`,
                        description: `${message.author.username} has announced a new game.`,
                        timestamp: new Date(),
                        footer: {
                            text: 'Game Master'
                        }
                    }
                });

                // Add the game for the guild to join to the database
                var db = admin.database();
                const ref = db.ref('guilds/' + message.guild.id + '/games').push().set({
                    game_name: 'Rocket League',
                    game_creator_id: message.author.id,
                    game_creator: message.author.username,
                    game_status: 'Open',
                    game_payload: c,
                    game_type: 'Trios',
                });

            }

            if (c.includes('halo start')) {
                message.channel.send('Starting new small halo match')
                message.channel.send({
                    files: ['https://media0.giphy.com/media/b4ab9TBk9Ornvrt9W8/giphy-downsized-large.gif']
                })
            }

        }

        else if (c.includes('!berserker')) {

            if (c.includes('thank you')) {
                message.channel.send({
                    files: ['https://c.tenor.com/-4_MF7jRTxIAAAAd/fate-zero.gif']
                })
            }

            if (c.includes('tcg')) {
                if (c.includes('new')) {
                    // Get all words after "!berserker tcg new"
                    let words = c.split(' ') || [];
                    let payload = {
                        "card_name": words[2],
                        "card_type": words[3],
                        "card_rarity": words[4],
                        "card_set": words[5],
                        "card_image": words[6],
                        "card_price": words[7],
                        "card_quantity": words[8],
                        "card_condition": words[9],
                        "card_notes": words[10],
                        "card_payload": c,
                    }
                }
            }

            useCharacter('berserker', message, c)
        }

        else if (c.includes('!caster')) {
            useCharacter('caster', message, c)
        }

        else if (c.includes('!saber')) {
            useCharacter('saber', message, c)
        }

        else if (c.includes('!rider')) {
            useCharacter('rider', message, c)
        }

        else if (c.includes('!lancer')) {
            if (c.includes('smile')) {
                message.channel.send({
                    files: ['https://c.tenor.com/kZTjz7EeLqQAAAAS/cuchulainn-anime.gif']
                })
            }
            useCharacter('lancer', message, c)
        }

        else if (c.includes('!gatekeeper')) {
            useCharacter('gatekeeper', message, c)
        }

        else if (c.includes('!archer')) {
            useCharacter('archer', message, c)
        }

        else if (c.includes('!ruler')) {
            useCharacter('ruler', message, c)
        } else {

        }

    }
})

// Fetch the service account key JSON file contents
var serviceAccount = require("./gatekeeper-d13f9-firebase-adminsdk-r6ui8-a45cf182b5.json");

// Initialize the app with a service account, granting admin privileges
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // The database URL depends on the location of the database
    databaseURL: "https://gatekeeper-d13f9-default-rtdb.firebaseio.com"
});

// Initialize a second firebase connection
const firebase = require('firebase-admin');
const firebaseConfig = {
    apiKey: "AIzaSyA9MTIK0DIP8rfyaS9Zg-cvuE8_GXV8obY",
    authDomain: "guild-quest-discord.firebaseapp.com",
    databaseURL: "https://guild-quest-discord-default-rtdb.firebaseio.com",
    projectId: "guild-quest-discord",
    storageBucket: "guild-quest-discord.appspot.com",
    messagingSenderId: "503154630983",
    appId: "1:503154630983:web:e1fbac8f2c7a55bf24ec62"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig, 'firebase');


/*
                                                                                                                                                                     
      # ###                        ###         ##             # ###                                                        # ###       ##### /              #####  # 
    /  /###  /                 #    ###         ##          /  /###                                                      /  /###  / ######  /            ######  /   
   /  /  ###/                 ###    ##         ##         /  /  ###                                        #           /  /  ###/ /#   /  /            /#   /  /    
  /  ##   ##                   #     ##         ##        /  ##   ###                                      ##          /  ##   ## /    /  /            /    /  /     
 /  ###                              ##         ##       /  ###    ###                                     ##         /  ###          /  /                 /  /      
##   ##         ##   ####    ###     ##     ### ##      ##   ##     ## ##   ####      /##       /###     ########    ##   ##         ## ##                ## ##      
##   ##   ###    ##    ###  / ###    ##    #########    ##   ##     ##  ##    ###  / / ###     / #### / ########     ##   ##         ## ##                ## ##      
##   ##  /###  / ##     ###/   ##    ##   ##   ####     ##   ##     ##  ##     ###/ /   ###   ##  ###/     ##        ##   ##         ## ##              /### ##      
##   ## /  ###/  ##      ##    ##    ##   ##    ##      ##   ##     ##  ##      ## ##    ### ####          ##        ##   ##         ## ##             / ### ##      
##   ##/    ##   ##      ##    ##    ##   ##    ##      ##   ##     ##  ##      ## ########    ###         ##        ##   ##         ## ##                ## ##      
 ##  ##     #    ##      ##    ##    ##   ##    ##       ##  ## ### ##  ##      ## #######       ###       ##         ##  ##         #  ##           ##   ## ##      
  ## #      /    ##      ##    ##    ##   ##    ##        ## #   ####   ##      ## ##              ###     ##          ## #      /      /           ###   #  /       
   ###     /     ##      /#    ##    ##   ##    /#         ###     /##  ##      /# ####    /  /###  ##     ##           ###     /   /##/           / ###    /        
    ######/       ######/ ##   ### / ### / ####/            ######/ ##   ######/ ## ######/  / #### /      ##            ######/   /  ############/   #####/         
      ###          #####   ##   ##/   ##/   ###               ###   ##    #####   ## #####      ###/        ##             ###    /     #########       ###          
                                                                    ##                                                            #                                  
                                                                    /                                                              ##                                
                                                                   /                                                                                                 
                                                                  /                                                                                                  

Guild Quest CLI Discord Bot by HYPE Guild of Guild Quest Metaverse.


START HERE

*/
const guildQuestGame = async (message, command) => {

    // Main
    if (command.includes('!guildquest')) {
        let text = 'Guild Quest is an ongoing metaverse build out across all countries of the world. By using this CLI, you are participating in a story like no other, where you are the player, the protagonist and the ray of light for your community to be seen throughhout the galaxy.\n\n'
        text += 'To get started, type !gq help to see the list of commands.\n'
        message.channel.send(text)
    }

    // Help
    if (command.includes('!gq help')) {
        let text = ''

        // TCG
        text += 'NFT / Smart Contract Trading cards from guilds across the world! - !tcg\n\n'

        // !bounty
        text += 'Bounty Board - !bounty\n\n'

        // !skill
        text += 'Skill Tree - !skill\n\n'

        // Send a response back
        message.channel.send({
            embed: {
                color: 3447003,
                title: 'Guild Quest CLI Commands',
                description: text
            }
        })

    }

    // Academy
    if (command.includes('!gq academy')) {


        if (command === '!gq academy') {
            let text = 'Guild Quest Academy is a place where you can learn how to play Guild Quest!\n\n'
            text += 'To get started, type !gq academy start to begin your journey.\n'

            message.channel.send({
                embed: {
                    color: 3447003,
                    title: 'Guild Quest Academy',
                    description: text
                }
            })
        }

        if (command.includes('members')) {
            // 
        }

        if (command.includes('start')) {
            let text = 'You are now enrolled in the Guild Quest Academy!\n\n'
            text = 'I am Cloud, the Guild Quest Academy Instructor. I will be your guide throughout your journey.\n\n'
            text += 'Type !gq academy help to see the list of commands at any time.\n\n\n'

            text += "Let's start with a basic command.\n\n Type **!bounty** to see the **Guild Quest Bounty Board**.\n\n"

            text += "Try it now!\n"


            // Check if the user exists already
            firebase.database().ref('users/' + message.author.id).once('value').then(function (snapshot) {
                if (snapshot.val() === null) {
                    // Create the user
                    firebase.database().ref('users/' + message.author.id).set({
                        name: message.author.username,
                        guild: '',
                        guild_id: '',
                        guild_rank: '',
                        level: 1,
                        xp: 0,
                        enrolled: true
                    })
                } else {
                    // User exists, update enrolled
                    firebase.database().ref('users/' + message.author.id).update({
                        enrolled: true,
                    })
                }
            })

            // Add them to the academy
            firebase.database().ref('academy/').child(message.author.id).set(true);

            message.channel.send({
                embed: {
                    color: 3447003,
                    title: 'Guild Quest Academy',
                    description: text
                }
            })
        }

        if (command.includes('continue')) {
            // Lookup the user and the current level and xp
            firebase.database().ref('users/' + message.author.id).once('value').then(function (snapshot) {
                let user = snapshot.val();
                // get the current level
                let level = user.level;
            })
        }
    }

    // TCG
    if (command.includes('!tcg')) {

        if (command === '!tcg') {
            message.channel.send({
                embed: {
                    title: 'Welcome to the TCG Engine for ' + message.guild.name,
                    description:
                        `You can use the following commands: \n\n!tcg card play <card name> \n\n!tcg card activate <card name> \n\n!tcg card trade <card name>`,
                    color: 0x00ff00
                }
            })
        }

        if (command.includes('card')) {

            /*
            Phase 1 Commands
            */

            if (command.includes('activate')) {
                mint(message).then(function (result) {
                    message.channel.send({
                        embed: {
                            title: 'Guild Quest Card',
                            description: 'Minted and actiaved a card!',
                            color: 0x00ff00
                        }
                    })
                }).catch(function (err) {
                    console.log(err);
                })


            }
            if (command.includes('trade')) {
                message.channel.send({
                    embed: {
                        title: 'Guild Quest TCG Trade Command',
                        description: 'You may use the following trade commands:\n\n' + '!guildquest card trade <card name>',
                        color: 0x00ff00
                    }
                })
            }
            if (command.includes('play')) {

                // Record the card played on the blockchain ledger using XRP and Tatum
                // Check if the user exists already
                firebase.database().ref('users/' + message.author.id).once('value').then(function (snapshot) {

                })

                message.channel.send({
                    embed: {
                        title: 'Guild Quest Card',
                        description: 'You may use the following card commands:\n\n' + '!guildquest card play <card name>',
                        color: 0x00ff00
                    }
                })
            }

            if (command.includes('new')) {
                message.channel.send({
                    embed: {
                        title: `${message.author.username} has created a new card!`,
                        description: `${message.author.username} has created a new card!`,
                        color: 0x00ff00
                    }
                })


                // STEP 1 - keep going here
                let card = await newCard(message)

                let mintCard = await mintCard(message, card)

            }
            /*

            Phase 2 Commands 
            - Drop the card into the ledger
            */


        }

        if (command.includes('deck')) {
            if (command.includes('new')) {
                message.channel.send({
                    embed: {
                        title: `${message.author.username} has created a new deck!`,
                        description: `${message.author.username} has created a new deck!`,
                        color: 0x00ff00
                    }
                })
            }
        }
    }


    /*
    Bounty CLI Commands
    - !bounty
    - !bounty list <status>
    - !bounty claim <bounty id>
    */


    // Bounties
    if (command.includes('!bounty')) {
        let db = admin.database();
        let c = command;

        // if no other arguements are given, display welcome
        if (c.length == 7) {
            message.channel.send({
                embed: {
                    title: 'Welcome to the Bounty Board of the ' + message.guild.name,
                    description:
                        `You can use the following commands: \n\n!bounty list <status> \n\n!bounty submit skill <skill needed> reward <reward offered> type <type of bounty> \n\n !bounty claim <bounty id> \n\n!bounty complete <bounty id>`,
                    color: 0x00ff00
                }
            })
        }
        if (c.includes('list')) {
            let bountyList = [];
            // Get the list of bounties from guilds/guildid/bounties
            let guildID = message.guild.id;

            if (c.includes('all')) {
                let guildRef = db.ref('guilds/' + guildID + '/bounties');

                guildRef.once('value', function (snapshot) {
                    let bounties = snapshot.val();
                    if (bounties) {
                        Object.keys(bounties).forEach(function (key) {
                            let bounty = bounties[key];
                            bounty.id = key;
                            bountyList.push(bounty);
                        });
                    }
                    let resp = formatBounties(message, bountyList)
                    message.channel.send({
                        embed: {
                            title: 'Available Bounties',
                            description: resp,
                            color: 0x00ff00
                        }
                    })
                });
            }

            if (c.includes('active')) {
                let guildRef = db.ref('guilds/' + guildID + '/bounties');

                guildRef.once('value', function (snapshot) {
                    let bounties = snapshot.val();
                    if (bounties) {
                        Object.keys(bounties).forEach(function (key) {
                            let bounty = bounties[key];
                            if (bounty.active) {
                                bountyList.push(bounty);
                            }
                        });
                    }
                    if (bountyList.length > 0) {
                        // Loop over each bounty in the list and make a proper message with the list
                        let bountyMessage = '```';
                        bountyList.forEach(function (bounty) {
                            bountyMessage += `${bounty.type} - ${bounty.skill} - ${bounty.rewardAmount} ${bounty.rewardCurrency}\n`;
                        });
                        bountyMessage += '```';
                        message.channel.send(bountyMessage);
                    } else {
                        message.channel.send('There are no active bounties.');
                    }
                });
            }


        }
        if (c.includes('submit')) {

            // A bounty should have a type, a skill, and a reward
            let newBounty = {
                "type": "bounty",
                "skill": "",
                "reward": "",
                "status": "active",
                "active": true,
                "submittedBy": message.author.username,
                "playerId": parseInt(message.author.id),
                "submittedAt": moment().format('MMMM Do YYYY, h:mm:ss a')
            }

            // Check if the message has a skill
            if (c.includes('skill')) {
                let skill = c.split('skill ')[1];
                // Remove anything after the skill
                skill = skill.split(' ')[0];
                newBounty.skill = skill;
            }

            // Check if the message has a reward
            if (c.includes('reward')) {
                let reward = c.split('reward ')[1];
                // Remove anything after the reward and before type
                reward = reward.split(' type ')[0];

                // Find the integer in the string
                let rewardInt = reward.match(/\d+/g);
                // Find the currency type in the string
                let rewardType = reward.split(' ')[reward.split(' ').length - 1];
                newBounty.rewardAmount = parseInt(rewardInt[0]) || 0;
                newBounty.rewardCurrency = rewardType
                newBounty.reward = reward;
            }

            // Check if the message has a type
            if (c.includes('type')) {
                let type = c.split('type ')[1];
                newBounty.type = type;
            }

            console.log('newBounty', newBounty);

            // A total bounty should have a skill, a reward, and a type and be typed like this
            // gsb bounty submit skill <skill> reward <reward> type <type>

            // An example for a bounty that has a skill for React, and a reward for 100 HYPE and a Code type
            // gsb bounty submit skill React reward 100 HYPE type Code

            // Add it to the database under guilds/<guildID>/bounties/<bountyID>
            let db = admin.database();

            // Get the guild ID
            let guildID = message.guild.id;

            // Get the guild's bounties
            let guildBounties = db.ref('guilds/' + guildID + '/bounties');

            // Add the bounty
            guildBounties.push(newBounty);

            // Send a message to the channel
            message.channel.send('Bounty added!');

        }

        // Claiming bounties
        if (c.includes('claim')) {
            let bounty = c.split(' ')[2];

            // Everything after !bounty claim
            let bountyId = bounty.split(' ')[0];
            let bountyRef = db.ref('guilds/' + message.guild.id + '/bounties/-' + bountyId);

            // Get the bounty
            bountyRef.once('value', function (snapshot) {
                let bounty = snapshot.val();
                if (bounty) {
                    if (bounty.status === 'active') {
                        // Check if the user has the skill
                        let playerRef = db.ref('guilds/' + message.guild.id + '/players/' + message.author.id);

                        playerRef.once('value', function (snapshot) {
                            let player = snapshot.val();

                            let hasSkill = false;

                            // Get the skill tree from the user
                            let skillRef = db.ref('users/' + message.author.id + '/skills');

                            skillRef.once('value', function (snapshot) {
                                // Get the skill tree
                                let skillTree = snapshot.val();
                                console.log('skillTree', skillTree);

                                // Loop over all skills and find by skill name
                                if (skillTree) {
                                    Object.keys(skillTree).forEach(function (key) {
                                        let skill = skillTree[key];
                                        if (skill.name === bounty.skill) {
                                            hasSkill = true;
                                        }
                                    })
                                };

                                // If the user has the skill, then claim the bounty
                                if (hasSkill) {
                                    // Update the bounty status
                                    bountyRef.update({
                                        "status": "claimed",
                                        "claimedBy": message.author.username,
                                        "claimedAt": moment().format('MMMM Do YYYY, h:mm:ss a')
                                    });

                                    // Update the player's currency


                                    // Send a message to the channel
                                    message.channel.send('Bounty claimed!');
                                }
                            });

                        });
                    } else if (bounty.status === 'claimed') {
                        message.channel.send('Bounty already claimed!');
                    }
                }
            });
        }

        if (c.includes('commit')) {
            let bounty = c.split(' ')[2];
            let bountyMessage = message.content.split(' ').slice(3).join(' ');
            let bountyMessageEmbed = {
                "title": 'Bounty Commit',
                "description": bountyMessage,
                "color": 0x00ff00,
                "image": {
                    "url": 'https://i.imgur.com/XqQZQZS.png',
                },
            }
            message.channel.send({ embed: bountyMessageEmbed });
            console.log(bounty, bountyMessage);
        }

        if (c.includes('complete')) {
            let bounty = c.split(' ')[2];
            let bountyMessage = message.content.split(' ').slice(3).join(' ');
            let bountyMessageEmbed = {
                "title": 'Bounty Complete',
                "description": bountyMessage,
                "color": 0x00ff00,
                "image": {
                    "url": 'https://i.imgur.com/XqQZQZS.png',
                },
            }
            message.channel.send({ embed: bountyMessageEmbed });
            console.log(bounty, bountyMessage);
        }

        if (c.includes('collect')) {
            let bounty = c.split(' ')[2];
            let bountyMessage = message.content.split(' ').slice(3).join(' ');
            let bountyMessageEmbed = {
                "title": 'Bounty Collect',
                "description": bountyMessage,
                "color": 0x00ff00,
                "image": {
                    "url": 'https://i.imgur.com/XqQZQZS.png',
                },
            }
            message.channel.send({ embed: bountyMessageEmbed });
            console.log(bounty, bountyMessage);
        }
    }

    // Skills
    let c = command;
    let db = firebase.database();
    if (c.includes('!skill')) {
        if (c.length == 6) {
            message.channel.send({
                embed: {
                    title: 'Welcome to the Skill Engine for ' + message.guild.name,
                    description:
                        `You can use the following commands to interact with the Skill Engine:\n\n` +
                        `!skill new <skill>\n` +
                        `!skill list \n` +
                        `!skill train <skill> \n` +
                        `!skill get <player> \n`,

                    color: 0x00ff00
                }
            })
        }
        // If no arguments are given, show w
        if (c.includes('!skill new')) {
            let skillName = c.split('!skill new ')[1];


            // Add the skill to the user
            let userRef = db.ref('users/' + message.author.id + '/skills');
            userRef.push({
                name: skillName,
                level: 1,
                xp: 0
            });

            message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: 'New Skill',
                    description: `${message.author.username} has created a new skill called ${skillName}`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Gatekeeper'
                    }
                }
            });

        }

        if (c.includes('!skill list')) {
            let userRef = db.ref('users/' + message.author.id + '/skills');
            userRef.once('value', function (snapshot) {
                let skills = snapshot.val();
                let skillList = '';

                for (let skill in skills) {
                    skillList += `${skills[skill].name} - lvl ${skills[skill].level || 0} - exp ${skills[skill].xp || 0}\n`;
                }

                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `${message.author.username}'s Skills`,
                        description: skillList,
                        timestamp: new Date(),
                        footer: {
                            text: 'Gatekeeper'
                        }
                    }
                });
            })
        }

        if (c.includes('!skill train')) {
            // Get the skill name
            let skillName = c.split('!skill train ')[1];

            let skill = null;

            // Get the skill object
            let userRef = db.ref('users/' + message.author.id + '/skills');
            userRef.once('value', function (snapshot) {
                let skills = snapshot.val();


                for (let skill in skills) {
                    if (skills[skill].name === skillName) {
                        // Add xp to the skill
                        skills[skill].xp += 1;

                        // Check if the skill has leveled up
                        if (skills[skill].xp >= (skills[skill].level * 10)) {
                            skills[skill].level += 1;
                        }

                        // Update the skill
                        userRef.child(skill).update(skills[skill]);

                        // Send the message
                        message.channel.send({
                            embed: {
                                color: 0x0099ff,
                                title: 'Skill Trained',
                                description: `${message.author.username} has trained ${skillName}`,
                                timestamp: new Date(),
                                footer: {
                                    text: 'Gatekeeper'
                                }
                            }
                        });
                    }
                }


            })

        }
        if (c.includes('!skill get')) {
            // Get a users skill by their @
            let accountName = c.split('!skill get ')[1];

            // Get the user id fom the account name
            let userID = accountName.match(/<@!?(\d+)>/);

            // Get the user object
            let user = bot.users.cache.get(userID[1]);


            // Get the skill object
            let userRef = db.ref('users/' + userID[1] + '/skills');
            userRef.once('value', function (snapshot) {
                let skills = snapshot.val();
                let skillList = '';

                for (let skill in skills) {
                    skillList += `${skills[skill].name} - lvl ${skills[skill].level || 0} - exp ${skills[skill].xp || 0}\n`;
                }

                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `${user.username}'s Skills`,
                        description: skillList,
                        timestamp: new Date(),
                        footer: {
                            text: 'Gatekeeper'
                        }
                    }
                });
            })
        }



    }

    // Players
    if (c.includes('!player')) {
        if (c.includes('join')) {
            // Get the list of discord users and add them to the guild with a set
            let guildRef = db.ref('guilds/' + message.guild.id + '/players');
            // Create a player
            let player = {
                level: 1,
                xp: 0,
                name: message.author.username
            };

            // Set the playerId as the player
            guildRef.child(message.author.id).set(player);

            message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: `${message.author.username} has joined the server`,
                    description: ``,
                    timestamp: new Date(),
                    footer: {
                        text: 'Gatekeeper'
                    }
                }
            });
        }
        if (c.includes('list')) {
            // Get the list of discord users and add them to the guild with a set
            let guildRef = db.ref('guilds/' + message.guild.id + '/players');
            guildRef.once('value', function (snapshot) {
                let players = snapshot.val();
                let playerList = '';

                for (let player in players) {
                    playerList += `${players[player].name} - lvl ${players[player].level || 0} - exp ${players[player].xp || 0}\n`;
                }

                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `Players in ${message.guild.name}`,
                        description: playerList,
                        timestamp: new Date(),
                        footer: {
                            text: 'Gatekeeper'
                        }
                    }
                });
            })
        }
    }

    // Check if the Discord user is in Firebase under users

    if (c.includes('!crypto')) {
        // Welcome to the crypto commmand list
        if (c === '!crypto') {
            message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: 'Crypto Command List',
                    description: `!crypto buy <crypto> - Buy a crypto currency\n!crypto sell <crypto> - Sell a crypto currency\n!crypto list - List your crypto currencies\n!crypto get <@> - Get a users crypto currencies`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Gatekeeper'
                    }
                }
            });
        }
        if (c.includes('buy')) {
        }
        if (c.includes('sell')) {
        }
        if (c.includes('list')) {
        }
    }

    if (c.includes('!accounts')) {
        // Tatum virtual accounts
        // Check the account for the user
        if (c.includes('list')) {
            // Get the accounts for the user
            let accountRef = db.ref('users/' + message.author.id + '/accounts');
            accountRef.once('value', function (snapshot) {
                let accounts = snapshot.val();
                let accountList = '';

                if (accounts) {
                    for (let account in accounts) {
                        accountList += `${accounts[account].name} - ${accounts[account].balance || 0}\n`;
                    }
                } else {
                    accountList = 'You have no accounts';
                }


                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `${message.author.username}'s Accounts`,
                        description: accountList,
                        timestamp: new Date(),
                        footer: {
                            text: 'Gatekeeper'
                        }
                    }
                });
            })
        }

        if (c.includes('update customerCountry')) {
            // Get the country name
            let countryName = c.split('!accounts update countryName ')[1];

            // Get the account for the user
            let accountRef = db.ref('users/' + message.author.id + '/accounts');
            accountRef.once('value', function (snapshot) {
                let accounts = snapshot.val();
                let account;
                Object.keys(accounts).forEach(function (key) {
                    account = key
                });

                axios.post('http://localhost:4444/customer/update', {
                    customerId: account,
                    payload: {
                        customerCountry: countryName
                    }
                }).then(function (response) {
                    console.log(response.data);
                    message.channel.send({
                        embed: {
                            color: 0x0099ff,
                            title: `${message.author.username}'s Accounts`,
                            description: `Account ${account} has been updated`,
                            timestamp: new Date(),
                            footer: {
                                text: 'Gatekeeper'
                            }
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                })
            })
        }
        if (c.includes('update accountingCurrency')){
            console.log('test')
            // Get the currency
            let currency = c.split('!accounts update accountingCurrecy ')[1];

            // Get the account for the user
            let accountRef = db.ref('users/' + message.author.id + '/accounts');
            accountRef.once('value', function (snapshot) {
                let accounts = snapshot.val();
                let account;
                Object.keys(accounts).forEach(function (key) {
                    account = key
                });

                axios.post('http://localhost:4444/customer/update', {
                    customerId: account,
                    payload: {
                        accountingCurrency: currency
                    }
                }).then(function (response) {
                    console.log(response.data);
                    message.channel.send({
                        embed: {
                            color: 0x0099ff,
                            title: `${message.author.username}'s Accounts`,
                            description: `Account ${account} has been updated`,
                            timestamp: new Date(),
                            footer: {
                                text: 'Gatekeeper'
                            }
                        }
                    });
                }).catch(function (error) {
                    console.log(error);
                })
            })
        }
        if (c.includes('add')) {
            // Add the Virtual Account customer ID from tatum
            let accountName = c.split('!accounts add ')[1];
            let accountRef = db.ref('users/' + message.author.id + '/accounts');
            let account = {
                name: accountName,
                balance: 0
            };

            accountRef.child(accountName).set(account);

            message.channel.send({
                embed: {
                    color: 0x0099ff,
                    title: `${message.author.username}'s Accounts`,
                    description: `${accountName} has been added to your accounts`,
                    timestamp: new Date(),
                    footer: {
                        text: 'Gatekeeper'
                    }
                }
            })
        }

        if (c.includes('!accounts get')) {
            // Get the account for the user
            let accountName = c.split('!accounts get ')[1];

            // Make an API request to localhost:4444/accounts/list with the object customerId:
            axios.post('http://localhost:4444/accounts/list', {
                customerId: accountName
            }).then(function (response) {
                let messageText = '';
                let accounts = response.data;
                if (accounts.length > 0) {

                    accounts.forEach(function (account) {
                        console.log(account.balance);
                        messageText += `${account.currency} - ${account.id} - Balance: ${account.balance.accountBalance} ${account.currency}\n`;
                    })
                } else {
                    messageText = 'You have no accounts';
                }

                message.channel.send({
                    embed: {
                        color: 0x0099ff,
                        title: `${message.author.username}'s Accounts`,
                        description: messageText,
                        timestamp: new Date(),
                        footer: {
                            text: 'Gatekeeper'
                        }
                    }
                });

            })

        }
        if (c.includes('deposit')) {
            let address = c.split('!accounts deposit ')[1];
            let messageText = '';
            // Make an API get request with axios to localhost:4444/accounts/get-deposit-address/${address} 
            axios.get('http://localhost:4444/accounts/get-deposit-address/' + address).then(function (response) {
                if (response.data) {
                    if (response.data.length > 0) {
                        messageText = `${response.data[0].currency} - ${response.data[0].address}`;
                    }
                    message.channel.send({
                        embed: {
                            color: 0x0099ff,
                            title: messageText,
                            description: `This is the deposit account for ${address}`,
                            timestamp: new Date(),
                            footer: {
                                text: 'Gatekeeper'
                            }
                        }
                    });
                } else {
                    message.channel.send({
                        embed: {
                            color: 0x0099ff,
                            title: `Deposit account for address`,
                            description: 'No accounts found',
                            timestamp: new Date(),
                            footer: {
                                text: 'Gatekeeper'
                            }
                        }
                    });
                }
            })

            
        }
    }

    if (c.includes('!erc')) {
        // Welcome to the nft commmand list
        if (c === '!20') {

        }
        if (c === '!721') {

        }
        if (c === '!1155') {

        }
    }

}

// Misc
function createGame(message, payload) {

    // get words after start
    let words = payload.split(' ') || [];
    let game_name = words[1];
    // Add the game to the guilds database
    var db = admin.database();
    const ref = db.ref('guilds/' + message.guild.id + '/games').push().set({
        game_name: game_name || '',
        game_creator_id: message.author.id,
        game_creator: message.author.username,
        game_status: 'Open',
        game_payload: payload,
        game_type: 'Trios',
    });
}

const useCharacter = (characterType, message, c) => {
    // Get the words after !sniper
    let words = c.split(' ') || [];
    let payload = {
        "character": characterType,
        "words": words,
        "command": c,
        "user": message.author.username,
    }

    // Post the message to the firebase 
    var db = admin.database();
    const ref = db.ref(characterType).push().set(payload);

    // Get the text from the message
    let text = message.content;

    // split and slice the text and remove the first 2 words
    let textArray = text.split(' ').slice(2).join(' ');

    // Set the text to be "Testing

    // Notify the channel that the sniper has been detected
    message.channel.send({
        embed: {
            color: 0x0099ff,
            title: `${textArray}`,
            description: `Cast by ${message.author.username} . Check logs for more information`,
            timestamp: new Date(),
            footer: {
                icon_url: message.author.avatarURL,
                text: '1 $HYPE'
            }
        }
    });

}
function showOpenGames(message) {
    // Get the current guilds database
    var db = admin.database();
    const ref = db.ref('guilds/' + message.guild.id + '/games');

    let descriptionText = '';

    // Get the games from the database
    ref.once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            var childKey = childSnapshot.key;
            var childData = childSnapshot.val();

            // Add the time created, id, and name of the person who created the game
            if (childData.game_status == 'Open') {
                descriptionText += `${childKey} created by ${childData.game_creator} \n`;

            }
        });

        // Send the message to the channel
        message.channel.send({
            embed: {
                color: 0x0099ff,
                title: `Open Games`,
                description: `${descriptionText}`,
                timestamp: new Date(),
                footer: {
                    icon_url: message.author.avatarURL,
                    text: '1 $HYPE'
                }
            }
        });
    });
}

// Create a new record in a google sheet with a url and a name
const vaultLink = (c) => {
    const url = 'test';
    const name = 'text';
    const data = {
        "values": [
            [name, url]
        ]
    }

    // Use Axios to post the data to the google sheet
    axios.post(`https://sheets.googleapis.com/v4/spreadsheets/${config.vault}/values/Sheet1!A1:B1:append?valueInputOption=USER_ENTERED&key=${config.googleAPIKey}`, data)
        .then(res => console.log('success', res))
        .catch(err => console.log('error', err))

}



// Caster commands
const caster = (message, command) => {

    // Check if caster used the word 'Cast'
    if (command.includes('cast')) {
        // Check if caster used the word 'Spell'
        if (command.includes('summon')) {
            // Check if caster used the word 'Vault'
            if (command.includes('forgemaster')) {

                // Send an embed to summon the forgmaster
                message.channel.send({
                    embed: {
                        title: 'Forgemaster',
                        description: 'Summoning the Forgemaster',
                        color: 0x00ff00
                    }
                })
            }
        } else if (command.includes('triangulate')) {
            // Check if caster used the word 'Vault'
            if (command.includes('vault')) {
                // Send an embed to summon the vault
                message.channel.send({
                    embed: {
                        title: 'Vault',
                        description: 'Summoning the Vault',
                        color: 0x00ff00
                    }
                })
            }
        }
    }
}

// Lancer commands
const lancer = (message, command) => {

    if (message.content.includes('initiate')) {

        message.channel.send({
            files: ['https://c.tenor.com/MN-P1lMHuYcAAAAC/diarmuid-ua-duibhne-fate.gif']
        })

        // If includes broadcast
        if (command.includes('broadcast')) {
            // Send an embed to broadcast the federation
            message.channel.send({
                embed: {
                    title: 'Broadcasting to the Federation',
                    description: 'Live stream, multiplayer, p2p, and VC features enabled to external listeners',
                    color: 0x00ff00
                }
            })
        }
    }

    if (message.content.includes('beast mode')) {
        message.channel.send({
            files: ['https://c.tenor.com/dLERkhJZBhQAAAAS/gae-bolg-fate.gif']
        })

    }

}

// Berserker commands
const berserker = (message, command) => {

    if (message.content.includes('tcg')) {

        if (message.content.includes('new')) {
            // Add to the database
            var db = admin.database();
            const ref = db.ref('tcg').push().set({
                "user": message.author.username,
                "command": message.content
            });

        }
    }

    if (message.content.includes('forge')) {
        if (debug) {
            console.log(chalk.cyanBright('Forge detected'));
        }

        // Get the 4th word in the command which is the url
        let url = command.split(' ')[4];

        if (debug) {
            console.log('url', url)
        }


        if (!url) {
            message.channel.send('You need to provide a payload to forge.');
            return;
        }

        // Send an embed to forge the url
        message.channel.send({
            embed: {
                title: 'Forge',
                description: `Forge the payload: ${url}`,
                color: 0x00ff00
            }
        })

    } else {
        // message.channel.send('No command matched')
    }
}

// Gatekeeper commands
const gatekeeper = (message, command) => {
    message.channel.send('Gatekeeper detected');
}

// Archer commands
const archer = (message, command) => {
    message.channel.send('Archer detected');
}


// Formatting for bounties
const formatBounties = (message, bountyList) => {
    let bountyMessage = '';
    if (bountyList.length > 0) {
        bountyList.forEach(bounty => {
            bountyMessage += `${bounty.rewardAmount} ${bounty.rewardCurrency} - ${bounty.skill} - ${bounty.id}\n`
        })
    } else {
        bountyMessage = 'No bounties found.';
    }
    return bountyMessage;
}