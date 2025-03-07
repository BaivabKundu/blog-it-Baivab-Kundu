# frozen_string_literal: true

require "test_helper"

class UserTest < ActiveSupport::TestCase
  def setup
    @user = build(:user)
  end

  def test_user_should_not_be_valid_without_username
    @user.username = ""
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Username can't be blank"
  end

  def test_username_should_be_unique
    @user.save!
    duplicate_user = build(:user, username: @user.username)
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Username has already been taken"
  end

  def test_username_should_have_valid_length
    @user.username = "a" * 51
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Username is too long (maximum is 50 characters)"
  end

  def test_user_should_not_be_valid_without_email
    @user.email = ""
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Email can't be blank"
  end

  def test_email_should_be_unique
    @user.save!
    duplicate_user = build(:user, email: @user.email)
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Email has already been taken"
  end

  def test_email_should_be_unique_case_insensitive
    @user.email = "TEST@EXAMPLE.COM"
    @user.save!
    duplicate_user = build(:user, email: "test@example.com")
    assert_not duplicate_user.valid?
    assert_includes duplicate_user.errors.full_messages, "Email has already been taken"
  end

  def test_validation_should_accept_valid_emails
    valid_emails = %w[user@example.com USER@example.COM US-ER@example.org
      first.last@example.in user+one@example.ac.in]

    valid_emails.each do |email|
      @user.email = email
      assert @user.valid?, "#{email} should be valid"
    end
  end

  def test_validation_should_reject_invalid_emails
    invalid_emails = %w[user@example,com user_at_example.org user.name@example.
      @sam-sam.com sam@sam+exam.com fishy+#.com]

    invalid_emails.each do |email|
      @user.email = email
      assert @user.invalid?, "#{email} should be invalid"
    end
  end

  def test_email_should_be_saved_in_lowercase
    uppercase_email = "SAM@EMAIL.COM"
    @user.email = uppercase_email
    @user.save!
    assert_equal uppercase_email.downcase, @user.email
  end

  def test_user_should_not_be_valid_without_password
    @user.password = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password can't be blank"
  end

  def test_password_should_have_minimum_length
    @user.password = @user.password_confirmation = "a" * 7
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password is too short (minimum is 8 characters)"
  end

  def test_user_should_not_be_valid_without_password_confirmation
    @user.password_confirmation = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password confirmation can't be blank"
  end

  def test_password_and_confirmation_should_match
    @user.password_confirmation = "mismatch"
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Password confirmation doesn't match Password"
  end

  def test_user_should_have_authentication_token
    @user.save!
    assert_not_nil @user.authentication_token
  end

  def test_users_should_have_unique_authentication_tokens
    @user.save!
    second_user = create(:user)
    assert_not_equal @user.authentication_token, second_user.authentication_token
  end

  def test_user_can_belong_to_organization
    organization = create(:organization)
    @user.assigned_organization = organization
    assert @user.valid?
    assert_equal organization, @user.assigned_organization
  end

  def test_user_should_not_exist_without_organization
    @user.assigned_organization = nil
    assert_not @user.valid?
    assert_includes @user.errors.full_messages, "Assigned organization must exist"
  end

  def test_user_should_have_password_digest
    @user.save!
    assert_not_nil @user.password_digest
  end
end
