const ReceivedData = require("../models/ReceivedData");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const createOne = Model => catchAsync(async (req, res, next) => {
    req.body.manager = req.user.id;
    const doc = await Model.create(req.body);

    res.status(201).json({ status: 'success', data: { data: doc } });
});

const getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find({ manager: req.user.id });
    res.status(200).json({ status: 'success', results: doc.length, data: { data: doc } });
});

const getOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to view this resource', 403));
    }
    res.status(200).json({ status: 'success', data: { data: doc } });
});

const updateOne = Model => catchAsync(async (req, res, next) => {
    let doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to update this resource', 403));
    }
    doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: { data: doc } });
});

const deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) return next(new AppError('No document found with that ID', 404));
    if (doc.manager.id.toString() !== req.user.id.toString()) {
         return next(new AppError('You do not have permission to delete this resource', 403));
    }
    await Model.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
});

exports.createReceivedData = createOne(ReceivedData);
exports.getAllReceivedData = getAll(ReceivedData);
exports.getReceivedData = getOne(ReceivedData);
exports.updateReceivedData = updateOne(ReceivedData);
exports.deleteReceivedData = deleteOne(ReceivedData);