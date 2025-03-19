# frozen_string_literal: true

require "test_helper"

class ApplicationControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = headers(@user)
    puts "Debug: User email: #{@user.email}, token: #{@user.authentication_token}"
    puts "Debug: Headers: #{@headers.inspect}"
  end

  def test_should_authenticate_user_using_x_auth_token
    get api_v1_users_path, headers: @headers
    puts "Debug: Response status: #{response.status}, body: #{response.body}"
    assert_response :success
    assert_equal JSON.parse(response.body)["users"].first["email"], @user.email
  end

  # def test_should_not_authenticate_user_with_invalid_token
  #   invalid_headers = { "X-Auth-Email" => @user.email, "X-Auth-Token" => "invalid_token" }
  #   get api_v1_users_path, headers: invalid_headers
  #   puts "Debug: Response status: #{response.status}, body: #{response.body}"
  #   assert_response :unauthorized
  #   assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  # end

  # def test_should_not_authenticate_user_with_invalid_email
  #   invalid_headers = { "X-Auth-Email" => "invalid@example.com", "X-Auth-Token" => @user.authentication_token }
  #   get api_v1_users_path, headers: invalid_headers
  #   puts "Debug: Response status: #{response.status}, body: #{response.body}"
  #   assert_response :not_found
  #   assert_equal "Couldn't find User", response.parsed_body["error"]
  # end

  # def test_should_not_authenticate_user_without_token
  #   get api_v1_users_path, headers: { "X-Auth-Email" => @user.email }
  #   puts "Debug: Response status: #{response.status}, body: #{response.body}"
  #   assert_response :unauthorized
  #   assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  # end

  # def test_should_not_authenticate_user_without_email
  #   get api_v1_users_path, headers: { "X-Auth-Token" => @user.authentication_token }
  #   puts "Debug: Response status: #{response.status}, body: #{response.body}"
  #   assert_response :unauthorized
  #   assert_equal I18n.t("session.could_not_auth"), response.parsed_body["error"]
  # end
end
