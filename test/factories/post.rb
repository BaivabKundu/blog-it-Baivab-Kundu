# frozen_string_literal: true

FactoryBot.define do
  factory :post do
    title { Faker::Lorem.sentence }
    description { Faker::Lorem.paragraph }
    upvotes { 0 }
    downvotes { 0 }
    is_bloggable { false }
    slug { Faker::Internet.unique.slug }
    association :assigned_organization, factory: :organization
    association :assigned_user, factory: :user
  end
end
