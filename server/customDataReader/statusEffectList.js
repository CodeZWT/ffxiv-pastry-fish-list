const MachinaModels = require('node-machina-ffxiv/models/_MachinaModels')
const statusEffectListOf = struct => {
  struct.classID = struct.data[0]
  struct.level1 = struct.data[1]
  struct.level = MachinaModels.getUint16(struct.data, 2)
  struct.currentHP = MachinaModels.getUint32(struct.data, 4)
  struct.maxHP = MachinaModels.getUint32(struct.data, 8)
  struct.currentMP = MachinaModels.getUint16(struct.data, 12)
  struct.maxMP = MachinaModels.getUint16(struct.data, 14)
  struct.currentTP = MachinaModels.getUint16(struct.data, 16)
  struct.effects = []
  for (let i = 0; i < 30; i++) {
    // if (MachinaModels.getUint16(struct.data, 20 + i * 12) === 2778) {
    //   console.log(
    //     //   MachinaModels.getUint16(struct.data, 18 + i * 12),
    //     //   MachinaModels.getUint16(struct.data, 20 + i * 12),
    //     MachinaModels.getUint16(struct.data, 20 + i * 12),
    //     struct.data[22 + i * 12],
    //     struct.data[23 + i * 12],
    //     //   struct.data[24 + i * 12],
    //     //   struct.data[25 + i * 12],
    //     //   MachinaModels.getUint16(struct.data, 22 + i * 12),
    //     //   MachinaModels.getUint16(struct.data, 24 + i * 12)
    //   )
    // }
    struct.effects.push({
      effectID: MachinaModels.getUint16(struct.data, 20 + i * 12),
      stack: struct.data[22 + i * 12],
      // duration: MachinaModels.getFloat(struct.data, 22 + (i * 12)),
      sourceActorID: MachinaModels.getUint32(struct.data, 26 + i * 12),
    })
  }
  return struct
}

module.exports = statusEffectListOf
