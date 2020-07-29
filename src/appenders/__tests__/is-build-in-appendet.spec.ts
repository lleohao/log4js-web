import { isBuildInAppender } from '../is-build-in-appender';

test('isBuildInAppender', () => {
  expect(isBuildInAppender('console')).toBeTruthy();
  expect(isBuildInAppender('other')).toBeFalsy();
});
