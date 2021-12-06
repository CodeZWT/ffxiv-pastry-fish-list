export default {
  judgeRecordStrictFlag(isStrictMode, record) {
    const { gatheringFortuneUp, catchAndRelease, hookset, tug } = record ?? {}
    const wrongHookset =
      (catchAndRelease || gatheringFortuneUp) &&
      ((tug === 'light' && hookset !== 'precision') ||
        (tug === 'medium' && hookset !== 'powerful') ||
        hookset === 'double' ||
        hookset === 'triple' ||
        hookset === 'normal')
    const noBait = !record.baitId || record.baitId < 0
    const noStatus = !record.cancelled && !record.gathering
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
