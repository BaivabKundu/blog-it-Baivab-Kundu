# frozen_string_literal: true

require "test_helper"

class PostTest < ActiveSupport::TestCase
  def setup
    @post = build(:post)
  end

  def test_post_should_not_be_valid_without_title
    @post.title = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title can't be blank"
  end

  def test_post_should_not_be_valid_without_description
    @post.description = ""
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description can't be blank"
  end

  def test_post_should_have_valid_slug
    post = create(:post)
    assert_not_nil post.slug
    assert_not_empty post.slug
    assert_match(/\A[a-z0-9\-]+\z/, post.slug)
  end

  def test_post_should_have_automatically_generated_slug
    post = create(:post, title: "My Test Post 123!")

    assert_not_nil post.slug
    assert_not_empty post.slug
    assert_equal "my-test-post-123", post.slug
  end

  def test_slug_should_be_unique
    post1 = create(:post, title: "Unique Post")
    post2 = create(:post, title: "Unique Post")

    assert_not_equal post1.slug, post2.slug
    assert_match(/unique-post-\d+/, post2.slug)
  end

  def test_post_should_have_default_upvotes
    @post.save!
    assert_equal 0, @post.upvotes
  end

  def test_post_should_have_default_downvotes
    @post.save!
    assert_equal 0, @post.downvotes
  end

  def test_post_should_have_default_bloggable_status
    @post.save!
    assert_equal false, @post.is_bloggable
  end

  def test_post_can_belong_to_organization
    organization = create(:organization)
    @post.assigned_organization = organization
    assert @post.valid?
    assert_equal organization, @post.assigned_organization
  end

  def test_post_should_not_be_valid_without_organization
    @post.assigned_organization = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Assigned organization must exist"
  end

  def test_post_should_belong_to_user
    user = create(:user)
    @post.assigned_user = user
    assert @post.valid?
    assert_equal user, @post.assigned_user
  end

  def test_post_should_not_be_valid_without_user
    @post.assigned_user = nil
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Assigned user must exist"
  end

  def test_post_should_have_created_at_and_updated_at
    @post.save!
    assert_not_nil @post.created_at
    assert_not_nil @post.updated_at
  end

  def test_factory_creates_valid_post
    post = create(:post)
    assert post.valid?
    assert post.persisted?
  end

  def test_post_can_have_bloggable_status
    @post.is_bloggable = true
    assert @post.valid?
    assert @post.is_bloggable
  end

  def test_post_can_update_votes
    @post.save!
    @post.update(upvotes: 5, downvotes: 2)
    assert_equal 5, @post.upvotes
    assert_equal 2, @post.downvotes
  end

  def test_post_should_have_valid_title_length
    @post.title = "a" * 126
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Title is too long (maximum is 125 characters)"
  end

  def test_post_can_be_associated_with_multiple_categories
    post = create(:post)
    category1 = create(:category)
    category2 = create(:category)

    post.categories << category1
    post.categories << category2

    assert_equal 2, post.categories.count
    assert_includes post.categories, category1
    assert_includes post.categories, category2
  end

  def test_post_should_have_valid_description_length
    @post.description = "a" * 10001
    assert_not @post.valid?
    assert_includes @post.errors.full_messages, "Description is too long (maximum is 10000 characters)"
  end

  def test_post_should_have_valid_bloggable_status
    @post.is_bloggable = true
    assert @post.valid?
    assert @post.is_bloggable
  end

  def test_post_should_not_allow_slug_changes
    post = create(:post)
    original_slug = post.slug
    post.slug = "new-slug"
    assert_not post.valid?
    assert_includes post.errors.full_messages, "Slug is immutable"
  end

  def test_post_should_have_correct_maximum_title_length
    @post.title = "a" * 125
    assert @post.valid?
  end

  def test_post_should_have_correct_maximum_description_length
    @post.description = "a" * 10000
    assert @post.valid?
  end
end
