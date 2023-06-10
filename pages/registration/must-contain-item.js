import React from 'react';

const MustContainItem = (props) => {
  const { data } = props;
  const label = data?.[0];
  const meetsReq = data?.[1];
  const setClass = () => {
    const classArr = ['must-line'];
    if (meetsReq) classArr.push('cross-out');
    return classArr.join(' ');
  };

  return (
    <div className="must-item">
      <div className={setClass()}>
        <li className="must-text">
          <h6>{label}</h6>
        </li>
      </div>
    </div>
  );
};

export default MustContainItem;
