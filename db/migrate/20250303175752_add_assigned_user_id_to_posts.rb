# frozen_string_literal: true

class AddAssignedUserIdToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :assigned_user_id, :integer
  end
end
