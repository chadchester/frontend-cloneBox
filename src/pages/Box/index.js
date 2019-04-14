import React, { Component } from 'react';
import api from '../../Services/api';
import { distanceInWords } from 'date-fns';
import en from 'date-fns/locale/en';
import DropZone from 'react-dropzone';
import { MdInsertDriveFile } from 'react-icons/md';
import logo from '../../assets/logo.svg';
import socket from 'socket.io-client';
import "./style.css";

export default class Box extends Component {
    state = { box: {} };

    async componentDidMount(){
        this.subscribeToNewFiles();

        const box = this.props.match.params.id;
        const response = await api.get(`boxes/${box}`);
        this.setState({ box: response.data});
    }
    subscribeToNewFiles = ()=> {
        const box = this.props.match.params.id;
        const io = socket('https://app-box-backend.herokuapp.com');

        io.emit('connectRoom', box);
        io.on('file', data => {
            this.setState({ 
            box: { ...this.state.box, files: [data, ...this.state.box.files]} 
            });
        });

    };
    handleUpload = files =>{
        files.forEach(file => {
            const data = new FormData();
            const box = this.props.match.params.id;

            data.append('file', file);
            api.post(`boxes/${box}/files`, data);
        });
    };

  render() {
    return (
        <div id="box-container">
        <header>
            <img src={logo} alt="" />
            <h1>{this.state.box.title}</h1>
        </header>

        <DropZone onDropAccepted={this.handleUpload}>
                {({getRootProps, getInputProps})=>(
                        <div className="upload" {...getRootProps()}>
                            <input { ... getInputProps()} /> 
                            <p>
                                Drop here your files 
                            </p>
                        </div>
                )}
        </DropZone>
        <ul>
            {this.state.box.files && this.state.box.files.map(file =>(
                 <li key={file._id}>
                 <a className="fileInfo" href={file.url} target="blank">
                     <MdInsertDriveFile size={24} color="#A5Cfff" />
                     <strong> {file.title} </strong>
                  </a>
                  <span>Since{" "} {distanceInWords(file.createdAt, new Date(), {
                      locate: en})}
                      </span>
             </li>        
            ))}
           
        </ul>
    </div>
    );
  }
}
