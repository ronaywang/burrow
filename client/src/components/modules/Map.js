import React, {Component} from "react";
import PropTypes from "prop-types";
import "../../utilities.css";
import "./Map.css";
import { g_apikey } from "../../utilities";
import Script from "react-load-script";


class MapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mapIsLoaded: false,
      map: undefined,
      marker: undefined,
    };
  }

  componentDidUpdate() {
    if (!this.state.mapIsLoaded) {
      if (google) {
        this.handleScriptLoad();
        this.state.mapIsLoaded = true;
      }
    } else {
      if (this.props.newCenter) {
        this.state.map.setCenter(this.props.newCenter);
        let newmarker = new google.maps.Marker({
          position: this.props.newCenter,
        });
        if (this.state.marker) {
          this.state.marker.setMap(null);
        }
        newmarker.setMap(this.state.map);
        this.state.marker = newmarker;
      }
    }
  }

  handleScriptLoad  = () => {
  let map = new google.maps.Map(
      document.getElementById('map'), {zoom: this.props.initialZoom, center: this.props.initialCenter});
  this.setState({map: map});
  };

  render() {
    return (
      <div id="map" className="u-flex">
      </div>
    );
  }
}

MapComponent.propTypes = {
  markers: PropTypes.array,
  initialCenter: PropTypes.object.isRequired,
  initialZoom: PropTypes.number.isRequired,
};

export default MapComponent;