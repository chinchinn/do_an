/* eslint-disable react-hooks/exhaustive-deps */
import React, { Component, useEffect, useRef, useState } from "react";
import {
  TitleBar,
  AgentBar,
  Row,
  Column,
  Title,
  Subtitle,
  Avatar,
  IconButton,
  RateGoodIcon,
  RateBadIcon,
  CloseIcon,
  MessageList,
  MessageGroup,
  Message,
  Bubble,
  MessageText,
  MessageButtons,
  TextComposer,
  Fill,
  TextInput,
  SendButton,
  Fit,
  ThemeProvider,
  Chat,
} from "@livechat/ui-kit";
import * as signalR from "@microsoft/signalr";
import axiosInstance from "../../utils/axiosInstance";
import moment from "moment";
import { message, Badge } from "antd";
import { connect } from "react-redux";

function MaximizedV2(props) {
  const { userId } = props;
  const [hub, setHub] = useState(null);
  const [list, setList] = useState([]);
  const listRef = useRef([]);
  const [connectionId, setConnectionId] = useState(null);
  const [receiverId, setReceiverId] = useState(null);

  useEffect(() => {
    if (props?.userId) {
      axiosInstance("Chat/GetMessages", "POST", {
        senderId: props?.userId,
        receiverId: receiverId,
      }).then((res) => {
        if (res?.data?.length > 0) {
          setList(res?.data);
          listRef.current = res?.data;
        }
      });
      connectServerHub();
    } else {
      message.warning("Vui lòng đăng nhập để chat với Admin!", 4);
      props.minimize();
    }
  }, [props?.userId]);

  useEffect(() => {
   
    if (props?.userId === null || props?.userId === "") {
      props.minimize();
    }
  }, [props.userId]);

  useEffect(() => {
    return () => {
      setHub(null);
    };
  }, []);

  function onMessageSend(value) {
    if (props.userId) {
      //let receiverId = null;
      if (props.role === "Admin" && receiverId === null) {
        message.warning("Vui lòng chọn đối tượng để chat!", 4);
        return;
      }

      console.log(" có xún đây");

      hub
        .invoke("SendMessage", {
          content: value,
          senderId: props?.userId,
          connectionId: connectionId,
          receiverId: receiverId,
        })
        .then((message) => console.log("res: ", message));
    } else {
      console.log("click");
      message.warning("Vui lòng Đăng nhập để Chat với Admin!", 4);
    }
  }

  function setNewValue(message) {
    const newList = [...listRef.current, message];
    listRef.current = newList;
    setList(newList);
  }

  function clickReplyUser(user) {
    setReceiverId(user.id);
  }

  function connectServerHub() {
    const token = localStorage.getItem("access_token")
      ? JSON.parse(localStorage.getItem("access_token"))
      : "";
    const hubCB = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:5001/chatHub", {
        accessTokenFactory: () => `${token.value}`,
      })
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setHub(hubCB);
  }

  useEffect(() => {
    if (hub != null) {
      hub
        .start()
        .then(() => {
          hub.invoke("GetConnectionId").then((connectionId) => {
            setConnectionId(connectionId);
          });

          hub.on("ReceiveMessage", (message) => {
            console.log("Mount: ", message);
            setNewValue(message);
          });
          hub.on("UpdateUserList", (_connections) => {
            console.log("connection: ", _connections);
          });
          hub.on("UserOnlineList", (userOnlineList) => {
            console.log("user online: ", userOnlineList);
          });
        })
        .catch(() => console.log("fail"));
    }
  }, [hub]);

  function renderMessageList() {
    return list.length <= 0
      ? null
      : list.map((ele) => {
          //if(ele.senderId === userId || ele.receiverId === userId)
          //{
          return (
            <MessageGroup
              avatar={
                ele?.receiverId === userId
                  ? ele?.sender?.avatar ||
                    "https://img1a.flixcart.com/www/linchpin/fk-cp-zion/img/profile-pic-male_2fd3e8.svg"
                  : null
              }
              key={ele.id}
              onlyFirstWithMeta
            >
              <Message
                style={{ padding: 0 }}
                date={moment(ele.createDate).format("hh:mm DD/MM/YYYY")}
                authorName={
                  userId !== ele?.senderId
                    ? ele?.sender?.displayname + " - "
                    : "Me - "
                }
                isOwn={ele.senderId === userId ? true : false}
              >
                <Bubble isOwn={ele.senderId === userId ? true : false}>
                  <MessageText style={{ padding: "0.5em", minWidth: 100 }}>
                    {ele.content}
                  </MessageText>
                </Bubble>
              </Message>
              <MessageButtons
                onClick={() => clickReplyUser(ele.sender)}
                style={
                  (ele?.senderId === userId &&
                    ele?.receiver?.displayname === "Admin") ||
                  userId === ele.senderId
                    ? { display: "none" }
                    : {
                        display: "inline-block",
                        textAlign: "center",
                        fontWeight: "bold",
                        border: "1px solid #91d5ff",
                        fontSize: 10,
                        borderRadius: "5",
                        width: "50",
                        color: "#91d5ff",
                        cursor: "pointer",
                      }
                }
              >
                Reply
              </MessageButtons>
            </MessageGroup>
          );
          //}
          //return null;
        });
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        //background: 'gray'
      }}
    >
      <TitleBar
        style={{ paddingLeft: "20px" }}
        key={1}
        leftIcons={[<Badge key="active" color="green" status="processing" />]}
        rightIcons={[
          <IconButton key="close" onClick={props.minimize}>
            <CloseIcon />
          </IconButton>,
        ]}
        title="WELCOME TO ONLINE SHOP"
      ></TitleBar>
      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          height: "100%",
        }}
      >
       
          <MessageList active containScrollInSubtree>
            {!!userId && renderMessageList() === null ? (
              <Message
                date={moment(new Date().now).format("hh:mm DD/MM/YYYY")}
                authorName="BOT"
                authorOpened={true}
                isOwn={false}
                key={1}
              >
                <Bubble isOwn={false}>
                  <MessageText style={{ padding: "0.5em" }}>
                    {"Can I help you ?"}
                  </MessageText>
                </Bubble>
              </Message>
            ) : null}
            {renderMessageList()}
          </MessageList>
      
      </div>
      <TextComposer onSend={onMessageSend.bind(this)}>
        <Row align="center">
          <Fill>
            <TextInput />
          </Fill>
          <Fit>
            <SendButton fit />
          </Fit>
        </Row>
      </TextComposer>
      <div
        style={{
          textAlign: "center",
          fontSize: ".6em",
          padding: ".4em",
          background: "#fff",
          color: "#888",
        }}
      >
        {"Powered by Online Shop"}
      </div>
    </div>
  );
}
const mapStateToProps = (state) => {
  return {
    userId: state.auth.userId,
    role: state.auth.role,
  };
};
export default connect(mapStateToProps, null)(MaximizedV2);
