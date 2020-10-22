const LOCAL_TEST_MODE = false

export default {
  isTest() {
    return process.env.NODE_ENV === 'test' || LOCAL_TEST_MODE
  },
}