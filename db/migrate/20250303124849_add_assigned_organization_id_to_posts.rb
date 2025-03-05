# frozen_string_literal: true

class AddAssignedOrganizationIdToPosts < ActiveRecord::Migration[7.1]
  def change
    add_column :posts, :assigned_organization_id, :integer
  end
end
