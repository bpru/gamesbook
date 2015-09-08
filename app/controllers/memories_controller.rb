class MemoriesController < ApplicationController
    # @users = User.paginate(:page => params[:user_page], :per_page => 10)
    # @administrators = Administrator.paginate(:page => params[:administrator_page], :per_page => 10)

    def index
        # @memories = Memory.all
        @memories = Memory.paginate(page: params[:memories_page], per_page: 5)
        if logged_in?
            @user_memories = current_user.memories.paginate(page: params[:user_memories_page], per_page: 5)
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
