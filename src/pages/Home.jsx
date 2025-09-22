import React from 'react';
import Banner from '../components/Banner';
import VolunteerNeedHome from '../components/VolunteerNeedHome';
import ImpactStats from '../components/ImpactStats';
import FeaturedCategories from '../components/FeaturedCategories';

const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <VolunteerNeedHome></VolunteerNeedHome>
            <FeaturedCategories></FeaturedCategories>
            <ImpactStats></ImpactStats>
        </div>
    );
};

export default Home;