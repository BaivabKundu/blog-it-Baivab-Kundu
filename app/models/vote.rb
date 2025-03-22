# frozen_string_literal: true

class Vote < ApplicationRecord
  belongs_to :user
  belongs_to :post

  validates :vote_type, inclusion: { in: %w[upvote downvote] }
  validates :user_id, uniqueness: { scope: :post_id }
end
