import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useRouter } from 'next/router';

const DangerNotification = ({ show, infos, position: pos, close }) => {
    const [position, setPosition] = useState('top-end');
    const [state, setState] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (show) setState(show);
        if (pos) setPosition(pos);
    }, [show]);

    return (
        <ToastContainer position={position}>
            <Toast
                className="success-alert danger"
                onClose={() => {
                    setState(false);
                    setTimeout(() => {
                        close();
                    }, 100);
                }}
                show={state}
                delay={3000}
                autohide
            >
                <Toast.Header>
                    <h5 className="alert-header">
                        {router.locale === 'en' ? 'Error' : 'Баталгаажуулалт'}
                    </h5>
                </Toast.Header>
                <Toast.Body>{infos}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default DangerNotification;
