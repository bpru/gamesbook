class Spaceship < ActiveRecord::Base
    belongs_to :user
    validates :user_id, presence: true
    validates :score, presence: true
end
