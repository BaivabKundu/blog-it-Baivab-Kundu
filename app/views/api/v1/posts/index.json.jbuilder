# frozen_string_literal: true

json.posts @posts do |post|
  json.extract! post, :id, :title, :description, :slug, :created_at, :updated_at, :status

  json.categories post.categories do |category|
    json.extract! category, :id, :category_name
  end

  json.assigned_user do
    if post.assigned_user.present?
      json.extract! post.assigned_user, :id, :username, :email
    else
      json.null!
    end
  end
end
