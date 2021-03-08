import Dexie from 'dexie'

const db = new Dexie('pastry-fish-db')
db.version(1).stores({
  records:
    'id,startTime,biteTime,tug,hookset,fishId,hq,size,spotId,snagging,chum,fishEyes,surfaceScale,identicalCast,baitId,mooch',
})

db.version(2).stores({
  sounds: 'id,base64,filePath',
})

export default db
