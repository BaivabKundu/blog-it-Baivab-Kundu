# frozen_string_literal: true

ActiveRecord::ConnectionAdapters::SQLite3Adapter.class_eval do
  alias_method :original_initialize, :initialize

  def initialize(*args)
    original_initialize(*args)

    raw_connection.create_function("regexp", 2) do |function, pattern, expression|
      regex_matcher = Regexp.new(pattern.to_s, Regexp::IGNORECASE)
      function.result = expression.to_s.match(regex_matcher) ? 1 : 0
    end
  end
end
