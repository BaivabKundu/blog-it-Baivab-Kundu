# frozen_string_literal: true

class AddUserIdForeignKeyToPost < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :posts, :users, column: :assigned_user_id
  end
end
