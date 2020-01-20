import React from "react";
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import { g_places_api_url } from "../../utilities";

//const g_places_api = require(g_places_api_url);
const mycenter = {lat: 42.360495, lng: -71.093779 };

const mapContainerStyle = {
  height: "400px",
  width: "800px"
};

class MapTestComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    return (
      <div className="u-flex u-flex-alignCenter u-flex-justifyCenter">
      <LoadScript
        googleMapsApiKey={g_apikey}
        libraries = {["places"]}
      >
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={18}
          center={mycenter}
        >
        </GoogleMap>
      </LoadScript>
      </div>
    );
  }
}

export default MapTestComponent;