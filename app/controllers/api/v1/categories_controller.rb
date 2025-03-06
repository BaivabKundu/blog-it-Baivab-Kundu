    # frozen_string_literal: true

    class Api::V1::CategoriesController < ApplicationController
      skip_before_action :authenticate_user_using_x_auth_token

      def index
        categories = Category.all
        render status: :ok, json: { categories: }
      end

      def create
        category = Category.new(category_params)
        if category.save
          render status: :created, json: { category: }
        else
          render status: :unprocessable_entity, json: { errors: category.errors.full_messages }
        end
      end

      private

        def category_params
          params.require(:category).permit(:category_name)
        end
    end
