import React from 'react';

import logo from '/Users/mahesh/developer/FYP/fe_test/src/logo.png'; // Ensure this path is correct relative to this file


const TitleComponent: React.FC = () => {
  return (
    // <Title level={1} style={{ textAlign: 'center', paddingTop: '20px', color: '#1890ff', backgroundColor:'rgb(68, 66, 66)' }}>
    //   Nepali Semantic Searching
    // </Title>

    <div style={{ textAlign: 'center', paddingTop: '20px', backgroundColor: 'rgb(68, 66, 66)' }}>
    <img
      src={logo} // Specify the path to your image
      alt="Nepali Semantic Searching"
      style={{ maxWidth: '100px', height: '100px' }} // Adjust styling as needed
    />
  </div>
  );
};

export default TitleComponent;
