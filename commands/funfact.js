/** ScottyMd — .funfact category facts © ScottyMd by Scotty */
const CATS = {
    animal: ['A group of flamingos is called a flamboyance.','Elephants are the only animals that can\'t jump.','A snail can sleep for 3 years.','Cats have 32 muscles in each ear.'],
    space: ['One day on Venus is longer than one year on Venus.','Neutron stars spin 600 times per second.','The Sun makes up 99.86% of the solar system\'s mass.','There are more stars than grains of sand on Earth.'],
    human: ['Your body has enough iron to make a 3-inch nail.','Humans share 50% of their DNA with bananas.','The human brain uses 20% of the body\'s total energy.','You produce 1-2 liters of saliva every day.'],
    tech: ['The first computer bug was an actual bug — a moth.','The QWERTY keyboard was designed to slow typists down.','The first website is still online at info.cern.ch.','Email existed before the World Wide Web.'],
};
async function funfactCommand(sock, chatId, message, args) {
    const cat = args[0]?.toLowerCase();
    const facts = CATS[cat] || [...Object.values(CATS).flat()];
    const fact  = facts[Math.floor(Math.random()*facts.length)];
    await sock.sendMessage(chatId, { text: `🤩 *Fun Fact!*\n\n${fact}\n\nCategories: animal, space, human, tech\n_© ScottyMd_` }, { quoted: message });
}
module.exports = funfactCommand;
