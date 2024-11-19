'use client';

import { useState, useEffect } from 'react';
import { logger } from '@repo/logger';
import { Box } from '@mui/material';
import { fetchMeData } from '@/app/api/auth/home/actions';
import ActivitySection, { verifySoundCouldToken } from './components/activity-section';
import Layout from './components/layout';
import LogSection from './components/log-section';
import OptionsSection from './components/options-section';
import PricingSection from './components/pricing-section';
import ProfileHeader from './components/profile-header';
import HomePageContext from './context';
import {
  MeData,
  type MeDataSchema,
  type OptionsSchema,
  type VerifyTokenResponceData,
  type LogActivitySchemaData,
  TimeData,
  initiallyLogData,
} from './type';

export default function HomePage(): React.JSX.Element {
  const [logData, setLogData] = useState<[LogActivitySchemaData]>([initiallyLogData]);
  const [activityTime, setActivityTime] = useState<string>('');
  const [profileData, setProfileData] = useState<MeDataSchema>({
    id: 0,
    username: '',
    avatar_url: '',
    followers_count: 0,
    followings_count: 0,
  });
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
      const tokenData: VerifyTokenResponceData | undefined = await verifySoundCouldToken();

      if (tokenData.success) {
        const { data, success } = await fetchMeData();
        if (success) {
          setProfileData(MeData.parse(data));
        }
      }
    } catch (error) {
      logger.error('Failed to fetch profile data:', error);
    }
  };

  const fetchActivityTimeData = async (): Promise<void> => {
    try {
      const response = await fetch('/api/auth/fetch-activity-time', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = TimeData.parse(await response.json());

      if (result.success) {
        setActivityTime(result.activityTime);
        setLogData(result.data);
      }
    } catch (error) {
      logger.error('Failed to fetch profile data:', error);
    }
  };

  useEffect(() => {
    void fetchProfileData();
    void fetchActivityTimeData();
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
        profileData,
        setProfileData,
        activityTime,
        setActivityTime,
        logData,
        setLogData,
      }}
    >
      <Box mb={14}>
        <Layout />
      </Box>
      <ProfileHeader />
      <ActivitySection />
      <OptionsSection />
      <LogSection />
      <PricingSection />
    </HomePageContext.Provider>
  );
}
