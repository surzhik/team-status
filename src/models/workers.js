import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
/* eslint-disable func-names */
/* eslint-disable no-case-declarations */
delete mongoose.connection.models.workers;

const { Schema } = mongoose;

const WorkerSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
      unique: true,
    },
    onHolidaysTill: {
      type: Date,
      default: null,
    },
    freeSince: {
      type: Date,
      default: null,
    },
    workingHours: {
      timezone: {
        type: String,
        default: null,
      },
      start: {
        type: String,
        default: null,
      },
      end: {
        type: String,
        default: null,
      },
    },
    skillsList: [
      {
        type: Schema.Types.ObjectId,
        ref: 'skills',
        default: [],
      },
    ],
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'managers',
      default: null,
    },
    currentProject: {
      type: Schema.Types.ObjectId,
      ref: 'projects',
      default: null,
    },
  },
  { timestamps: true },
);

WorkerSchema.statics.getFullList = function({ page = 1, limit = 10, ...rest }) {
  const aggregate = [
    {
      $lookup: {
        from: 'skills',
        localField: 'skillsList',
        foreignField: '_id',
        as: 'skillsList',
      },
    },
    {
      $lookup: {
        from: 'managers',
        localField: 'managerId',
        foreignField: '_id',
        as: 'managerId',
      },
    },
    {
      $addFields: {
        managerId: {
          $arrayElemAt: ['$managerId', 0],
        },
      },
    },
    {
      $addFields: {
        fullName: {
          $concat: ['$firstName', ' ', '$lastName'],
        },
      },
    },
    {
      $addFields: {
        'managerId.fullName': {
          $concat: ['$managerId.firstName', ' ', '$managerId.lastName'],
        },
      },
    },
    {
      $lookup: {
        from: 'projects',
        localField: 'currentProject',
        foreignField: '_id',
        as: 'currentProject',
      },
    },
    {
      $addFields: {
        currentProject: {
          $arrayElemAt: ['$currentProject', 0],
        },
      },
    },
  ];

  if (rest.matchColumn && rest.matchIn) {
    const matchIn = rest.matchIn.split('|');
    const $match = {
      $and: [],
    };

    rest.matchColumn.split(',').forEach((column, index) => {
      let matchColumn = column;
      let matchObj = {};
      const now = new Date();
      switch (column) {
        case 'skillsList':
          matchColumn = 'skillsList.name';
          matchObj = {
            $in: matchIn[index].split(','),
          };
          break;
        case 'managerId':
          matchColumn = 'managerId.fullName';
          matchObj = {
            $in: matchIn[index].split(','),
          };
          break;
        case 'currentProject':
          matchColumn = 'currentProject.name';
          matchObj = {
            $in: matchIn[index].split(','),
          };
          break;
        case 'fullName':
          matchColumn = 'fullName';
          const regexFullName = new RegExp(
            ['.*', matchIn[index], '.*'].join(''),
            'i',
          );
          matchObj = regexFullName;
          break;
        case 'freeSince':
          matchObj = {
            $lte: now,
          };
          break;
        case 'onHolidaysTill':
          matchObj = {
            $gte: now,
          };
          break;
        default:
          matchObj = {
            $in: matchIn[index].split(','),
          };
          break;
      }
      $match.$and.push({
        [matchColumn]: matchObj,
      });
    });

    aggregate.push({
      $match,
    });
  }

  if (rest.sortColumn && rest.sortOrder) {
    aggregate.push({
      $sort: {
        [rest.sortColumn]: rest.sortOrder === 'ascend' ? 1 : -1,
      },
    });
  }

  return this.aggregatePaginate(this.aggregate(aggregate), {
    page: Number(page),
    limit: Number(limit),
  });
};

WorkerSchema.statics.checkWorker = function({ firstName, lastName, id }) {
  const regexFirstName = new RegExp(['^', firstName, '$'].join(''), 'i');
  const regexLastName = new RegExp(['^', lastName, '$'].join(''), 'i');
  return this.findOne({
    _id: { $ne: id },
    firstName: regexFirstName,
    lastName: regexLastName,
  });
};

WorkerSchema.statics.deleteWorker = function({ id }) {
  return this.findByIdAndRemove(id);
};

WorkerSchema.statics.updateWorker = function({ id, ...rest }) {
  return this.findByIdAndUpdate(id, { ...rest });
};

WorkerSchema.methods.addWorker = function(data) {
  Object.keys(data).forEach(key => {
    this[key] = data[key];
  });

  return this.save();
};

autoIncrement.initialize(mongoose.connection);
WorkerSchema.plugin(autoIncrement.plugin, {
  model: 'workers',
  field: 'id',
  startAt: 1,
  incrementBy: 1,
});

WorkerSchema.plugin(mongooseAggregatePaginate);
const workers = mongoose.model('workers', WorkerSchema);
export default workers;
