import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./Map.css";
//import { g_apikey } from "../../utilities";
//import Script from "react-load-script";


class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapIsLoaded: false,
      map: undefined,
      marker: undefined,
      markersLoaded: false,
      markerObjArray: [],
      infoWindowsArray: [],
    };
  }

  componentDidUpdate() {
    if (!this.state.mapIsLoaded) {
      if (typeof google !== 'undefined') {
        this.handleScriptLoad();
        this.state.mapIsLoaded = true;
      }
    } else {
      if (this.props.newCenter) {
        this.state.map.setCenter(this.props.newCenter);
      }
      if (!this.state.markersLoaded && this.props.markers) {
        this.props.markers.forEach((markerloc)=> {
          var marker = new google.maps.Marker({position: markerloc.coordinates, title: markerloc.markertitle, map: this.state.map});
          var infowindow = new google.maps.InfoWindow({content: markerloc.markertitle});
          marker.addListener('click', ()=>{infowindow.open(this.state.map, marker);});
          this.state.markerObjArray.push(marker);
          this.state.infoWindowsArray.push(infowindow);
        })
      }
    }
  }

  componentDidMount() {
  if (!this.state.mapIsLoaded) {
      if (typeof google !== 'undefined') {
        this.handleScriptLoad();
        this.setState({mapIsLoaded: true});
      }
    }
  }

  handleScriptLoad() {
  let map = new google.maps.Map(
      document.getElementById('map'), {zoom: this.props.initialZoom, center: this.props.initialCenter});
  this.setState({map: map});
  }

  render() {
    let width, height;
    if (this.props.height) {
      height = this.props.height;
    } else {
      height = 480;
    }
    if (this.props.width) {
      width = this.props.width;
    } else {
      width = 640;
    }
    return (
      <div id="map" key={this.props.initialCenter} className="u-flex">
      </div>
    );
  }
}

MapComponent.propTypes = {
  markers: PropTypes.instanceOf(Array),
  initialCenter: PropTypes.object.isRequired,
  initialZoom: PropTypes.number.isRequired,
  newCenter: PropTypes.object,
  width: PropTypes.number,
  height: PropTypes.number,
};

export default MapComponent;
