import React, { useState, useContext } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import IctContext from 'context/ict-context';

const CustomAlert = ({ show, infos }) => {
    const [position, setPosition] = useState('top-end');
    const [state, setState] = useState(true);
    const { alerts } = useContext(IctContext);

    // React.useEffect(() => {
    //     if (alerts) setState(show);
    // }, [alerts]);

    return (
        // <Row>
        //     <Col>
        //         <div>

        <div>
            <ToastContainer
                position={position}
                bsPrefix="toast-container position-fixed"
                style={{ zIndex: 9 }}
            >
                {alerts.map((alert, i) => {
                    return (
                        <Toast
                            className="success-alert fail"
                            onClose={() => setState(false)}
                            show={state}
                            delay={3000}
                            autohide
                            key={i}
                        >
                            <Toast.Header>
                                <h5 className="alert-header">Амжилтгүй</h5>
                            </Toast.Header>
                            <Toast.Body>{alert.message}</Toast.Body>
                        </Toast>
                    );
                })}
            </ToastContainer>
        </div>
        //     </Col>
        // </Row>
    );
};

// export const showAlert = (infos) => {
//     return <FailNotification infos={infos}></FailNotification>;
// };
export default CustomAlert;
