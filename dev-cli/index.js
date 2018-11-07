const verifiableCreds = require('./credentials');
const cli = require('caporal');
const figlet = require('figlet');

cli
    .version('0.0.1')
    .command('issue-credential', 'create a new credential template')
    // .argument('<recipient>', 'ethereum address of the recipient')
    // .argument('<amount>', 'amount of props to issue in earning')
    .action(async (args, options, logger) => {
        logger.info(`submitting issue credential transaction`);
        try {
            await verifiableCreds.issue("", "");
        } catch (e) {
            logger.error(`error creating template: ${e}`)
        }
    })
    .command('query-credentials', 'get some template(s) from the state')
    .argument('<stateaddress>', 'state address for query')
    .action(async (args, options, logger) => {
        try {
            await verifiableCreds.queryState(args.stateaddress);
        } catch (e) {
            logger.error(`error making state query: ${e}`)
        }
    });

const banner = figlet.textSync('BadgeForce-CLI', {
    font: 'slant',
    horizontalLayout: 'fitted',
    verticalLayout: 'default'
});

cli.description(`\n\n${banner}`);
cli.parse(process.argv);