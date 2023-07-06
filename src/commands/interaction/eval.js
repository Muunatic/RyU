const { SlashCommandBuilder } = require('@discordjs/builders');
const { inspect } = require('util');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('eval')
    .setDescription('Eval')
    .addStringOption(value =>
        value.setName('value')
        .setDescription('Eval value')
        .setRequired(true)
    ),
    async execute(interaction) {
        const args = interaction.options.get('value').value;
        if (interaction.user.id !== process.env.OWNERID) return interaction.reply(process.env.DEFAULT_ERROR);

        try {
            const result = await eval(args);
            let output = result;
            if (typeof result !== 'string') {
                output = inspect(result);
            }
            interaction.reply({content: output});
        } catch (error) {
            console.log(error);
            interaction.reply(process.env.DEFAULT_ERROR);
        }
    }
};
