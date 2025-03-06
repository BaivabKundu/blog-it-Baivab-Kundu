# frozen_string_literal: true

class Api::V1::UsersController < ApplicationController
  skip_before_action :authenticate_user_using_x_auth_token, only: :create

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
      params.require(:user).permit(
        :username,
        :email,
        :password,
        :password_confirmation,
        :assigned_organization_id
      )
    end
end
