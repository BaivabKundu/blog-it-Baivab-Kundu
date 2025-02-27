# frozen_string_literal: true

class MakeTitleNotNullable < ActiveRecord::Migration[7.1]
  def change
    change_column_null :posts, :title, false
  end
end
