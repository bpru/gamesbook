//=require_tree ./game_helpers

$(document).ready(function() {  
    // $('body').css("background-image", "url('/assets/poker_cards.png')");
    // set canvas                     
    var canvas = $("#canvas");
    canvas.css("background-color", "green");
	var ctx = canvas[0].getContext("2d");
	
    // constants
    var WIDTH = canvas[0].width;
    var HEIGHT = canvas[0].height;
    var CARD_SIZE = [72, 96];
    var card_width = CARD_SIZE[0];
    var card_height = CARD_SIZE[1];
    var CARD_CENTER = [36, 48];
    var SUITS = ['C', 'S', 'H', 'D'];
    var RANKS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];
    var VALUES = {'A':1, '2':2, '3':3, '4':4, '5':5, '6':6, '7':7, '8':8, '9':9,
                                                'T':10, 'J':10, 'Q':10, 'K':10};
    var cards_start_pos_x = WIDTH/2 - 2 * card_width;
    // game status
    var in_play = false;
    var started = false;
    var msg = "Welcome!";
    var player = new Hand();
    var dealer = new Hand();
    var deck = new Deck();
    // var bank = $("#bank").html();
    var bet = 10;
    
    
	
    
    
    // set images
    var cards = new Image();
    var cards_back = new Image();
    cards.src = "http://storage.googleapis.com/codeskulptor-assets/cards_jfitz.png";
    cards_back.src = 'http://storage.googleapis.com/codeskulptor-assets/card_jfitz_back.png';
    // var cards = $("#cards")[0];
    // var cards_back = $("#cards_back")[0];

    // set button handlers
	$("#btn_deal").click(deal);
	$("#btn_hit").click(hit);
	$("#btn_stand").click(stand);
	$("#btn_reset").click(reset);
	
	var frame = create_frame();
	frame.set_draw_handler(draw);
	frame.start();
	

    // classes
    function Card(rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.get_suit = function() {return this.suit;};
        this.get_rank = function() {return this.rank;};
        this.draw = function(posX, posY) {
            ctx.drawImage(cards, card_width * RANKS.indexOf(this.rank), card_height * SUITS.indexOf(this.suit), 
            card_width, card_height, posX, posY, card_width, card_height);
        };
    }
    
    function Hand() {
        this.collection = [];
        this.add_card = function(card) {this.collection.push(card);};
        this.get_val = function() {
            var val = 0;
            var has_ace = false;
            for (var i = 0; i < this.collection.length; i++) {
                var cur_card = this.collection[i];
                val += VALUES[cur_card.get_rank()];
                if (cur_card.get_rank() == "A") {has_ace = true;}
            }
            if (val <= 11 && has_ace) {val += 10;}
            return val;
        };
        this.draw = function(x, y) {
            for (var i = 0; i < this.collection.length; i++) {
                var cur_card = this.collection[i];
                cur_card.draw(x + i * card_width, y);
            }
        };
    }
    function Deck() {
        this.collection = [];
        this.init = function() {
            for (var i = 0; i < SUITS.length; i++) {
                
                for (var j = 0; j < RANKS.length; j++) {
                    var card = new Card(RANKS[j], SUITS[i]);
                    this.collection.push(card);
                }
            }
        };
        this.shuffle = function() {
            for (var i =0; i < this.collection.length; i++) {
		    var randomIdx = Math.floor(Math.random() * (this.collection.length - i)) + i;
		    var tmp = this.collection[i];
		    this.collection[i] = this.collection[randomIdx];
		    this.collection[randomIdx] = tmp;
	        }
        };
        this.deal_card = function() {return this.collection.pop();}
        this.init();
        this.shuffle();
    }
    
    // buntton handlers
    function deal() {
        bet = parseInt($("#bet_value").html());
        started = true;
       
        if (bet > bank) {
            alert("You don't have enough money");
            return;
        }
        bank -= bet;
        
        
        // if (in_play) {bank -= bet;}
        dealer = new Hand();
        player = new Hand();
        deck = new Deck();
        for (var i = 0; i < 2; i++) {
            dealer.add_card(deck.deal_card());
            player.add_card(deck.deal_card());
        }
        in_play = true;
        if (player.get_val() == 21){
            setTimeout(function() {
                alert("Congratulation! YOU'VE GOT BLACKJACK");
                bank += bet/2;
                $("#btn_stand").trigger("click");
            }, 100);
        }
    };
    
    function hit() {
        if (in_play) {
            player.add_card(deck.deal_card());
            if (player.get_val() > 21) {
                msg = "BURSTED, YOU LOSE!!! NEW DEAL?";
                in_play = false;
                // bank -= bet;
                save();
            } else if (player.collection.length >= 5) {
                setTimeout(function() {
                    alert("FIVE CARD CHARLIE!!!");
                    bank += bet;
                    bank += 2 * bet;
                    save();
                    $("#btn_deal").trigger("click");
                }, 100);
            }
        }
    }
    
    
    
    function reset() {
        bank = 500;
        save();
    }
    
    function stand() {
        if (in_play) {
            while (dealer.get_val() < 17) {dealer.add_card(deck.deal_card());}
            var dealer_score = dealer.get_val();
            in_play = false;
            if (dealer_score <= 21 && dealer_score > player.get_val()) {
                // bank -= bet;
                msg = "YOU LOSE...NEW DEAL?";
            } else if (dealer_score == player.get_val()) {
                msg = "TIE, ONE MORE?";
                bank += bet;
            } else {
                bank += 2 * bet;
                msg = "YOU WIN!!! NEW DEAL?";
            }
            save();
        }
    }
    
   function draw() {
        ctx.clearRect(0, 0, canvas[0].width, canvas[0].height);
        var next_bet = parseInt($("#bet_value").html());
        if (!started) {
            // display welcome message
        	ctx.font = "40px Comic Sans MS";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Welcome!", canvas[0].width/2, 50);
            
            ctx.font = "18px Comic Sans MS";
            
            ctx.fillText("Get a total value higher than dealer's but no more than 21", canvas[0].width/2, 125);
            ctx.fillText("Dealer has to get value higher than 17 to end the play", canvas[0].width/2, 150);
            ctx.fillText("Face cards have value of 10", canvas[0].width/2, 175);
            ctx.fillText("Ace has value of 1 or 11", canvas[0].width/2, 200);
            
            ctx.fillText("Get 21 points with the first 2 cards to win 50% more bet back", canvas[0].width/2, 275);
            ctx.font = "24px Comic Sans MS";
            ctx.fillText("BLACKJACK:", canvas[0].width/2, 250);
            ctx.fillText("To win the play:", canvas[0].width/2, 100);
            
            
            
            ctx.font = "20px Comic Sans MS";
            ctx.fillText('Press "Deal" to start a new play' , canvas[0].width/2, 325);
            ctx.fillText('Press "Hit" to get another card from deck' , canvas[0].width/2, 350);
            ctx.fillText('Press "Stand" to stay with current cards', canvas[0].width/2 , 375);
            ctx.fillText('Press "Reset Bank" to reset your bank to $500', canvas[0].width/2 , 400);
            ctx.fillText('Use scroller to set money for next bet' , canvas[0].width/2, 425);
            
            
            ctx.font = "18px Comic Sans MS";
            ctx.fillText('Chips: $' + bank, 60, canvas[0].height - 10);
            ctx.fillText('Next Bet: $' + next_bet, canvas[0].width - 80, canvas[0].height - 10);
        } else {
            if (in_play) {msg = "HIT or STAND?";}
            ctx.font = "24px Comic Sans MS";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText(msg, canvas[0].width/2, 50);
            dealer.draw(cards_start_pos_x, 100);
            if (in_play) {ctx.drawImage(cards_back, 0, 0, card_width, card_height,
                                        cards_start_pos_x, 100, card_width, card_height);}
            else {ctx.fillText("Dealer: " + dealer.get_val(), canvas[0].width/2, 250);}
            player.draw(cards_start_pos_x, 300);
            ctx.fillText("Player: " + player.get_val(), canvas[0].width/2, 450);
            ctx.font = "18px Comic Sans MS";
            ctx.fillText('Chips: $' + bank, 60, canvas[0].height - 10);
            ctx.fillText('Bet: $' + bet, 60, canvas[0].height - 50);
            ctx.fillText('Next Bet: $' + next_bet, canvas[0].width - 80, canvas[0].height - 10);
        }
    }
    
    function save() {
        if (logged_in) {
            $.ajax({url: '/blackjacks/' + blackjack_id,  data: {blackjack: {score: bank}}, method: 'patch'} );
        }
    }
    // function create() {
    //     $.post('/blackjacks', {blackjack: {score: bank}});
    // }
});

function set_bet(value) {
        $("#bet_value").html(value);
    }