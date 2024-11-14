'use client';

import type { Dispatch, SetStateAction } from 'react';
import { useContext, createContext } from 'react';
import type React from 'react';
import type { OptionsSchema } from './type';

export interface HomePageContextType {
  handleChange: (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  setActivity: Dispatch<SetStateAction<boolean>>;
  activity: boolean;
  options: OptionsSchema;
  setOptions: Dispatch<SetStateAction<OptionsSchema>>; // Add this line
  fetchProfileData: () => Promise<void>;
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
    follow: '',
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
});

export const useHomePageContext = (): HomePageContextType => useContext(HomePageContext);

export default HomePageContext;
