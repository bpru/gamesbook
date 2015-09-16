class SpaceshipsController < ApplicationController
    def index
        @spaceships = Spaceship.paginate(page: params[:spaceships_page], per_page: 5)
        if logged_in?
            @user_spaceships = current_user.spaceships.paginate(page: params[:user_spaceships_page], per_page: 5)
        end
    end
    def create
        @spaceship = current_user.spaceships.create(spaceship_params);
        redirect_to spaceship_path
    end
    
    private
        def spaceship_params
            params.require(:spaceship).permit(:score)
        end
end
