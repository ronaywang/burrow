import React, {Component} from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import {g_apikey} from "../../utilities";
import "./Map.css";

class Map extends Component{
  static PropTypes = {
    styleName: PropTypes.string.isRequired,
    zoom: PropTypes.number.isRequired,
    center: PropTypes.shape({
      lat: PropTypes.number.isRequired,
      lng: PropTypes.number.isRequired,
    })
  }
  constructor(props){
    super(props);
  }
  render(){
    return (
      <div className={`${this.props.styleName}-mapContainer`}>
        <LoadScript
          googleMapsApiKey={g_apikey}
          libraries = {["places"]}
        >
          <GoogleMap
            mapContainerStyle={`${this.props.styleName}-map`}
            zoom={this.props.zoom}
            center={this.props.center}
          >
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default Map;