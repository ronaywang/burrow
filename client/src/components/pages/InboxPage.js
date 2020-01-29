import React, {Component, PureComponent} from "react";
import PropTypes from "prop-types";
import { get, post } from "../../utilities";
import "../../utilities";
import "../../utilities.css";
import "./InboxPage.css";
import { socket } from "../../client-socket.js";
import { Link } from "@reach/router";
const has = require("lodash/has");


const findActiveThread = (activeThread_ID, threads) => {
  if (threads.length === 0) {
    return null;
  }
  for (let i = 0; i < threads.length; i++) {
    if (threads[i]._id === activeThread_ID) {
      return i;
    }
  }
  return null;
}

class InboxPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: "",
      lastSearchQuery: "",
      searchBoxContents: "",
      chatBoxContents: "",
      lastMessageSubmitted: "",
      displayedMessages: [],
      threadsToDisplay: [],
      activeThreadIndex: 0,
      noThreads: true,
      chatDisabled: true,
      dorender: false,
    };
    this.ChatBoxUpdate = this.ChatBoxUpdate.bind(this);
    this.SearchBoxUpdate = this.SearchBoxUpdate.bind(this);
    this.SearchBoxKey= this.SearchBoxKey.bind(this);
    this.ChatBoxKey = this.ChatBoxKey.bind(this);
    this.ChatGoToBottom = this.ChatGoToBottom.bind(this);
    this.SetActiveThread = this.SetActiveThread.bind(this);
    this.GetActiveChatName = this.GetActiveChatName.bind(this);
    this.GetActiveChatUID = this.GetActiveChatUID.bind(this);
    this.NewMessageHandler = this.NewMessageHandler.bind(this);
  }


  async componentDidMount() {
    document.body.classList.add("SplashPage-body");
    let threadToMakeActive = null;
    if (has(this.props, 'userId')) {
      if (this.props.userId !== "*") {
        const response = await get("/api/findthreadbyuser", {userId: this.props.userId});
        threadToMakeActive = response.thread;
      }
    } else {
      console.log("no userid.");
      threadToMakeActive = null;
    }

    const uidresponse = await get("/api/myuid");
    this.setState({userId: uidresponse.userId});
    const response = await get("/api/getthreads");
    this.setState({threadsToDisplay: response.threads, noThreads: response.threads.length === 0});

    if (response.threads.length > 0) {
      if (threadToMakeActive !== null) {
        this.setState({activeThreadIndex: findActiveThread(threadToMakeActive._id, this.state.threadsToDisplay)});
        this.SetActiveThread(this.state.activeThreadIndex);
      } else {
        this.SetActiveThread(0);
      }
      socket.on("message", this.NewMessageHandler); 
    }
    this.setState({dorender: true});
  }

  NewMessageHandler(data) {
    console.log(data);
    const i = this.state.activeThreadIndex;
    const thread = this.state.threadsToDisplay[i];
    let displayedMessages = this.state.displayedMessages;
    if (this.state.userId === thread.recipient_ID._id && data.sender_ID === thread.sender_ID._id) {
      displayedMessages.push(data);
      this.setState({displayedMessages: displayedMessages});
    } else if (this.state.userId === thread.sender_ID._id && data.sender_ID === thread.recipient_ID._id) {
      displayedMessages.push(data);
      this.setState({displayedMessages: displayedMessages});
    }
    this.ChatGoToBottom();
  }

  async SetActiveThread(i) {
    this.setState({activeThreadIndex: i});
    this.setState({chatDisabled: false});
    const mresponse = await get("/api/getmessages", {threadId: this.state.threadsToDisplay[i]._id});
    this.setState({displayedMessages: mresponse.messageList});
    this.ChatGoToBottom();
  }

  GetActiveChatName() {
    const i = this.state.activeThreadIndex;
    if (i !== null && this.state.threadsToDisplay.length > 0 ) {
      const thread = this.state.threadsToDisplay[i];
      if (this.state.userId === thread.recipient_ID._id && has(thread.sender_ID, 'firstName')) {
        return thread.sender_ID.firstName;
      } else if (this.state.userId === thread.sender_ID._id && has(thread. recipient_ID, 'firstName')) {
        return thread.recipient_ID.firstName;
      } else {
        return thread._id;
      }
    }
  }

  GetActiveChatUID() {
    const i = this.state.activeThreadIndex;
    if (i !== null && this.state.threadsToDisplay.length > 0 ) {
      const thread = this.state.threadsToDisplay[i];
      if (this.state.userId === thread.recipient_ID._id) {
        return thread.sender_ID._id;
      } else if (this.state.userId === thread.sender_ID._id) {
        return thread.recipient_ID._id;
      } else {
        return null;
      }
    }
  }


  ChatGoToBottom() {
    let element = document.getElementById("ChatBubblesContainer");
    if (element.style.overflow !== 'visible') {
      element.scrollTop = element.scrollHeight;
    }
    console.log("went to bottom");
  }

  ChatBoxUpdate(event) {
    if (!(this.state.chatBoxContents === "" && event.target.value === "\n")) {
      this.setState({chatBoxContents: event.target.value});
    }
  }

  ChatBoxKey(event) {
    if(event.keyCode === 13 && event.shiftKey) { // add newline

    } else if (event.keyCode === 13 && this.state.chatBoxContents !== "") {
      this.state.displayedMessages.push({
        content: this.state.chatBoxContents,
        sender_ID: this.state.userId,
      });
      post("/api/postmessage", {
        content: this.state.chatBoxContents,
        threadId: this.state.threadsToDisplay[this.state.activeThreadIndex]._id,
        timestamp: new Date(),
      }).then
      this.setState({
        lastMessageSubmitted: this.state.chatBoxContents,
        chatBoxContents: "",
      });
      setTimeout(() => {this.ChatGoToBottom();}, 100); // if you don't add this 100 ms delay, the scroll happens before the new message shows up
    }
  }

  SearchBoxUpdate(event) {
    this.setState({searchBoxContents: event.target.value});
  }

  SearchBoxKey(event) {
    if (event.keyCode === 13) {
      this.setState({
        lastSearchQuery: this.state.searchBoxContents,
        searchBoxContents: "",
      });
      // todo: trigger a search
    }
  }

  render() {
    if (!this.state.dorender) {
      return(null);
    }
    return (
    <div className="InboxPage-SuperContainer">
      <div className="InboxPage-container">
        {!this.state.noThreads && (
          <div>
            <div className="Messages-container">
              {/*<input className="MessageSearch"
                type="text"
                placeholder="Search messages..."
                value={this.state.searchBoxContents}
                onChange={this.SearchBoxUpdate}
                onKeyDown={this.SearchBoxKey}
          /> */}

              <div className="Chat-ChatBoxHeader">
                <h1 className="Chat-ChatBoxHeaderText">people</h1>
              </div>
              {this.state.threadsToDisplay.map((thread, i)=>{return (
                <ThreadDisplay
                key={i}
                index={i}
                thread={thread}
                userId={this.state.userId}
                setActiveThread={this.SetActiveThread}
                active={this.state.activeThreadIndex===i}
                />
              );})}

            </div>
          </div>
        )}
        

        <div className="Chat-container">
          {this.state.noThreads ? (
          <div className="Chat-ChatInfoContainer">
            Message someone through their listing!
          </div>
          ) : (
          <div className="Chat-ChatInfoContainer">
            chatting with&nbsp;
            <Link to={"/profile/" + this.GetActiveChatUID()}>
            {this.GetActiveChatName()}
            </Link>
          </div>
          )}
          
          <div className="Chat-ChatBubblesContainer"
          id="ChatBubblesContainer">
            {/*this.state.displayedMessages.map(makeMessageNice)*/}
            {this.state.displayedMessages.map((message, i)=>{return (
              <MessageDisplay
                key={i}
                message={message}
                userId={this.state.userId}
                />
            );})}
          </div>

          <textarea
          rows="10"
          cols="30"
          className="ChatBox" 
          placeholder="send a message"
          value={this.state.chatBoxContents}
          onChange={this.ChatBoxUpdate}
          onKeyUp={this.ChatBoxKey}
          disabled={this.state.chatDisabled}
          />
            {/*<div className="Chat-howtosubmit">
              &#x21E7;+&#x23CE;&#x2000;to add newline{ shift plus enter to add newline
          </div>*/}
          </div>
      </div>
    </div>
    );
  }
}

