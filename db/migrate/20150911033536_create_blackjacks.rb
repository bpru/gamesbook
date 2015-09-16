class CreateBlackjacks < ActiveRecord::Migration
  def change
    create_table :blackjacks do |t|
      t.integer :score
      t.references :user, index: true, foreign_key: true
      
      t.timestamps null: false
    end
    add_index :blackjacks, [:user_id, :created_at]
  end
end
