# frozen_string_literal: true

require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @organization = create(:organization)
    @user.update(assigned_organization_id: @organization.id)
  end

  def test_should_login_user_with_valid_credentials
    post api_v1_session_path, params: { login: { email: @user.email, password: @user.password } }, as: :json
    assert_response :success
    response_json = response.parsed_body
    assert_equal @user.authentication_token, response_json["authentication_token"]
    assert_equal @user.id, response_json["id"]
    assert_equal @user.username, response_json["username"]
  end

  def test_shouldnt_login_user_with_invalid_credentials
    post api_v1_session_path, params: { login: { email: @user.email, password: "invalid password" } }, as: :json
    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal I18n.t("session.incorrect_credentials"), response_json["error"]
  end

  def test_should_respond_with_not_found_error_if_user_is_not_present
    non_existent_email = "this_email_does_not_exist_in_db@example.email"
    post api_v1_session_path, params: { login: { email: non_existent_email, password: "welcome" } }, as: :json
    assert_response :not_found
    response_json = response.parsed_body
    assert_equal "Couldn't find User", response_json["error"]
  end

  def test_should_respond_with_unauthorized_for_missing_parameters
    post api_v1_session_path, params: { login: { email: @user.email } }, as: :json
    assert_response :unauthorized
    response_json = response.parsed_body
    assert_equal I18n.t("session.incorrect_credentials"), response_json["error"]
  end

  def test_destroy_session
    post api_v1_session_path, params: { login: { email: @user.email, password: @user.password } }, as: :json
    auth_token = response.parsed_body["authentication_token"]

    delete api_v1_session_path, headers: { "X-Auth-Token": auth_token }, as: :json
    assert_response :success
    assert_nil @controller.instance_variable_get(:@current_user)
  end

  def test_handle_case_insensitive_email_login
    post api_v1_session_path, params: { login: { email: @user.email.upcase, password: @user.password } }, as: :json
    assert_response :success
    response_json = response.parsed_body
    assert_not_nil response_json["authentication_token"]
    assert_equal @user.id, response_json["id"]
    assert_equal @user.username, response_json["username"]
  end
end
