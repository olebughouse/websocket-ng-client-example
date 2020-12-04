import {Component, OnInit} from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'websocket-ng-client';

  webSocketServerUri = 'http://localhost:8080/backend';

  isConnected = false;

  greenOn = false;

  pingOn = false;

  stompClient;

  ngOnInit() {
  }

  startUp() {
    const socket = new SockJS(this.webSocketServerUri);
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, frame => {
      console.log('Connected: ' + frame);
      this.isConnected = true;

      this.stompClient.subscribe('/ws/ping', messageOutput => {
        console.log(JSON.parse(messageOutput.body));
        this.pingOn = !this.pingOn;
      });

      this.stompClient.subscribe('/ws/up', message => {
        console.log(JSON.parse(message.body));
        this.greenOn = this.greenOn === false;
      });
    });
  }

  sendMsg() {
    this.stompClient.send('/app/incoming', {},
      JSON.stringify({ from: 'APP', text: 'Hello world!' }));
  }

  stop() {
    if (this.stompClient != null && this.isConnected) {
      this.stompClient.disconnect();
      this.isConnected = false;
    }
  }
}