InboxPage.propTypes = {
  userId: PropTypes.string,
};

export default InboxPage;

class ThreadDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nametoDisplay: "",
      photoURL: "",
    };
  }

  componentDidMount() {
    let userIsSender;
    let nameToDisplay;
    const thread = this.props.thread;
    let senderid;
    let recipid;
    if (has(thread.sender_ID, '_id')) {
      senderid = thread.sender_ID._id;
    } else {
      senderid = thread.sender_ID;
    }

    if (has(thread.recipient_ID, '_id')) {
      recipid = thread.recipient_ID._id;
    } else {
      recipid = thread.recipient_ID;
    }

    userIsSender =  (this.props.userId === senderid);

    const displayid = userIsSender ? thread.recipient_ID : thread.sender_ID;

    if (has(displayid, 'firstName')) {
      nameToDisplay = displayid.firstName;
    } else {
      nameToDisplay = JSON.stringify(displayid);
    }
    this.setState({nameToDisplay: nameToDisplay});

    post("/api/getProfilePic", {userId: displayid}).then((response) => {
      this.setState({photoURL: response.photoURL});
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    
    let threadClassName = "ThreadDisplay-container";
    if (this.props.active) {
      threadClassName += " ThreadDisplay-active";
    }
    return (
      <div
      className={threadClassName}
      onClick={()=>this.props.setActiveThread(this.props.index)}
      >
        <img className="ThreadDisplay-photo" src={this.state.photoURL || "/account.png"}/>
        <div className="ThreadDisplay-name">
          {this.state.nameToDisplay}
        </div>
      </div>
    );
  }
}

ThreadDisplay.propTypes = {
  thread: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  setActiveThread: PropTypes.func,
  index: PropTypes.number.isRequired,
  active: PropTypes.bool.isRequired,
};

class MessageDisplay extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      fromme: false,
    };
  }

   render () {
    let messageClassname = "ChatBubble-textContainer";
    if (this.props.message.sender_ID === this.props.userId) {
      messageClassname += " ChatBubble-textContainer-fromme";
    } else {
      messageClassname += " ChatBubble-textContainer-fromyou";
    }
    return (
      <div className={messageClassname}>
        {this.props.message.content}
      </div>
    );
  }
}

MessageDisplay.propTypes = {
  userId: PropTypes.string.isRequired,
  message: PropTypes.object.isRequired
}