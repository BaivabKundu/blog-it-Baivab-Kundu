# frozen_string_literal: true

module Api
  module V1
    class PostsController < ApplicationController
      def index
        posts = Post.all
        render status: :ok, json: { posts: }
      end
    end
  end
end
