# frozen_string_literal: true

require "test_helper"

class Api::V1::OrganizationsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = headers(@user)
    @organization = create(:organization)
  end

  def test_should_list_all_organizations
    get api_v1_organizations_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_includes response_json["organizations"].pluck("id"), @organization.id
  end

  def test_should_return_empty_list_if_no_organizations_exist
    User.update_all(assigned_organization_id: nil)
    Post.update_all(assigned_organization_id: nil)
    Organization.destroy_all

    get api_v1_organizations_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_empty response_json["organizations"]
  end
end
