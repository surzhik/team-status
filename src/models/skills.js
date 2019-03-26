import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
/* eslint-disable func-names */
delete mongoose.connection.models.skills;

const { Schema } = mongoose;

const SkillSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

SkillSchema.statics.getFullList = function({ sort }) {
  return this.find().sort(sort ? { [sort]: 1 } : { id: 1 });
};

SkillSchema.statics.deleteSkill = function({ id }) {
  return this.findByIdAndRemove(id);
};

SkillSchema.statics.updateSkill = function({ id, ...rest }) {
  return this.findByIdAndUpdate(id, { ...rest });
};

SkillSchema.methods.addSkill = function({ name }) {
  this.name = name;
  return this.save();
};

autoIncrement.initialize(mongoose.connection);
SkillSchema.plugin(autoIncrement.plugin, {
  model: 'skills',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

const skills = mongoose.model('skills', SkillSchema);
export default skills;
