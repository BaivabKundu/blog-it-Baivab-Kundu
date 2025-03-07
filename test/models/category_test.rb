# frozen_string_literal: true

require "test_helper"

class CategoryTest < ActiveSupport::TestCase
  def setup
    @category = build(:category)
  end

  def test_category_should_not_be_valid_without_name
    @category.category_name = ""
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Category name can't be blank"
  end

  def test_category_name_should_be_unique
    @category.save!
    duplicate_category = build(:category, category_name: @category.category_name)
    assert_not duplicate_category.valid?
    assert_includes duplicate_category.errors.full_messages, "Category name has already been taken"
  end

  def test_category_name_should_have_valid_length
    @category.category_name = "a" * 101
    assert_not @category.valid?
    assert_includes @category.errors.full_messages, "Category name is too long (maximum is 100 characters)"
  end

  def test_category_should_have_created_at_and_updated_at
    @category.save!
    assert_not_nil @category.created_at
    assert_not_nil @category.updated_at
  end

  def test_factory_creates_valid_category
    category = create(:category)
    assert category.valid?
    assert category.persisted?
  end

  def test_category_can_have_posts
    category = create(:category)
    post = create(:post)
    category.posts << post
    assert_equal 1, category.posts.count
    assert_includes category.posts, post
  end

  def test_category_can_exist_without_posts
    category = create(:category)
    assert_equal 0, category.posts.count
  end

  def test_category_name_should_be_case_sensitive_unique
    @category.category_name = "Test Category"
    @category.save!
    duplicate_category = build(:category, category_name: "test category")
    assert duplicate_category.valid?
  end

  def test_category_can_be_associated_with_multiple_posts
    category = create(:category)
    post1 = create(:post)
    post2 = create(:post)
    category.posts << post1
    category.posts << post2
    assert_equal 2, category.posts.count
    assert_includes category.posts, post1
    assert_includes category.posts, post2
  end
end
