# frozen_string_literal: true

module SQLite3RegexpExtension
  module ConnectionAdapterExtension
    extend ActiveSupport::Concern

    included do
      alias_method :original_initialize, :initialize

      def initialize(*args)
        original_initialize(*args)

        if self.class.to_s.include?("SQLite3Adapter")
          raw_connection.create_function("REGEXP", 2) do |func, pattern, expression|
            begin
              regex = Regexp.new(pattern.to_s, Regexp::IGNORECASE)
              func.result = expression.to_s.match(regex) ? 1 : 0
            rescue => e
              func.result = 0
            end
          end
        end
      end
    end
  end
end

if ActiveRecord::Base.connection_db_config.configuration_hash[:adapter] == "sqlite3"
  ActiveRecord::ConnectionAdapters::SQLite3Adapter.include(SQLite3RegexpExtension::ConnectionAdapterExtension)

  if ActiveRecord::Base.connection.is_a?(ActiveRecord::ConnectionAdapters::SQLite3Adapter)
    connection_config = ActiveRecord::Base.connection_db_config.configuration_hash
    ActiveRecord::Base.establish_connection(connection_config)
  end
end
