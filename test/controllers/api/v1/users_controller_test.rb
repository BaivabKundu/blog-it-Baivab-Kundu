# frozen_string_literal: true

require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = headers(@user)
  end

  def test_should_list_all_users
    get api_v1_users_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body

    expected_user_ids = User.pluck(:id).sort
    actual_user_ids = response_json["users"].pluck("id").sort

    assert_equal expected_user_ids, actual_user_ids
  end

  def test_should_create_user_with_valid_credentials
    post api_v1_users_path, params: {
      user: {
        username: "SamSmith",
        email: "sam@example.com",
        password: "welcome1234",
        password_confirmation: "welcome1234",
        assigned_organization_id: @user.assigned_organization_id
      }
    }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created", entity: "User"), response_json["notice"]
  end

  def test_shouldnt_create_user_with_invalid_credentials
    post api_v1_users_path, params: {
      user: {
        username: "SamSmith",
        email: "sam@example.com",
        password: "welcome1234",
        password_confirmation: "not matching confirmation",
        assigned_organization_id: @user.assigned_organization_id
      }
    }, headers: @headers

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Password confirmation doesn't match Password"
  end

  def test_shouldnt_create_user_without_required_fields
    post api_v1_users_path, params: {
      user: {
        email: "sam@example.com",
        password: "welcome1234",
        password_confirmation: "welcome1234",
        assigned_organization_id: @user.assigned_organization_id
      }
    }, headers: @headers

    assert_response :unprocessable_entity
    assert_includes response.parsed_body["error"], "Username can't be blank"
  end
end
