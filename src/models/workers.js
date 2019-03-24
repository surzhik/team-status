import mongoose from 'mongoose';
import autoIncrement from 'mongoose-auto-increment';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

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
        'managerId.fullName': {
          $concat: ['$firstName', ' ', '$lastName'],
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
    let matchColumn = rest.matchColumn;
    switch (rest.matchColumn) {
      case 'skillsList':
        matchColumn = 'skillsList.name';
        break;
      case 'managerId':
        matchColumn = 'managerId.fullName';
        break;
      case 'currentProject':
        matchColumn = 'currentProject.name';
        break;
      default:
        break;
    }
    aggregate.push({
      $match: {
        [matchColumn]: {
          $in: rest.matchIn.split(','),
        },
      },
    });
  }

  if (rest.sortColumn && rest.sortOrder) {
    aggregate.push({
      $sort: {
        [rest.sortColumn]: rest.sortOrder === 'ascend' ? 1 : -1,
      },
    });
  }
  console.log(aggregate);
  return this.aggregatePaginate(this.aggregate(aggregate), {
    page: Number(page),
    limit: Number(limit),
  });
  /*
  const options = {};
  const sort = {};
  if (rest.skillsList) {
    options.skillsList = { $in: rest.skillsList.split(',') };
  }
  if (rest.sortColumn && rest.sortOrder) {
    sort[rest.sortColumn] = rest.sortOrder === 'ascend' ? 1 : -1;
  }

  console.log(sort);
  return this.paginate(options, {
    page: Number(page),
    limit: Number(limit),
    populate: 'currentProject managerId skillsList',
    sort,
  });
  */
  //return this.find().sort({ id: 1 });
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
