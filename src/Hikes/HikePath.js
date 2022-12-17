/// <reference path="../typedef/hike.d.ts"/>

import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Polyline, Popup } from 'react-leaflet';

import LabeledData from '../LabeledData';

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

const randomColor = function () {
    const randomInteger = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    var hue = randomInteger(210, 390) % 360;
    var sat = randomInteger(45, 95);
    var lum = randomInteger(40, 60);
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
        await fakeDelay(1000);
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
                            <div className='full-link'>
                                <Link to={`/hikes/${hike.id}`}>
                                    Full Details
                                </Link>
                            </div>
                        </div>
                    }
                </div>
            </Popup>
        </Polyline>
    );
}

export default HikePath;