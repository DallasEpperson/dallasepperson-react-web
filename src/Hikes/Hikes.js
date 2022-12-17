/// <reference path="../typedef/hike.d.ts"/>

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Routes, Route } from "react-router-dom";

import Detail from './Detail';
import HikePath from './HikePath';

import "leaflet/dist/leaflet.css";
import "./Hikes.scss";

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
        <Routes>
            <Route path="/" element={
                <MapContainer center={[35.4178103, -82.7477285]} zoom={12} scrollWheelZoom={true}>
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
            } />
            <Route path="/:id" element={<Detail />} />
            <Route path="*" element={<div>No match inside hikes</div>} />
        </Routes>

    );
}

export default Hikes;