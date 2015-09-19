class CreateStopwatches < ActiveRecord::Migration
  def change
    create_table :stopwatches do |t|
      t.integer :score
      t.integer :total_try
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :stopwatches, [:user_id, :created_at]
  end
end
