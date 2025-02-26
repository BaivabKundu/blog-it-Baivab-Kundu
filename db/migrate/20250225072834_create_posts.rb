class CreatePosts < ActiveRecord::Migration[7.1]
  def change
    create_table :posts do |t|
      t.string :title, null: false
      t.text :description, null: false
      t.integer :upvotes, default: 0, null: false
      t.integer :downvotes, default: 0, null: false
      t.boolean :is_bloggable, default: false

      t.timestamps
    end
  end
end
