'use client';

import { useState, useEffect } from 'react';
import { logger } from '@repo/logger';
import { Box } from '@mui/material';
import { fetchMeData } from '@/app/api/auth/home/actions';
import { type APITokenResponse } from '@/app/api/auth/generate-soundcloud-token/actions';
import { fetchUserActivity } from '@/app/api/auth/fetch-activity-time/actions';
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
  type LogActivitySchemaData,
  initiallyLogData,
  type ActivityAPIResponse,
} from './type';

export default function HomePage(): React.JSX.Element {
  const [logData, setLogData] = useState<LogActivitySchemaData[]>([initiallyLogData]);
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
    scrapUrl: '',
    follow: 'follow',
    proFollow: 'pro_follow',
    unfollow: false,
    passiveFollow: false,
    manualFollow: false,
    scheduleActivity: false,
    scheduleTime: '',
    cycle: false,
    max: false,
    followCount: 0,
    unfollowCount: 0,
  });

  const fetchProfileData = async (): Promise<void> => {
    try {
      const tokenData: APITokenResponse | undefined = await verifySoundCouldToken();

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
      const response: ActivityAPIResponse = await fetchUserActivity();

      if (response.success && response.activityTime && response.data) {
        setActivityTime(response.activityTime);
        setLogData(response.data);
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