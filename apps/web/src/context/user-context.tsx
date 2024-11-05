'use client';

import { logger } from '@repo/logger';
import React, { createContext, useState, type ReactNode } from 'react';

interface UserContextType {
  userId: number | null;
  setUserId: (id: number | null) => void;
  updateUserFromToken: (id: number) => void;
}

export const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }): React.JSX.Element {
  const [userId, setUserId] = useState<number | null>(null);

  const updateUserFromToken = (id: number): void => {
    try {
      setUserId(id); // Assuming the user ID is in the `user_id` field
    } catch (error) {
      logger.error('Failed to decode token', error);
      setUserId(null);
    }
  };

  return <UserContext.Provider value={{ userId, setUserId, updateUserFromToken }}>{children}</UserContext.Provider>;
}
