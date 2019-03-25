import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

delete mongoose.connection.models.projects;

const { Schema } = mongoose;

const ProjectSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
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

ProjectSchema.statics.getFullList = function({ sort }) {
  return this.find().sort(sort ? { [sort]: 1 } : { id: 1 });
};

ProjectSchema.statics.deleteProject = function({ id }) {
  return this.findByIdAndRemove(id);
};

ProjectSchema.statics.updateProject = function({ id, ...rest }) {
  return this.findByIdAndUpdate(id, { ...rest });
};

ProjectSchema.methods.addProject = function(data) {
  Object.keys(data).forEach(key => {
    this[key] = data[key];
  });
  return this.save();
};

autoIncrement.initialize(mongoose.connection);
ProjectSchema.plugin(autoIncrement.plugin, {
  model: 'projects',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

const projects = mongoose.model('projects', ProjectSchema);
export default projects;
