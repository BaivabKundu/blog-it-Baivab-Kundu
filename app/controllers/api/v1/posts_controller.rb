    # frozen_string_literal: true

    class Api::V1::PostsController < ApplicationController
      before_action :load_post!, only: %i[show]
      def index
        posts = Post.all
        render status: :ok, json: { posts: }
      end

      def create
        post = Post.new(post_params)
        post.save!
        render_notice(t("successfully_created"))
      end

      def show
        render_json({ post: @post })
      end

      # def update
      #   @post.update!(post_params)
      #   render_notice(t("successfully_updated"))
      # end

      # def destroy
      #   @post.destroy!
      #   render_json
      # end

      private

        def load_post!
          @post = Post.find_by!(slug: params[:slug])
        end

        def post_params
          params.require(:post).permit(:title, :description)
        end
    end
