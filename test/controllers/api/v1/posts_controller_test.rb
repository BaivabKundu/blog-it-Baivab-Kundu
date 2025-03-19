# frozen_string_literal: true

require "test_helper"

class Api::V1::PostsControllerTest < ActionDispatch::IntegrationTest
  def setup
    @user = create(:user)
    @organization = create(:organization)
    @category = create(:category)

    @post = create(
      :post,
      assigned_user: @user,
      assigned_organization: @organization,
      categories: [@category],
      )

    @post.reload

    @headers = headers(@user)
  end

  def test_should_list_all_posts_for_valid_user
    get api_v1_posts_path, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_includes response_json["posts"].pluck("id"), @post.id
  end

  def test_should_list_user_posts_when_show_user_posts_is_true
    @post.update(assigned_user: @user) unless @post.assigned_user == @user

    get api_v1_posts_path, params: { show_user_posts: "true" }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_includes response_json["posts"].pluck("id"), @post.id
  end

  def test_should_filter_posts_by_category_name
    unless @post.categories.include?(@category)
      @post.categories << @category
      @post.save!
    end

    get api_v1_posts_path, params: { category_name: @category.category_name }, headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_includes response_json["posts"].pluck("id"), @post.id
  end

  def test_should_create_valid_post
    post api_v1_posts_path,
      params: {
        post: {
          title: "New Post",
          description: "Post description",
          assigned_user_id: @user.id,
          assigned_organization_id: @organization.id,
          category_ids: [@category.id]
        }
      },
      headers: @headers
    assert_response :success
    response_json = response.parsed_body
    assert_equal I18n.t("successfully_created", entity: "Post"), response_json["notice"]
  end

  def test_shouldnt_create_post_without_title
    post api_v1_posts_path,
      params: {
        post: {
          title: "",
          description: "Post description",
          assigned_user_id: @user.id
        }
      },
      headers: @headers
    assert_response :unprocessable_entity
    response_json = response.parsed_body
    assert_includes response_json["error"], "Title can't be blank"
  end

  def test_should_update_post
    new_title = "#{@post.title}-(updated)"
    put api_v1_post_path(@post.slug),
      params: {
        post: {
          title: new_title,
          status: "draft"
        }
      },
      headers: @headers
    assert_response :success
    @post.reload
    assert_equal new_title, @post.title
    assert_equal "draft", @post.status
  end

  def test_should_destroy_post
    assert_difference "Post.count", -1 do
      delete api_v1_post_path(@post.slug), headers: @headers
    end
    assert_response :success
  end

  def test_not_found_error_rendered_for_invalid_post_slug
    invalid_slug = "invalid-slug"
    get api_v1_post_path(invalid_slug), headers: @headers
    assert_response :not_found
    assert_equal I18n.t("post.not_found"), response.parsed_body["error"]
  end
end
