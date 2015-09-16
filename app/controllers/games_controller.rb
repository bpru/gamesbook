class GamesController < ApplicationController
    def index
    end
    def testing
    end
    def memory
    end
    def blackjack
        if logged_in? && current_user.blackjack.nil?
            current_user.create_blackjack(score:500)
        end
    end
    def stopwatch
    end
    def spaceship
    end
    
end
