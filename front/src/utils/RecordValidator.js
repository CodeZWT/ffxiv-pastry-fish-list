export default {
  judgeRecordStrictFlag(isStrictMode, record) {
    const { gatheringFortuneUp, catchAndRelease, hookset, tug } = record ?? {}
    const wrongHookset =
      (catchAndRelease || gatheringFortuneUp) &&
      ((tug === 'light' && hookset !== 'precision') ||
        (tug === 'medium' && hookset !== 'powerful') ||
        hookset === 'double' ||
        hookset === 'normal')
    const noBait = !record.bait || record.bait < 0
    const noStatus = !record.gathering
    return (
      isStrictMode &&
      !record.surfaceScale &&
      !record.identicalCast &&
      !record.fishEyes &&
      !wrongHookset &&
      !noBait &&
      !noStatus
    )
  },
}
