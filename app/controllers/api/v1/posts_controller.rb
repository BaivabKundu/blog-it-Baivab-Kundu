    # frozen_string_literal: true

    class Api::V1::PostsController < ApplicationController
      def index
        posts = Post.all
        render status: :ok, json: { posts: }
      end
    end
