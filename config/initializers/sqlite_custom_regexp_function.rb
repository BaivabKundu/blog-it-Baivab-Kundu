# frozen_string_literal: true

Rails.application.config.after_initialize do
  if ActiveRecord::Base.connection_db_config.configuration_hash[:adapter] == "sqlite3"
    ActiveRecord::Base.connection.raw_connection.create_function("regexp", 2) do |fn, pattern, expr|
      regex_matcher = Regexp.new(pattern.to_s, Regexp::IGNORECASE)
      fn.result = expr.to_s.match(regex_matcher) ? 1 : 0
    end
  end
end
