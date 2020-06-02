import { send, onMessage } from '../clustering';

describe('clustering test', () => {
  test('send should be defined', () => {
    expect(send).toBeInstanceOf(Function);
  });

  test('onMessage should be defined', () => {
    expect(onMessage).toBeInstanceOf(Function);
  });
});
