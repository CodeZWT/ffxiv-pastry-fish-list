import Dexie from 'dexie'

const db = new Dexie('pastry-fish-db')
db.version(1).stores({
  records:
    'id,startTime,biteTime,tug,hookset,fishId,hq,size,spotId,snagging,chum,fishEyes,surfaceScale,identicalCast,baitId,mooch',
})

export default db
