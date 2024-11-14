'use client';

import { useState, useEffect } from 'react';
import { logger } from '@repo/logger';
import { z } from 'zod';
import ActivitySection from './components/activity-section';
import Layout from './components/layout';
import LogSection from './components/log-section';
import OptionsSection from './components/options-section';
import PricingSection from './components/pricing-section';
import ProfileHeader from './components/profile-header';
import HomePageContext from './context';
import type { OptionsSchema } from './type';
import { Box } from '@mui/material';

const MeDataSchema = z.object({
  id: z.number(),
  username: z.string(),
  avatar_url: z.string(),
  followers_count: z.number(),
  followings_count: z.number(),
});
type MeData = z.infer<typeof MeDataSchema>;

export default function HomePage(): React.JSX.Element {
  const [profileData, setProfileData] = useState<MeData | null>(null);
  const [activity, setActivity] = useState<boolean>(false);
  const [options, setOptions] = useState<OptionsSchema>({
    scrap_url: '',
    follow: 'follow',
    pro_follow: 'pro_follow',
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

  const fetchProfileData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/home', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      setProfileData(MeDataSchema.parse(await response.json()));
    } catch (error) {
      logger.error('Failed to fetch profile data:', error);
    }
  };

  useEffect(() => {
    void fetchProfileData();
  }, []);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
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
    <HomePageContext.Provider
      value={{
        setActivity,
        activity,
        options,
        setOptions,
        handleChange,
        fetchProfileData,
      }}
    >
      <Box mb={14}>
        <Layout />
      </Box>
      {profileData ? <ProfileHeader userInfo={profileData} /> : <div>Loading...</div>}
      <ActivitySection />
      <OptionsSection />
      <LogSection />
      <PricingSection />
    </HomePageContext.Provider>
  );
}
