# frozen_string_literal: true

class CreateOrganization < ActiveRecord::Migration[7.1]
  def change
    create_table :organizations do |t|
      t.string :organization_name, null: false

      t.timestamps
    end
  end
end
