import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import "./Hikes.scss";

const polyline = [
    [51.505, -0.09],
    [51.51, -0.1],
    [51.51, -0.12],
  ];

const lineOptions = { color: 'lime'};

function Hikes() {
    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[51.505, -0.09]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            <Polyline pathOptions={lineOptions} positions={polyline}>
                <Popup>
                    I popped up.
                </Popup>
            </Polyline>
        </MapContainer>
    );
}

export default Hikes;