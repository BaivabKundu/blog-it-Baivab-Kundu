# frozen_string_literal: true

class AddOrganizationIdForeignKeyToPost < ActiveRecord::Migration[7.1]
  def change
    add_foreign_key :posts, :organizations, column: :assigned_organization_id
  end
end
