# frozen_string_literal: true

class HomeController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token

  def index
    render
  end
end
