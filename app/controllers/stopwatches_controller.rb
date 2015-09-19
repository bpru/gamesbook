class StopwatchesController < ApplicationController
    def index
        @stopwatches = Stopwatch.paginate(page: params[:stopwatches_page], per_page: 5)
        if logged_in?
            @user_stopwatches = current_user.stopwatches.paginate(page: params[:user_stopwatches_page], per_page: 5)
        end
    end
    def create
        @stopwatch = current_user.stopwatches.create(stopwatch_params);
        redirect_to stopwatch_path
    end
    
    private

        def stopwatch_params
            params.require(:stopwatch).permit(:score, :total_try)
        end
end
