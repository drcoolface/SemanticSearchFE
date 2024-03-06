import React from 'react';

// Ensure this path is correct relative to this file
import logo from './logo.png';

const TitleComponent: React.FC = () => {
  return (
   

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
