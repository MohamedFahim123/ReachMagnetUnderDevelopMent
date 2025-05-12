import React from 'react'
import { NavLink } from 'react-router-dom';

export default function ShowLocationOnMap({ latitude, longitude }) {
    if (!latitude || !longitude) return null;
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return (
        <NavLink
            to={googleMapsUrl}
            target="_blank"
            // rel="noopener noreferrer"
            style={({ isActive }) => ({
                color: isActive ? 'red' : '#007bff',
                textDecoration: 'none',
                cursor: 'pointer',
            })}
        >
            Show Location
        </NavLink>
    )
}
