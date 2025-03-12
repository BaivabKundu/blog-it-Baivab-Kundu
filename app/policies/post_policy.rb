# frozen_string_literal: true

class PostPolicy
  attr_reader :user, :post

  def initialize(user, post)
    @user = user
    @post = post
  end

  def index?
    true
  end

  def show?
    user.assigned_organization_id == post.assigned_organization_id
  end

  def create?
    true
  end

  def update?
    edit?
  end

  def edit?
    post.assigned_user_id == user.id
  end

  def destroy?
    post.assigned_user_id == user.id
  end

  class Scope
    attr_reader :user, :scope

    def initialize(user, scope)
      @user = user
      @scope = scope
    end

    def resolve
      published_posts = scope.where(
        assigned_organization_id: user.assigned_organization_id
      ).where.not(status: "draft")

      draft_posts = scope.where(
        assigned_user_id: user.id,
        status: "draft"
      )

      published_posts.or(draft_posts)
    end
  end
end
