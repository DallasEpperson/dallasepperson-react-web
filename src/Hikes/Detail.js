import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { LatLngBounds } from "leaflet";

import './Detail.scss';
import HikePath from "./HikePath";
import LabeledData from "../LabeledData";
import { Helmet } from "react-helmet";

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

function ChangeView({toHike}){
    const map = useMap();
    if(!toHike) return null;
    let bounds = new LatLngBounds();
    for (let i = 0; i < toHike.path.length; i++) {
        const coord = toHike.path[i];
        bounds.extend(coord);
    }
    map.fitBounds(bounds);
    return null;
}

function Detail() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(0);
    const [distance, setDistance] = useState(0);
    const [oab, setOab] = useState(false);
    const [name, setName] = useState('');
    const [hike, setHike] = useState(null);



    useEffect(() => {
        const getHike = async () => {
            let hike = await (await fetch(`/hikes/hike-${id}.json`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                })).json();
            return hike;
        };

        (async () => {
            let jsonHike = await getHike();
            setDate(jsonHike.date);
            setDistance(jsonHike.distance);
            setName(jsonHike.name);
            setOab(!!jsonHike.outAndBack);
            setHike(jsonHike);
            setLoading(false);
        })();
    }, [id]);

    if(!(/^\d+$/.test(id))){
        console.log(`"${id}" is not an id. Redirecting to root.`);
        return (
            <Navigate to="/" replace />
        )
    }

    return (
        <div className="hike-detail">
            <Helmet>
                <title>Dallas Epperson Hikes | {name}</title>
            </Helmet>
            <div className="header">
                <div className="return">
                    <Link to="/hikes/">
                        &lt;
                    </Link>
                </div>
                <div className="name">
                    { loading ?
                    "loading"
                    :
                    name}
                </div>
            </div>

            <MapContainer center={[0, 0]} zoom={1} scrollWheelZoom={true}>
                <ChangeView toHike={hike} />
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {hike?
                <HikePath hike={hike} />
                : null }
            </MapContainer>
            <div className="terrain">Terrain profile goes here.</div>
            <div className="metadata">
                {
                    loading ?
                    null :
                    <div>
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
            <div className="writeup">Writeup goes here.</div>
        </div>
    );
}

export default Detail;