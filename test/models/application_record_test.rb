# frozen_string_literal: true

require "test_helper"

class ApplicationRecordTest < ActiveSupport::TestCase
  class TestModel < ApplicationRecord
    # Mock model for testing ApplicationRecord
    self.table_name = "posts" # Using an existing table for testing

    validates :title, presence: true
    validates :description, presence: true
  end

  def setup
    @test_model = TestModel.new
  end

  def test_errors_to_sentence_with_no_errors
    assert @test_model.errors.empty?
    assert_equal "", @test_model.errors_to_sentence
  end

  def test_errors_to_sentence_with_single_error
    @test_model.title = ""
    @test_model.description = "Valid description"
    @test_model.valid?
    expected_message = "Title can't be blank"
    assert_equal expected_message, @test_model.errors_to_sentence
  end

  def test_errors_to_sentence_with_multiple_errors
    @test_model.valid?
    expected_message = "Title can't be blank and Description can't be blank"
    assert_equal expected_message, @test_model.errors_to_sentence
  end
end
