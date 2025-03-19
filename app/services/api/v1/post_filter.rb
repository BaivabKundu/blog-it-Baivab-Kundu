# frozen_string_literal: true

class Api::V1::PostFilter
  attr_reader :posts, :filter_params

  def initialize(posts, filter_params = {})
    @posts = posts
    @filter_params = filter_params.permit(:title, :status, category_names: []).to_h
  end

  def filter
    result = posts
    result = filter_by_title(result) if filter_params[:title].present?
    result = filter_by_categories(result) if filter_params[:category_names].present?
    result = filter_by_status(result) if filter_params[:status].present?
    result
  end

  private

    def filter_by_title(posts)
      posts.where("LOWER(title) LIKE LOWER(?)", "%#{filter_params[:title]}%")
    end

    def filter_by_categories(posts)
      posts.joins(:categories).where(
        "LOWER(categories.category_name) IN (?)",
        filter_params[:category_names].map(&:downcase)
      ).distinct
    end

    def filter_by_status(posts)
      posts.where(status: filter_params[:status])
    end
end
