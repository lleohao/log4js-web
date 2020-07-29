/**
 * check type is buildIn appender type
 * @param appenderType
 */
export const isBuildInAppender = (appenderType: string): boolean => {
  return appenderType === 'console';
};
