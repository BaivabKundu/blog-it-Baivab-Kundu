# frozen_string_literal: true

FactoryBot.define do
  factory :organization do
    organization_name { Faker::Name.name }
  end
end
