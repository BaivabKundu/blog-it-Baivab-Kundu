    # frozen_string_literal: true

    class Api::V1::PostsController < ApplicationController
      before_action :load_post!, only: %i[show]
      def index
        posts = Post.includes(:categories, :assigned_user)
        if params[:category_id].present?
          posts = posts.joins(:categories).where(categories: { id: params[:category_id] })
        elsif params[:category_name].present?
          posts = posts.joins(:categories).where(
            "LOWER(categories.category_name) LIKE LOWER(?)",
            "%#{params[:category_name]}%")
        elsif params[:category_names].present?
          posts = posts.joins(:categories).where(
            "LOWER(categories.category_name) IN (?)",
            params[:category_names].map(&:downcase)
          )
        end

        @post_ids = posts.distinct.pluck(:id)
        @posts = Post.includes(:categories, :assigned_user).where(id: @post_ids)
      end

      def create
        post = Post.new(post_params)
        post.save!
        render_notice(t("successfully_created"))
      end

      def show
        render
      end

      private

        def load_post!
          @post = Post.find_by!(slug: params[:slug])
        end

        def post_params
          params.require(:post).permit(
            :title,
            :description,
            :assigned_user_id,
            :assigned_organization_id,
            category_ids: []
          )
        end
    end
