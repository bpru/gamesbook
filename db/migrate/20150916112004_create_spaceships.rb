class CreateSpaceships < ActiveRecord::Migration
  def change
    create_table :spaceships do |t|
      t.integer :score
      t.references :user, index: true, foreign_key: true

      t.timestamps null: false
    end
    add_index :spaceships, [:user_id, :created_at]
  end
end
