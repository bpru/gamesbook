class BlackjacksController < ApplicationController
  def index
    @blackjacks = Blackjack.paginate(page: params[:blackjacks_page], per_page: 5)
  end

  def create
    @blackjack = current_user.create_blackjack(blackjack_params)
    redirect_to blackjack_path
  end

  def update
    current_user.blackjack.update_attributes(blackjack_params)
    redirect_to blackjack_path
  end
  
  private

        def blackjack_params
            params.require(:blackjack).permit(:score)
        end
end
