import Dexie from 'dexie'

const db = new Dexie('pastry-fish-db')
db.version(1).stores({
  records:
    'id,startTime,biteTime,tug,hookset,fishId,hq,size,spotId,snagging,chum,fishEyes,surfaceScale,identicalCast,baitId,mooch',
})

db.version(2).stores({
  sounds: 'id,base64,filePath',
})

db.version(3).stores({
  records:
    'id,baitId,biteTime,cancelled,catchAndRelease,chum,collectorGlove,fishEyes,fishId,fishersIntuition,gathering,gatheringFortuneUp,gp,hookset,hq,identicalCast,missed,mooch,pastryFishVersion,patch,perception,prevWeatherDetected,region,size,snagging,spotId,startTime,surfaceScale,surfaceScaleFishId,tug,weatherDetected,uploadEnabled,uploaded',
})

export default db
