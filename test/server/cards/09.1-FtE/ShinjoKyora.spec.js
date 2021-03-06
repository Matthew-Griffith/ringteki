describe('Shinjo Kyora', function() {
    integration(function() {
        describe('Shinjo Kyora\'s ability', function() {
            beforeEach(function() {
                this.setupTest({
                    phase: 'conflict',
                    player1: {
                        inPlay: ['shinjo-kyora','moto-youth'],
                        hand: ['four-temples-advisor']
                    },
                    player2: {
                        inPlay: ['shinjo-kyora']
                    }
                });
                this.shinjoKyoraP1 = this.player1.findCardByName('shinjo-kyora');
                this.shinjoKyoraP2 = this.player2.findCardByName('shinjo-kyora');
                this.advisor = this.player1.findCardByName('four-temples-advisor');
                this.noMoreActions();
                this.game.rings.fire.fate = 1;
            });

            it('should not work if she is not participating', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoKyoraP1);
                expect(this.player1).toHavePrompt('Conflict Action Window');
            });

            it('should work if she is participating', function() {
                this.initiateConflict({
                    attackers: [this.shinjoKyoraP1],
                    defenders: []
                });
                this.player2.pass();
                this.player1.clickCard(this.shinjoKyoraP1);
                expect(this.player1).toHavePrompt('Choose a ring');
            });

            it('should switch the contested ring', function() {
                this.initiateConflict({
                    attackers: [this.shinjoKyoraP1],
                    defenders: []
                });
                expect(this.game.currentConflict.ring.element).toBe('air');
                this.player2.pass();
                this.player1.clickCard(this.shinjoKyoraP1);
                this.player1.clickRing('void');
                expect(this.game.currentConflict.ring.element).toBe('void');
            });

            it('should give the fate from the chosen ring to the attacking player', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [this.shinjoKyoraP2]
                });
                let fateP1 = this.player1.fate;
                this.player2.clickCard(this.shinjoKyoraP2);
                this.player2.clickRing('fire');
                expect(this.player1.fate).toBe(fateP1 + 1);
            });

            it('should trigger reactions to gaining fate from rings', function() {
                this.initiateConflict({
                    attackers: ['moto-youth'],
                    defenders: [this.shinjoKyoraP2]
                });
                this.player2.pass();
                this.player1.playAttachment(this.advisor, 'moto-youth');
                let fateP1 = this.player1.fate;
                this.player2.clickCard(this.shinjoKyoraP2);
                this.player2.clickRing('fire');
                expect(this.player1.fate).toBe(fateP1 + 1);
                expect(this.player1).toHavePrompt('Triggered Abilities');
                expect(this.player1).toBeAbleToSelect(this.advisor);
                let hand = this.player1.hand.length;
                this.player1.clickCard(this.advisor);
                expect(this.player1.hand.length).toBe(hand + 1);
            });
        });
    });
});
