# frozen_string_literal: true

Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :posts, only: :index
    end
  end

  root "home#index"
  get "*path", to: "home#index", via: :all
end
