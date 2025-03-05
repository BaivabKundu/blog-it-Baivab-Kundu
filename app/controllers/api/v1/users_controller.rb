# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render status: :ok, json: { users: }
  end
end
