# frozen_string_literal: true

class ReportDownloadChannel < ApplicationCable::Channel
  def subscribed
    stream_from params[:pubsub_token] if params[:pubsub_token].present?
  end

  def unsubscribed
    stop_all_streams
  end
end
