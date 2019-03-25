import React, { Component } from "react"; //eslint-disable-line no-unused-vars
import ArticlePage from "microzine-3.2/views/partials/article/ArticlePage";

class ArticlePageBlog extends ArticlePage {
  componentWillUpdate(props, nextState) {
    if (nextState.userExpanded && !nextState.expanded) {
      this.hero.classList.remove("prevent_transition");
    }
  }

  transitionend() {
    this.hero.classList.add("prevent_transition");
  }

  componentDidMount() {
    super.componentDidMount();
    this.hero = document.querySelector(".hero");
    this.hero.classList.add("prevent_transition");
    this.hero.addEventListener(
      "transitionend",
      this.transitionend.bind(this),
      false
    );
    this.hero.addEventListener(
      "webkitTransitionEnd",
      this.transitionend.bind(this),
      false
    );
    this.hero.style.display = "block";
    if (
      this.props.article &&
      this.props.article.articleImage.url.indexOf("base64") !== -1
    ) {
      // if no hero image. Hide asset to fix padding bug.
      // solving for padding bug when no image exists.
      // @todo  - this functionlaity should be reactive and not directly set.
      //        - solve by not adding a <ArticleImage> component if no hero image?
      this.hero.style.display = "none";
    }
  }
}

export default ArticlePageBlog;
