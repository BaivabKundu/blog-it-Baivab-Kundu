# frozen_string_literal: true

class Category < ApplicationRecord
  MAX_NAME_LENGTH = 100

  has_and_belongs_to_many :posts

  validates :category_name, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }
end
