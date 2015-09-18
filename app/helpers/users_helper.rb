module UsersHelper

  # Returns the Gravatar for the given user.
  def gravatar_for(user, options = { size: 80 })
    size = options[:size]  
    if user.use_gravatar?
      # gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
      # gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}&d=mm"
      image_tag(gravatar_url(user, {size: size}), alt: user.name, class: "gravatar img-rounded")
    else
      image_tag user.picture.url, size: "#{size}", alt: "No Img", class: "img-rounded"
    end
  end
  
  def gravatar_url(user, options = {size: 80})
    size = options[:size]
    gravatar_id = Digest::MD5::hexdigest(user.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}?s=#{size}&d=mm"
  end
    
end