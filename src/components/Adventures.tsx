import React, { useState } from 'react';
import { SideBar } from './SideBar';

import './Adventures.css';
import Details from './Details';

export default function Adventures() {
  const [adventureId, setAdventureId] = useState('');

  return (<div className="content-wrapper">
    <section className="sidebar"><SideBar onItemClicked={(itemId: string) => setAdventureId(itemId)} /></section>
    <section className="adventure"><Details id={adventureId}></Details></section>
  </div>);
}