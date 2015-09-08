class CreateMemories < ActiveRecord::Migration
  def change
    create_table :memories do |t|
      t.integer :score
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :memories, [:user_id, :created_at]
  end
end
