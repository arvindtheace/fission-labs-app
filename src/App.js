import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Dropzone from 'react-dropzone';
import Papa from 'papaparse';
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
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () => console.log('file reading has failed');
    reader.readAsBinaryString(files[0]);
  }
  _onDropRejected = () => {
    console.log('rejected');
    // DomUtils.toastr().info(DomUtils.globalizeMessage('Sorry we only accept csv, json, xml, or html file extension.'), DomUtils.globalizeMessage('File cannot be uploaded'))
  }
  render() {
    return (
      <div className="container">
        <div className="row" style={{ marginTop: '20px' }}>
          <div className="col-md-10 col-md-offset-1 col-sm-10 col-sm-offset-1">
            <div className="dropzone-area">
              <Dropzone ref="drop" className="dropzone"
                accept=".csv" onDropRejected={this._onDropRejected}
                onDropAccepted={this._onDrop} disableClick={true}>
                <div>{"Drag and drop files"}</div>
              </Dropzone>
              <button type="button" className="btn btn-success" onClick={this._open}>
                Click to upload
              </button>
              {this.state.chartConfig && (
                <ReactHighcharts config={this.state.chartConfig}></ReactHighcharts>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
