import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'toastr/build/toastr.css';
import './App.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
var toastr = require('toastr');
const ReactHighcharts = require('react-highcharts');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartConfig: null
    }
  }
  _open = () => {
    var fileInput = ReactDOM.findDOMNode(this.refs.drop.fileInputEl);
    fileInput.value = null;
    fileInput.click();
  }
  showErrorToast = (msg) => {
    var _toastrOptions = {
      'closeButton': true,
      'debug': false,
      'newestOnTop': true,
      'progressBar': true,
      'positionClass': 'toast-bottom-left',
      'preventDuplicates': true,
      'showDuration': '300',
      'hideDuration': '1000',
      'timeOut': '5000',
      'extendedTimeOut': '1000',
      'showEasing': 'swing',
      'hideEasing': 'linear',
      'showMethod': 'fadeIn',
      'hideMethod': 'fadeOut'
    };
    toastr.options = _toastrOptions;
    toastr.error(msg);
  }
  processChartData = (data) => {
    var series = [];
    data.map((seriesArray) => {
      let seriesObj = {};
      seriesObj.data = [];
      seriesArray.map((point, index) => {
        if (index === 0) {
          seriesObj.name = point;
        }
        else {
          let pointArr = point.split("|");
          let dataObj = { name: pointArr[0], y: parseInt(pointArr[1]) }
          seriesObj.data.push(dataObj);
        }
      })
      series.push(seriesObj);
    })
    const chartConfig = {
      chart: {
        type: 'line',
      },
      title: {
        text: null
      },
      "credits": false
    };
    chartConfig.series = series;
    return chartConfig;
  }
  _onDrop = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fileAsBinaryString = reader.result;
      var parsedData = Papa.parse(fileAsBinaryString);
      const chartConfig = this.processChartData(parsedData.data);
      this.setState({ chartConfig });
    };
    reader.onabort = () => this.showErrorToast('file reading was aborted');
    reader.onerror = () => this.showErrorToast('file reading has failed');
    reader.readAsBinaryString(files[0]);
  }
  _onDropRejected = () => {
    this.showErrorToast('Sorry only csv files supported');
  }
  render() {
    return (
      <div className="container">
        <div className="dropzone-area">
          <Dropzone ref="drop" className="dropzone"
            accept=".csv" onDropRejected={this._onDropRejected}
            onDropAccepted={this._onDrop} disableClick={true}>
            <div>{"Drag and drop files"}</div>
          </Dropzone>
          <br></br>
          <button type="button" className="btn btn-success" onClick={this._open}>
            Click to upload
              </button>
          {this.state.chartConfig && (
            <ReactHighcharts config={this.state.chartConfig}></ReactHighcharts>
          )}
        </div>
      </div>
    );
  }
}

export default App;
