# frozen_string_literal: true

require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  def setup
    @organization = build(:organization)
  end

  def test_organization_should_not_be_valid_without_name
    @organization.organization_name = ""
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Organization name can't be blank"
  end

  def test_organization_name_should_be_unique
    @organization.save!
    duplicate_organization = build(:organization, organization_name: @organization.organization_name)
    assert_not duplicate_organization.valid?
    assert_includes duplicate_organization.errors.full_messages, "Organization name has already been taken"
  end

  def test_organization_name_should_have_valid_length
    @organization.organization_name = "a" * 101
    assert_not @organization.valid?
    assert_includes @organization.errors.full_messages, "Organization name is too long (maximum is 100 characters)"
  end

  def test_organization_should_have_created_at_and_updated_at
    @organization.save!
    assert_not_nil @organization.created_at
    assert_not_nil @organization.updated_at
  end

  def test_factory_creates_valid_organization
    organization = create(:organization)
    assert organization.valid?
    assert organization.persisted?
  end

  def test_organization_can_have_users
    organization = create(:organization)
    user = create(:user, assigned_organization: organization)
    assert_equal 1, organization.assigned_users.count
    assert_includes organization.assigned_users, user
  end

  def test_organization_can_have_posts
    organization = create(:organization)
    post = create(:post, assigned_organization: organization)
    assert_equal 1, organization.assigned_posts.count
    assert_includes organization.assigned_posts, post
  end

  def test_organization_can_exist_without_users
    organization = create(:organization)
    assert_equal 0, organization.assigned_users.count
  end

  def test_organization_can_exist_without_posts
    organization = create(:organization)
    assert_equal 0, organization.assigned_posts.count
  end

  def test_organization_name_should_be_case_sensitive_unique
    @organization.organization_name = "Test Organization"
    @organization.save!
    duplicate_organization = build(:organization, organization_name: "test organization")
    assert duplicate_organization.valid?
  end
end
