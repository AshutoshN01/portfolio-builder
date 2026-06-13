/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';
import { personalInfo as staticProfile } from '@data/profile';

import { siteConfig as staticConfig } from '@data/siteConfig';
import { projectsData as staticProjects } from '@data/projects';
import { skillsData as staticSkills } from '@data/skills';
import { timelineData as staticTimeline } from '@data/timeline';

const PortfolioDataContext = createContext(null);

export function PortfolioDataProvider({ data, children }) {
  return (
    <PortfolioDataContext.Provider value={data}>
      {children}
    </PortfolioDataContext.Provider>
  );
}

export function usePortfolioData() {
  const context = useContext(PortfolioDataContext);
  if (!context) {
    // Fall back to pre-configured static profiles
    return {
      personalInfo: staticProfile,
      siteConfig: staticConfig,
      projectsData: staticProjects,
      skillsData: staticSkills,
      timelineData: staticTimeline,
      certificationsData: [],
      isStatic: true,
    };
  }
  return {
    ...context,
    isStatic: false,
  };
}
