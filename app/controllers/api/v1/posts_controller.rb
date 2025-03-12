    # frozen_string_literal: true

    class Api::V1::PostsController < ApplicationController
      after_action :verify_authorized, except: %i[index]
      after_action :verify_policy_scoped, only: %i[index]
      before_action :load_post!, only: %i[show update destroy]

      def index
        posts = policy_scope(Post).includes(:categories, :assigned_user)

        if params[:show_user_posts] == "true"
          posts = posts.where(assigned_user_id: current_user.id)
        end

        if params[:category_name].present?
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
        authorize post
        post.save!
        render_notice(t("successfully_created", entity: "Post"))
      end

      def show
        authorize @post
        render
      end

      def update
        authorize @post
        @post.update!(post_params)
        render_notice(t("successfully_updated", entity: "Post"))
      end

      def destroy
        authorize @post
        @post.destroy!
        render_notice(t("successfully_deleted", entity: "Post"))
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
            :status,
            category_ids: []
          )
        end
    end
