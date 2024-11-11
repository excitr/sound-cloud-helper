'use client';

import { useState, useEffect } from 'react';
import { logger } from '@repo/logger';
import ActivitySection from './components/activity-section';
import Layout from './components/layout';
import LogSection from './components/log-section';
import OptionsSection from './components/options-section';
import PricingSection from './components/pricing-section';
import ProfileHeader from './components/profile-header';
import HomePageContext from './context';
import type { OptionsSchema } from './type';

interface ProfileData {
  id: number;
  username: string;
  followings_count: number;
  followers_count: number;
  avatar_url: string;
}

export default function HomePage(): React.JSX.Element {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activity, setActivity] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionsSchema>({
    scrap_url: '',
    follow: true,
    pro_follow: false,
    unfollow: false,
    passive_follow: false,
    manual_follow: false,
    schedule_activity: false,
    schedule_time: '',
    cycle: false,
    max: false,
    follow_count: 0,
    unfollow_count: 0,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await fetch('/api/auth/home', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        const response = await res.json();

        setProfileData(response);
      } catch (error) {
        logger.error('Failed to fetch profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, type, value } = event.target;

    if (type === 'checkbox' || type === 'radio') {
      const inputTarget = event.target as HTMLInputElement;
      setOptions((prevOptions) => ({
        ...prevOptions,
        [name]: inputTarget.checked,
      }));
    } else {
      setOptions((prevOptions) => ({
        ...prevOptions,
        [name]: value,
      }));
    }
  };

  return (
    <>
      <HomePageContext.Provider value={{ setActivity, activity, options, setOptions, handleChange }}>
        <Layout />
        {profileData && <ProfileHeader userInfo={profileData} />}

        <ActivitySection />
        <OptionsSection />
        <LogSection />
        <PricingSection />
      </HomePageContext.Provider>
    </>
  );
}
