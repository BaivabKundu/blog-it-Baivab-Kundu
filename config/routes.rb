# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      constraints(lambda { |req| req.format == :json }) do
        resources :posts, except: %i[new edit], param: :slug do
          post :vote, on: :member
          resource :report, only: %i[create], module: :posts do
            get :download, on: :collection
          end
        end
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
