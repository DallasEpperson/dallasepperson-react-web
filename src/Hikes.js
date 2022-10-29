import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

import LabeledData from './LabeledData';

import "leaflet/dist/leaflet.css";
import "./Hikes.scss";

const fakeDelay = (ms) => {
    return new Promise(r => setTimeout(r, ms));
};

function HikePath({ hike }) {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [name, setName] = useState("");
    const [distance, setDistance] = useState(0);
    

    const loadDetails = async (id) => {
        setLoadingDetails(true);
        console.log(`Loading details of hike ${id}.`);
        await fakeDelay(2000);
        setName("The hike name");
        setDistance(1234);
        setLoadingDetails(false);
    };

    const handleClick = async (_event) => {
        await loadDetails(hike.id);
    };

    return (
        <Polyline positions={hike.path} eventHandlers={{ click: handleClick }}>
            <Popup>
                <div className='details'>
                    {loadingDetails ?
                        <div>Loading...</div>
                        :
                        <div>
                            <LabeledData label='Name' value={name} />
                            <LabeledData label='Distance' value={distance} />
                        </div>
                    }
                </div>
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
        <MapContainer center={[35.4178103, -82.7477285]} zoom={12} scrollWheelZoom={false}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {hikes.map((a) => {
                return (
                    <HikePath key={'hike-' + a.id} hike={a} />
                );
            })}
        </MapContainer>
    );
}

export default Hikes;