import React from "react";
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
const g_apikey = "AIzaSyCR-ulCKD_elY8EERVo4GCa07_ABalJvw8";

class MapTestComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
  }

  render() {
    const MyMapComponent = withScriptjs(withGoogleMap((props) =>
      <GoogleMap
        defaultZoom={15}
        defaultCenter={{ lat: 42.360495, lng: -71.093779 }}
      >
        {props.isMarkerShown && <Marker position={{ lat: -34.397, lng: 150.644 }} />}
      </GoogleMap>
    ));

    return (
        <MyMapComponent
          isMarkerShown
          googleMapURL={"https://maps.googleapis.com/maps/api/js?key=" + g_apikey + "&v=3.exp&libraries=geometry,drawing,places"}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
    );
  }
}

export default MapTestComponent;