# frozen_string_literal: true

FactoryBot.define do
  factory :user do
    username { Faker::Internet.unique.username }
    email { Faker::Internet.unique.email }
    password { "welcome1234" }
    password_confirmation { "welcome1234" }
    authentication_token { SecureRandom.hex(10) }
    association :assigned_organization, factory: :organization
  end
end
