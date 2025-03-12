# frozen_string_literal: true

json.post do
  json.(@post, :id, :title, :description, :slug, :created_at, :updated_at, :status)

  json.assigned_user do
    json.(@post.assigned_user, :id, :username)
  end

  json.categories @post.categories do |category|
    json.(category, :id, :category_name)
  end
end
