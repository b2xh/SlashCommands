const Discord = require('discord.js');
const config = global.config = require('./config');
const fs = require('fs');
const mongodb = require('mongoose');


class Client extends Discord.Client {
    constructor() {
        super()
    }

    async start() {
        await this.login(config.token)
        await this.loadSlashCommands();
        await this.mongoDB();
        this.on("ready", async () => {
            this.user.setActivity(config.game.content, { type: config.game.type })
            console.log(this.user.tag)
        })
    }

    async loadSlashCommands() {
        this.commands = new Discord.Collection();
        this.on("ready", async () => {
            var folders = fs.readdirSync(`${__dirname}/commands`).filter(folder => folder.endsWith(".js"))
            for (var folder of folders) {
                var command = require(`${__dirname}/commands/${folder}`)
                var app = await this.api.applications(this.user.id).commands.get()

                app.forEach(element => {
                    this.api.applications(this.user.id).commands(element.id).delete()
                });
        
                await this.api.applications(this.user.id).commands.post({
                    data: {
                        name: command.config.name,
                        description: command.config.description,
                        options: command.config.options
                    }
                })
                this.commands.set(command.config.name, command)
                console.log(`The slash command named ${command.config.name} (commands/${folder}) has been successfully installed!`)
            }
        });

        this.ws.on("INTERACTION_CREATE", async (interaction) => {
            if(this.commands.has(interaction.data.name)) {
                try {
                    this.commands.get(interaction.data.name).run(interaction, this);
                } catch (error) {
                    console.log(error)
                }
            } else return;
        })
    }

    async mongoDB() {
        mongodb.connect(config.db, { useNewUrlParser: true,  useUnifiedTopology: true }).then(mongo => {
            console.log("Database connected!")
        })
    }
}


const sendMessage = global.sendMessage = async (interaction, content) => {
    var data = {
        content: content
    }
    await client.api.interactions(interaction.id, interaction.token).callback.post({
        data: {
            type: 4,
            data,
        },
    })
};

global.client = new Client()
client.start();