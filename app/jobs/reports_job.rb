# frozen_string_literal: true

class ReportsJob
  include Sidekiq::Job

  def perform(user_id, post_slug, report_path)
    puts "Hello from ReportsJob"
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.render"), progress: 25 })
    puts "=============>1"
    post = Post.find_by!(slug: post_slug)
    puts "=============>2"
    puts post
    puts "=============>3"
    content = ApplicationController.render(
      assigns: {
        post: post
      },
      template: "api/v1/posts/report/download",
      layout: "pdf"
    )
    puts "=============>4"
    puts content
    puts "=============>5"
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.generate"), progress: 50 })
    pdf_blob = WickedPdf.new.pdf_from_string(content)
    if post.report.attached?
      post.report.purge_later
    end
    post.report.attach(
      io: StringIO.new(pdf_blob), filename: "report.pdf",
      content_type: "application/pdf"
    )
    post.save!
    ActionCable.server.broadcast(user_id, { message: I18n.t("report.attach"), progress: 100 })
  end
end
