import React from 'react';

const ButtonCats = ({ filter }) => {
    return (
        <div>
            <button type="button" onClick={() => filter('Хэрэглээний төлбөр')}>
                Хэрэглээний төлбөр
            </button>
        </div>
    );
};

export default ButtonCats;
