# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :posts, except: %i[new edit destroy update], param: :slug
        resources :users, only: :index
        resources :categories, only: [:index, :create]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
