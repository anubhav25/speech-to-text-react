import React, { Component } from "react";
import Post from "./post";
import { connect } from "react-redux";
import "./login.scss";
import * as actions from "../actions";

class Posts extends Component {
  me = {};
  state = { postText: "" };
  postTextRef = null;
  file = null;
  constructor(props) {
    super(props);
    props.dispachGetPosts();
  }
  render() {
    return (
      <>
        <div className="row">
          <div className="col-md-8 mx-auto mb-5">
            <label>Add a new post</label>
            <textarea
              name="post"
              placeholder="add new post here"
              style={{ width: "100%" }}
              rows="2"
              ref={el => {
                this.postTextRef = el;
              }}
              value={this.state.postText}
              onChange={e => {
                this.setState({ postText: e.target.value });
              }}
            />
            {this.file && <label>Slected File : {this.file.name}</label>}
            <div>
              <button className="btn btn-primary">
                <i className="fa fa-camera" /> Image
              </button>
              {/*(click)='selectFile(imgInput)'*/}
              <button className="btn btn-primary">
                <i className="fa fa-file" /> File
              </button>
              {/* (click)='selectFile(fileInput)'*/}
            </div>
            <input
              type="file"
              id="imageInput"
              style={{ display: "none" }}
              accept="image/*"
            />
            {/*(change)='hadleFile($event)'*/}
            <input type="file" id="fileInput" style={{ display: "none" }} />
            {/*(change)='hadleFile($event)'*/}
            <div className="mt-2">
              <button className="btn btn-warning" onClick={this.post}>
                <i className="fa fa-send-o"> POST</i>
              </button>
            </div>
          </div>
        </div>

        {this.props.posts.map(post => {
          return (
            <div key={post._id} className="col-md-8 mx-auto">
              <Post post={post} me={this.props.me} />
            </div>
          );
        })}
      </>
    );
  }
}
const mapPropsToStore = store => {
  return {
    posts: (store.Posts && store.Posts.Items) || [],
    me: store.Authentication.user
  };
};
const mapDispatchToProps = dispach => {
  return {
    dispachGetPosts: () => {
      dispach({ type: actions.GETPOSTS });
    },
    dis: dispach({ type: actions.GETPOSTS })
  };
};
export default connect(
  mapPropsToStore,
  mapDispatchToProps
)(Posts);
