# frozen_string_literal: true

class Api::V1::Posts::ReportsController < ApplicationController
  def create
    post = Post.find_by!(slug: params[:post_slug])
    authorize post

    ReportsJob.perform_async(current_user.id, post.slug, report_path.to_s)
    render_notice(t("in_progress", action: "Report generation"))
  end

  def download
    post = Post.find_by!(slug: params[:post_slug])
    unless post.report.attached?
      render_error(t("not_found", entity: "report"), :not_found) and return
    end

    send_data post.report.download, filename: pdf_file_name, content_type: "application/pdf"
  end

  private

    def report_path
      @_report_path ||= Rails.root.join("tmp/#{pdf_file_name}")
    end

    def pdf_file_name
      "Blog-IT_post_report.pdf"
    end
end
