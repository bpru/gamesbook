class MemoriesController < ApplicationController
    
    def index
        # @memories = Memory.all
        @memories = Memory.paginate(page: params[:all], per_page: 5)
        if logged_in?
            @user_memories = current_user.memories.paginate(page: params[:user], per_page: 5)
        end
    end
    
    def create
        @memory = current_user.memories.create(memory_params);
        redirect_to memory_path
        # respond_to do |format|
        #     format.html
        #     format.js
    end
    
    private

        def memory_params
            params.require(:memory).permit(:score)
        end
    
end
