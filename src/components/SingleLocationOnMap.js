import React from 'react';

function SingleLocationOnMap(props) {
    /**
     * Stateless Functional component.
     */
    return (
        <li role="button"
            className="container"
            tabIndex="0"
            onKeyPress={props.openInfoWindow.bind(this, props.data.marker)}
            onClick={props.openInfoWindow.bind(this, props.data.marker)}>
            {props.data.longname}
        </li>
    );
}

export default SingleLocationOnMap;