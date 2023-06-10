import React from 'react';
const Switch = ({ onChange }) => {
  return (
    <div className="tw-switch">
      <input type="checkbox" onChange={onChange} />
      <span />
    </div>
  );
};
export default Switch;
