class Memory < ActiveRecord::Base
    belongs_to :user
    default_scope -> { order(:score) }
    validates :user_id, presence: true
    validates :score, presence: true
end
