import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';

delete mongoose.connection.models.managers;

const { Schema } = mongoose;

const ManagerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
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

ManagerSchema.statics.getFullList = function({ sort }) {
  return this.aggregate([
    {
      $addFields: {
        fullName: {
          $concat: ['$firstName', ' ', '$lastName'],
        },
      },
    },
    {
      $sort: {
        [sort || 'id']: 1,
      },
    },
  ]);
};

ManagerSchema.statics.deleteManager = function({ id }) {
  return this.findByIdAndRemove(id);
};

ManagerSchema.statics.updateManager = function({ id, ...rest }) {
  return this.findByIdAndUpdate(id, { ...rest });
};

ManagerSchema.methods.addManager = function(data) {
  Object.keys(data).forEach(key => {
    this[key] = data[key];
  });

  return this.save();
};

autoIncrement.initialize(mongoose.connection);
ManagerSchema.plugin(autoIncrement.plugin, {
  model: 'managers',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

const managers = mongoose.model('managers', ManagerSchema);
export default managers;
