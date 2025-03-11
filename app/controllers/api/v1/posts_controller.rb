    # frozen_string_literal: true

    class Api::V1::PostsController < ApplicationController
      before_action :load_post!, only: %i[show update]
      before_action :authenticate_user_using_x_auth_token, only: :update

      def index
        posts = Post.includes(:categories, :assigned_user)

        if current_user
          posts = posts.where(assigned_organization_id: current_user.assigned_organization_id)
        end

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
        render_notice(t("successfully_created", entity: "Post"))
      end

      def show
        render
      end

      def update
        @post.update!(post_params)
        render_notice(t("successfully_updated", entity: "Post"))
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
