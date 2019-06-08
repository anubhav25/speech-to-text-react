import React, { Component } from "react";
import "./login.scss";
import * as actions from "../actions";
import { connect } from "react-redux";

class Post extends Component {
  state = {};
  liked = this.props.post.likes.includes(this.props.me._id);
  like() {}
  dislike() {}
  comment() {}
  render() {
    return (
      this.props.post &&
      this.props.me && (
        <>
          <div className="card mt-2" style={{ width: "100%" }}>
            <label className="float-left mx-3">
              <b>{this.props.post.username}</b>
              {(this.props.post.author === this.props.me._id ||
                this.props.me.admin) && (
                <button
                  className="float-right"
                  onClick={this.delete.bind(this)}
                >
                  <i className="fa fa-trash" />
                </button>
              )}
            </label>
            {this.props.post.imagepath && (
              <img
                className="card-img-top"
                src={this.props.post.imagepath}
                alt=""
                style={{ width: "100%" }}
              />
            )}
            {this.props.post.imagepath && (
              <a
                href={
                  actions.baseUri +
                  this.props.post.imagepath +
                  "\\" +
                  this.props.post.filename
                }
              >
                {this.props.post.filename}
              </a>
            )}
            {this.props.post.filepath && (
              <a
                href={
                  actions.baseUri +
                  this.props.post.filepath +
                  "\\" +
                  this.props.post.filename
                }
              >
                {this.props.post.filename}
              </a>
            )}
            <div className="card-body">
              {this.props.post.text && (
                <p className="card-text">{this.props.post.text}</p>
              )}
            </div>
            {this.props.post.comment &&
              this.props.post.comment.map(cmnt => {
                return (
                  <label className="float-left mx-3">
                    <b>{cmnt.author} : </b>
                    {cmnt.comment}
                  </label>
                );
              })}
            <div>
              <input
                type="text"
                placeholder="comment"
                style={{ width: "90%" }}
                value={this.state.cmtText}
                onChange={e => {
                  this.setState({ cmtText: e.target.value });
                }}
              />
              {!this.liked && (
                <button
                  className="btn btn-primary float-left m-2"
                  onClick={this.like.bind(this)}
                >
                  Like
                </button>
              )}
              {this.liked && (
                <button
                  className="btn btn-warning float-left m-2"
                  onClick={this.unlike.bind(this)}
                >
                  UnLike
                </button>
              )}
              <button
                className="btn btn-primary float-right m-2"
                onClick={this.comment.bind(this)}
              >
                Comment
              </button>
            </div>
          </div>
        </>
      )
    );
  }
}

const mapPropsToStore = store => {
  return {
    me: store.Authentication.user
  };
};
const mapDispatchToProps = dispach => {
  return {
    like: () => {
      dispach({
        type: actions.LIKE,
        payload: { myid: this.props.me._id, postid: this.props.post._id }
      });
    },
    unlike: () => {
      dispach({ type: actions.UNLIKE });
    },
    delete: () => {
      dispach({
        type: actions.DELETE
      });
    },
    comment: text => {
      dispach({ type: actions.GETPOSTS, payload: text });
    }
  };
};
export default connect(
  mapPropsToStore,
  mapDispatchToProps
)(Post);
