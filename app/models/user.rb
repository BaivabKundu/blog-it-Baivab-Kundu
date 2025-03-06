# frozen_string_literal: true

class User < ApplicationRecord
  MAX_NAME_LENGTH = 50
  MIN_PASSWORD_LENGTH = 8

  has_many :assigned_post, foreign_key: :assigned_user_id, class_name: "Post"

  belongs_to :assigned_organization, foreign_key: "assigned_organization_id", class_name: "Organization"

  has_secure_password
  has_secure_token :authentication_token

  validates :username, presence: true, uniqueness: true, length: { maximum: MAX_NAME_LENGTH }
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, length: { minimum: MIN_PASSWORD_LENGTH }, if: :password_required
  validates :password_confirmation, presence: true, if: :password_required

  before_save :to_lowercase

  private

    def to_lowercase
      email.downcase!
    end

    def password_required
      password_digest.nil? || !password.nil?
    end
end
