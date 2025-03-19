# frozen_string_literal: true

require "test_helper"

class Api::V1::CategoriesControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @headers = headers(@user)
  end

  def test_should_list_all_categories
    category = create(:category)
    get api_v1_categories_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_includes response_json["categories"].pluck("id"), category.id
  end

  def test_should_create_category_with_valid_name
    post api_v1_categories_path, params: {
      category: {
        category_name: "New Category"
      }
    }, headers: @headers
    assert_response :created
    response_json = response.parsed_body
    assert_equal "New Category", response_json["category"]["category_name"]
  end

  def test_shouldnt_create_category_without_name
    post api_v1_categories_path, params: {
      category: {
        category_name: ""
      }
    }, headers: @headers
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["errors"], "Category name can't be blank"
  end

  def test_shouldnt_create_category_with_duplicate_name
    category = create(:category, category_name: "Existing Category")
    post api_v1_categories_path, params: {
      category: {
        category_name: "Existing Category"
      }
    }, headers: @headers
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["errors"], "Category name has already been taken"
  end

  def test_shouldnt_create_category_with_name_exceeding_max_length
    post api_v1_categories_path, params: {
      category: {
        category_name: "a" * 101
      }
    }, headers: @headers
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["errors"], "Category name is too long (maximum is 100 characters)"
  end
end
