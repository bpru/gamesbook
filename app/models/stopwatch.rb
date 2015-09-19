class Stopwatch < ActiveRecord::Base
    belongs_to :user
    default_scope -> { order(score: :desc, total_try: :asc) }
    validates :user_id, presence: true
    validates :score, presence: true
    validates :total_try, presence: true
end
