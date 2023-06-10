import { useEffect, useState } from 'react';
import { withRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import {
    GoogleMap,
    InfoWindow,
    LoadScript,
    Marker,
} from '@react-google-maps/api';

import { useIct } from 'hooks/use-ict';
import { ictApiGetBaseData, ictApiWPGetPost } from 'lib/Api';
import mapStyles from './mapStyles';

const GoogleMapMonpay = (props) => {
    const [markers, setMarkers] = useState([]);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const { router, themeOption } = props;
    const { t, lang } = useTranslation('common');
    const { id } = router.query;

    const { ictCtx, setIctCtx } = useIct();
    const containerStyle = {
        width: '100%',
        height: '500px',
    };
    const options = {
        styles: mapStyles,
        disableDedailtUI: true,
        zoomControl: true,
    };
    const onLoad = (infoWindow) => {};
    const center = {
        lat: 47.9189,
        lng: 106.9176,
    };

    useEffect(() => {
        setIctCtx({
            ...ictCtx,
            paged: props.paged ? props.paged : 1,
            filters: props.filters ? props.filters : {},
            path: props.path ? props.path : '',
            themeOption: themeOption ? themeOption : {},
        });
    }, [props?.paged, props?.filters, props?.path]);

    useEffect(() => {
        if (id) {
            /* Partner Single */
            if (id) {
                async function fetchData() {
                    const respPartnerMap = await axios(
                        `/api/partner/single/?id=${router.query.id}`
                    );

                    if (respPartnerMap.data.branchList) {
                        setMarkers(respPartnerMap.data.branchList);
                    }
                }
                fetchData();
            } else {
                return;
            }
        }
    }, [id]);
    return (
        <Row>
            <Col md={12} sm={12} xs={12} xl={12}>
                {typeof window !== 'undefined' && (
                    <LoadScript googleMapsApiKey="AIzaSyAZj66OEcOPULMI6izT48UjpfFzCbUdqjQ">
                        <GoogleMap
                            mapContainerStyle={containerStyle}
                            center={center}
                            zoom={13}
                            options={options}
                            onClick={(e) => {
                                setMarkers((current) => [
                                    ...current,
                                    {
                                        lat: e.latLng.lat(),
                                        lat: e.latLng.lng(),
                                        time: new Date(),
                                    },
                                ]);
                            }}
                        >
                            {markers?.map((marker, i) => (
                                <Marker
                                    key={i}
                                    position={{
                                        lat: marker.locationLat,
                                        lng: marker.locationLng,
                                    }}
                                    icon={{
                                        url: '/marker-default.svg',
                                        origin: new window.google.maps.Point(
                                            0,
                                            0
                                        ),
                                        anchor: new window.google.maps.Point(
                                            15,
                                            15
                                        ),
                                        scaledSize: new window.google.maps.Size(
                                            30,
                                            30
                                        ),
                                    }}
                                    onClick={() => {
                                        setSelectedMarker(marker);
                                    }}
                                />
                            ))}
                            {selectedMarker ? (
                                <>
                                    {markers?.map((marker, i) => (
                                        <InfoWindow
                                            key={i}
                                            onLoad={onLoad}
                                            position={{
                                                lat: marker.locationLat,
                                                lng: marker.locationLng,
                                            }}
                                            onCloseClick={() => {
                                                setSelectedMarker(null);
                                            }}
                                        >
                                            <div className="mp-map-address">
                                                <p>{marker.address}</p>
                                            </div>
                                        </InfoWindow>
                                    ))}
                                </>
                            ) : null}
                        </GoogleMap>
                    </LoadScript>
                )}
            </Col>
        </Row>
    );
};

export default withRouter(GoogleMapMonpay);
