"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _3d_model_1 = __importDefault(require("../model/3d.model"));
var express = require("express");
var router = express.Router();
const AWS = require("aws-sdk");
const multer = require("multer");
const multerS3 = require("multer-s3");
const region = process.env.AWS_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4",
});
const upload = multer({
    storage: multerS3({
        s3,
        bucket: bucketName,
        metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});
router.get("/models", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const models = yield _3d_model_1.default.find();
        res.status(200).json(models);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            success: false,
        });
    }
}));
router.post("/model", upload.single("model"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const { name } = req.body;
        console.log(file);
        if (!file) {
            return res.status(400).send("Error, could not upload file");
        }
        const newModel = new _3d_model_1.default({
            name: name,
            threeDModelPath: file.location,
        });
        const savedModel = yield newModel.save();
        res.status(201).json(savedModel);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error",
            status: 500,
            success: false,
        });
    }
}));
module.exports = router;
//# sourceMappingURL=uploadfile.js.map