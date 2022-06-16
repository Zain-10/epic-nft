import React from 'react';
import './Loader.css';
import loading from '../assets/loading.gif';

function Loader() {
  return (
    <div>
        <img src={loading} className='loading' alt='loading'/>
    </div>
  )
}

export default Loader