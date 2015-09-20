class StaticPagesController < ApplicationController
  def home
    if logged_in?
      @return_url = nil
      if show_previous? and session[:previous_page] != "https://gamesbook-bpru.c9.io/"
        @return_url = session[:previous_page]
        session[:previous_page] = nil
      end
      
      @micropost = current_user.microposts.build if logged_in?
      @feed_items = current_user.feed.paginate(page: params[:page])
      
    end
  end

  def help
  end
  
  def about
  end
  
  def contact
  end
end
