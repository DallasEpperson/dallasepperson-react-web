/// <reference path="../typedef/hike.d.ts"/>

import { useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Polyline, Popup } from 'react-leaflet';

import LabeledData from '../LabeledData';

import "leaflet/dist/leaflet.css";
import "./Hikes.scss";

const preferredUnit = 'mi';

const convertToPreferredUnit = function (meters) {
    switch (preferredUnit) {
        case 'KM':
            return (meters / 1000).toFixed(2) + 'KM';
        case 'mi':
            return (meters * 0.00062137).toFixed(2) + 'mi';
        default:
            return meters + 'M';
    }
};

const randomColor = function(){
    const randomInteger = function(min,max){
      return Math.floor(Math.random() * (max-min+1))+min;
    };
    var hue = randomInteger(210,390)%360;
    var sat = randomInteger(45,95);
    var lum = randomInteger(40,60);
    return 'hsl(' + hue + ',' + sat + '%,' + lum + '%)';
  };

const fakeDelay = (ms) => {
    return new Promise(r => setTimeout(r, ms));
};

function HikePath({ hike }) {
    const [loadingDetails, setLoadingDetails] = useState(true);
    const [name, setName] = useState("");
    const [date, setDate] = useState(0);
    const [distance, setDistance] = useState(0);
    const [oab, setOab] = useState(false);

    /** Get hike details from API.
     * @param {number} id ID of the hike.
     * @returns {Promise<Hike>} Promise resolving to the hike details.
     */
    const getHikeDetails = async (id) => {
        return await (await fetch(`/hikes/hike-${id}.json`,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })).json();
    };


    const loadDetails = async (id) => {
        setLoadingDetails(true);
        console.log(`Loading details of hike ${id}.`);
        await fakeDelay(2000);
        let details = await getHikeDetails(id);
        setName(details.name);
        setDate(details.date);
        setDistance(details.distance);
        setOab(!!details.outAndBack);
        setLoadingDetails(false);
    };

    const options = useMemo(() => {
        return {
            color: randomColor(),
            weight: 8
        };
    }, []);

    const handleClick = async (_event) => {
        await loadDetails(hike.id);
    };

    return (
        <Polyline pathOptions={options} positions={hike.path} eventHandlers={{ click: handleClick }}>
            <Popup>
                <div className='details'>
                    {loadingDetails ?
                        <div>Loading...</div>
                        :
                        <div>
                            <LabeledData label='Name' value={name} />
                            <LabeledData label='Date' value={(new Date(date)).toLocaleDateString()} />
                            <LabeledData label='Distance' value={convertToPreferredUnit(distance)} />
                            {
                                oab ?
                                    <LabeledData label='Out and Back' value='Yes' />
                                    : null
                            }
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