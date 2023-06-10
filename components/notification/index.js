import React, { useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { useRouter } from 'next/router';

const Notification = ({ show, infos, pos, close }) => {
    const [position, setPosition] = useState('top-end');
    const [state, setState] = useState(false);
    const router = useRouter();

    React.useEffect(() => {
        if (show) setState(show);
        if (pos) setPosition(pos);
    }, [show]);

    return (
        <ToastContainer
            position={position}
            bsPrefix="toast-container position-fixed"
            style={{ zIndex: 9 }}
        >
            <Toast
                className="success-alert"
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
                        {router.locale === 'en' ? 'Success' : 'Амжилттай'}
                    </h5>
                </Toast.Header>
                <Toast.Body>{infos}</Toast.Body>
            </Toast>
        </ToastContainer>
    );
};

export default Notification;
