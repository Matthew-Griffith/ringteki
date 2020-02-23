const DrawCard = require('../../drawcard.js');
const { Players, TargetModes, CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class RampartsOfStone extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Attacker bows participating characters or discards three cards from hand',
            condition: context => context.game.isDuringConflict(),
            targets: {
                select: {
                    mode: TargetModes.Select,
                    player: (context) => {
                        if(context.player.isAttackingPlayer()) {
                            return Players.Self;
                        }
                        return Players.Opponent;
                    },
                    choices: {
                        'Bow all participating characters': AbilityDsl.actions.bow((context) => ({
                            target: context.targets.select.player.filterCardsInPlay(card => card.getType() === CardTypes.Character && card.isParticipating())
                        })),
                        'Discard three cards from hand': AbilityDsl.actions.chosenDiscard({amount: 3})
                    }
                }
            }
        });
    }
}

RampartsOfStone.id = 'ramparts-of-stone';

module.exports = RampartsOfStone;