'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useContext, createContext } from 'react';
import type React from 'react';
import {
  type OptionsSchema,
  type MeDataSchema,
  type ActivityTimeSchema,
  type LogActivitySchemaData,
  initiallyLogData,
} from './type';

export interface HomePageContextType {
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setActivity: Dispatch<SetStateAction<boolean>>;
  activity: boolean;
  options: OptionsSchema;
  setOptions: Dispatch<SetStateAction<OptionsSchema>>;
  fetchProfileData: () => Promise<void>;
  profileData: MeDataSchema;
  setProfileData: Dispatch<SetStateAction<MeDataSchema>>;
  activityTime: ActivityTimeSchema;
  setActivityTime: Dispatch<SetStateAction<ActivityTimeSchema>>;
  logData: [LogActivitySchemaData];
  setLogData: Dispatch<SetStateAction<[LogActivitySchemaData]>>;
}

export const initiallyOptions = {
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
};

const HomePageContext = createContext<HomePageContextType>({
  handleChange: () => {
    // no-op function as placeholder
  },
  setActivity: () => {
    // no-op function as placeholder
  },
  activity: false,
  options: {
    scrap_url: '',
    follow: 'Follow',
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
  },
  setOptions: () => {
    // no-op function as placeholder
  },
  fetchProfileData: async () => {
    // no-op function returning a Promise
  },
  profileData: {
    id: 0,
    username: '',
    avatar_url: '',
    followers_count: 0,
    followings_count: 0,
  },
  setProfileData: () => {
    // no-op function as placeholder
  },
  activityTime: '',
  setActivityTime: () => {
    // no-op function as placeholder
  },
  logData: [initiallyLogData],
  setLogData: () => {
    // no-op function as placeholder
  },
});

export const useHomePageContext = (): HomePageContextType => useContext(HomePageContext);

export default HomePageContext;
