class Spaceship < ActiveRecord::Base
    belongs_to :user
    default_scope -> { order(score: :desc) }
    validates :user_id, presence: true
    validates :score, presence: true
end
