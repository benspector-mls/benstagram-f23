import { useContext, useEffect } from "react";
import CurrentUserContext from '../contexts/current-user-context'
import { useParams } from "react-router-dom";


let mediaConstraints = {
  video: {
    width: 1280,
    height: 720,
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
}

async function captureMediaDevices() {
  const stream = await navigator.mediaDevices.getUserMedia(mediaConstraints)
  return stream
}

export default function VideoChat() {
  const { currentUser } = useContext(CurrentUserContext);
  const { recipient_id } = useParams();

  useEffect(() => {
    if (!currentUser) return;
    var peer_id;
    var username;
    var conn;

    /**
     * Important: the host needs to be changed according to your requirements.
     * e.g if you want to access the Peer server from another device, the
     * host would be the IP of your host namely 192.xxx.xxx.xx instead
     * of localhost.
     *
     * The iceServers on this example are public and can be used for your project.
     */
    var peer = new Peer({
      host: "localhost",
      port: 9000,
      path: '/peerjs',
      debug: 3,
      config: {
        'iceServers': [
          { url: 'stun:stun1.l.google.com:19302' },
          {
            url: 'turn:numb.viagenie.ca',
            credential: 'muazkh',
            username: 'webrtc@live.com'
          }
        ]
      }
    });

    // Once the initialization succeeds:
    // Show the ID that allows other user to connect to your session.
    peer.on('open', function () {
      document.getElementById("peer-id-label").innerHTML = peer.id;
    });

    // When someone connects to your session:
    //
    // 1. Hide the peer_id field of the connection form and set automatically its value
    // as the peer of the user that requested the connection.
    // 2.
    peer.on('connection', function (connection) {
      conn = connection;
      peer_id = connection.peer;

      // Use the handleMessage to callback when a message comes in
      conn.on('data', handleMessage);

      // Hide peer_id field and set the incoming peer id as value
      document.getElementById("peer_id").className += " hidden";
      document.getElementById("peer_id").value = peer_id;
      document.getElementById("connected_peer").innerHTML = connection.metadata.username;
    });

    peer.on('error', function (err) {
      alert("An error ocurred with peer: " + err);
      console.error(err);
    });

    /**
     * Handle the on receive call event
     */
    peer.on('call', function (call) {
      var acceptsCall = confirm("Videocall incoming, do you want to accept it ?");

      if (acceptsCall) {
        // Answer the call with your own video/audio stream
        call.answer(window.localStream);

        // Receive data
        call.on('stream', function (stream) {
          // Store a global reference of the other user stream
          window.peer_stream = stream;
          // Display the stream of the other user in the peer-camera video element !
          onReceiveStream(stream, 'peer-camera');
        });

        // Handle when the call finishes
        call.on('close', function () {
          alert("The videocall has finished");
        });

        // use call.close() to finish a call
      } else {
        console.log("Call denied !");
      }
    });

    /**
     * Starts the request of the camera and microphone
     *
     * @param {Object} callbacks
     */
    function requestLocalVideo(callbacks) {
      // Monkeypatch for crossbrowser geusermedia
      navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

      // Request audio an video
      navigator.getUserMedia({ audio: true, video: true }, callbacks.success, callbacks.error);
    }

    /**
     * Handle the providen stream (video and audio) to the desired video element
     *
     * @param {*} stream
     * @param {*} element_id
     */
    function onReceiveStream(stream, element_id) {
      // Retrieve the video element according to the desired
      var video = document.getElementById(element_id);
      // Set the given stream as the video source
      video.srcObject = stream;

      // Store a global reference of the stream
      window.peer_stream = stream;
    }

    /**
     * Appends the received and sent message to the listview
     *
     * @param {Object} data
     */
    function handleMessage(data) {
      var orientation = "text-left";

      // If the message is yours, set text to right !
      if (data.from == username) {
        orientation = "text-right"
      }

      var messageHTML = '<a href="javascript:void(0);" className="list-group-item' + orientation + '">';
      messageHTML += '<h4 className="list-group-item-heading">' + data.from + '</h4>';
      messageHTML += '<p className="list-group-item-text">' + data.text + '</p>';
      messageHTML += '</a>';

      document.getElementById("messages").innerHTML += messageHTML;
    }

    /**
     * Handle the send message button
     */
    document.getElementById("send-message").addEventListener("click", function () {
      // Get the text to send
      var text = document.getElementById("message").value;

      // Prepare the data to send
      var data = {
        from: username,
        text: text
      };

      // Send the message with Peer
      conn.send(data);

      // Handle the message on the UI
      handleMessage(data);

      document.getElementById("message").value = "";
    }, false);

    /**
     *  Request a videocall the other user
     */
    document.getElementById("call").addEventListener("click", function () {
      console.log('Calling to ' + peer_id);
      console.log(peer);

      var call = peer.call(peer_id, window.localStream);

      call.on('stream', function (stream) {
        window.peer_stream = stream;

        onReceiveStream(stream, 'peer-camera');
      });
    }, false);

    /**
     * On click the connect button, initialize connection with peer
     */
    document.getElementById("connect-to-peer-btn").addEventListener("click", function () {
      username = document.getElementById("name").value;
      peer_id = document.getElementById("peer_id").value;

      if (peer_id) {
        conn = peer.connect(peer_id, {
          metadata: {
            'username': username
          }
        });

        conn.on('data', handleMessage);
      } else {
        alert("You need to provide a peer to connect with !");
        return false;
      }

      document.getElementById("chat").className = "";
      document.getElementById("connection-form").className += " hidden";
    }, false);

    /**
     * Initialize application by requesting your own video to test !
     */
    requestLocalVideo({
      success: function (stream) {
        window.localStream = stream;
        onReceiveStream(stream, 'my-camera');
      },
      error: function (err) {
        alert("Cannot get access to your camera and video !");
        console.error(err);
      }
    });



  }, [currentUser])


  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6 col-lg-6">
          {/* <!--
          Display video of the current user
          Note: mute your own video, otherwise you'll hear yourself ...
                 --> */}
          <div className="text-center">
            <video id="my-camera" width="300" height="300" autoPlay="autoplay" muted={true} className="center-block"></video>
            <span className="label label-info">You</span>
          </div>
        </div>

        <div className="col-md-6 col-lg-6">
          {/* <!-- Display video of the connected peer --> */}
          <div className="text-center">
            <video id="peer-camera" width="300" height="300" autoPlay="autoplay" className="center-block"></video>
            <span className="label label-info" id="connected_peer"></span>
          </div>
        </div>
      </div>

      <div className="row">
        <h1 className="text-center">
          Videochat Example
          <br />
          <small> Share the following ID with the pal that wants to talk with you</small>
        </h1>
        {/* <!-- The ID of your current session --> */}
        <h4 className="text-center">
          <span id="peer-id-label"></span>
        </h4>
        <div className="col-md-12 col-lg-12">
          <div className="form-horizontal" id="connection-form">
            <fieldset>
              <legend>Connection Form</legend>
              <div className="form-group">
                <label htmlFor="name" className="col-lg-2 control-label">Username</label>
                <div className="col-lg-10">
                  <input type="text" className="form-control" name="name" id="name" placeholder="Your random username" />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="peer_id" className="col-lg-2 control-label">Peer ID (id of your pal)</label>
                <div className="col-lg-10">
                  <input type="text" className="form-control" name="peer_id" id="peer_id" placeholder="Peer ID" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" />

                  {/* <!-- Show message if someone connected to the client --> */}
                  <div id="connected_peer_container" className="hidden">
                    An user is already connected to your session. Just provide a name to connect !
                  </div>
                </div>
              </div>
              <div className="form-group">
                <div className="col-lg-10 col-lg-offset-2">
                  <button id="connect-to-peer-btn" className="btn btn-primary">Connect to Peer</button>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
        <div className="col-md-12 col-lg-12">
          <div id="chat" className="hidden">
            <div id="messages-container">
              <div className="list-group" id="messages"></div>
            </div>
            <div id="message-container">
              <div className="form-group">
                <label className="control-label">Live chat</label>
                <div className="input-group">
                  <span className="input-group-btn">
                    <button id="call" className="btn btn-info">Call</button>
                  </span>
                  <input type="text" className="form-control" name="message" id="message" placeholder="Your messag here ..." />
                  <span className="input-group-btn">
                    <button id="send-message" className="btn btn-success">Send Message</button>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}