import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

import "leaflet/dist/leaflet.css";
import "./Hikes.scss";

function Hike({ hike }) {
    return (
        <Polyline positions={hike.path}>
            <Popup>
                Yo
            </Popup>
        </Polyline>
    );
}

function Hikes() {
    const [hikes, setHikes] = useState([]);

    const getHikes = async () => {
        let hikes = await (await fetch('/hikes/hikes.json',
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })).json();
        return hikes;
    };

    useEffect(() => {
        (async () => {
            let jsonHikes = await getHikes();
            setHikes(jsonHikes.hikes);
        })();
    }, []);

    return (
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hikes.map((a) => {
                return (
                    <Hike key={'hike-' + a.id} hike={a} />
                );
            })}
        </MapContainer>
    );
}

export default Hikes;