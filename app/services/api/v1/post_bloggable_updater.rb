# frozen_string_literal: true

class Api::V1::PostBloggableUpdater
  def initialize(post)
    @post = post
  end

  def call
    vote_difference = @post.upvotes - @post.downvotes
    is_bloggable = vote_difference >= Constants::VOTE_THRESHOLD
    # puts "Vote difference: #{vote_difference}, Threshold: #{Constants::VOTE_THRESHOLD}, Bloggable: #{is_bloggable}"
    @post.update(is_bloggable: is_bloggable)
  end
end
