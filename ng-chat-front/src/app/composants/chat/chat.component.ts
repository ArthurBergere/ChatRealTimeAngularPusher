import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import Pusher from 'pusher-js';

interface MessageData {
  username: string;
  message: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})


export class ChatComponent implements OnInit {

  public username = 'username';
  messages: MessageData[] = [];
  message ='';



  constructor( private http: HttpClient){

  }
  ngOnInit() : void {

    // Enable pusher logging - don't include this in production
    Pusher.logToConsole = true;

    const pusher = new Pusher('4ea25cba3748175c1de6', {
      cluster: 'eu'
    });

    const channel = pusher.subscribe('my-channel');
    channel.bind('new-message', (data: MessageData) => {
      this.messages.push(data)
    });

  }
  // submit():void {
  //   this.http.post('http://localhost:3000/messages', {
  //     username: this.username,
  //     message: this.message
  //   }).subscribe(() => this.message = '');
  // }
  sendMessage(): void {
    this.http
      .post<MessageData>('http://localhost:3000/messages', {
        username: this.username,
        message: this.message
      })
      .subscribe((newMessage) => {


      });
  }

}
