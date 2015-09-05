if Rails.env.production?
  CarrierWave.configure do |config|
    config.fog_credentials = {
      # Configuration for Amazon S3
      :provider              => 'AWS',
      :aws_access_key_id     => ENV['AKIAJQF2Q74KYRRBYZUQ'],
      :aws_secret_access_key => ENV['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']
    }
    config.fog_directory     =  ENV['gamesbookfiles']
  end
end