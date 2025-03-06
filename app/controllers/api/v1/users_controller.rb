# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  def index
    users = User.all
    render status: :ok, json: { users: }
  end

  def create
    user = User.new(user_params)
    user.save!
    render_notice(t("successfully_created", entity: "User"))
  end

  private

    def user_params
      params.require(:user).permit(:name, :email, :password, :password_confirmation)
    end
end
