class SessionsController < ApplicationController
  def new
    if logged_in?
      redirect_to root_url
    end
    session[:previous_page] = request.referer if request.get?
  end
  
  def create
    
    
    
    user = User.find_by(email: params[:session][:email].downcase)
    if user && user.authenticate(params[:session][:password])
      if user.activated?
        log_in user
        params[:session][:remember_me] == '1' ? remember(user) : forget(user)
        # back = session[:return_to]
        # session.delete(:return_to)
        # redirect_to back
        
        redirect_back_or root_url
        # redirect_to root_url
      else
        message  = "Account not activated."
        message += "Check your email for the activation link."
        flash[:warning] = message
        redirect_to root_url
      end
    else
      flash.now[:danger] = 'Invalid email/password combination'
      render 'new'
    end
  end

  def destroy
    log_out if logged_in?
    redirect_to root_url
  end
end
