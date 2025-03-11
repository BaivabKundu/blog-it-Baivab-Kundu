# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :posts, except: %i[new edit destroy], param: :slug
        resources :users, only: [:index, :create]
        resources :categories, only: %i[index create]
        resource :session, only: [:create, :destroy]
        resources :organizations, only: [:index]
      end
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
