# frozen_string_literal: true

class CreateCategoriesAndPosts < ActiveRecord::Migration[7.1]
  def change
    create_table :categories_posts do |t|
      t.references :category, null: false, foreign_key: true
      t.references :post, null: false, foreign_key: true

      t.timestamps
    end

    add_index :categories_posts, [:category_id, :post_id], unique: true
  end
end
