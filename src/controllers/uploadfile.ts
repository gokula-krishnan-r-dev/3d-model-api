import { NextFunction, Request, Response } from "express";
import Model from "../model/3d.model";
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
    metadata: function (req: any, file: any, cb: any) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req: any, file: any, cb: any) {
      cb(null, Date.now().toString() + "-" + file.originalname);
    },
  }),
});
router.get(
  "/models",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const models = await Model.find();
      res.status(200).json(models);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "Internal Server Error",
        status: 500,
        success: false,
      });
    }
  }
);

router.post("/model", upload.single("model"), async (req: any, res: any) => {
  try {
    const file = req.file;
    const { name } = req.body;
    console.log(file);

    if (!file) {
      return res.status(400).send("Error, could not upload file");
    }

    const newModel = new Model({
      name: name,
      threeDModelPath: file.location,
    });
    const savedModel = await newModel.save();
    res.status(201).json(savedModel);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error",
      status: 500,
      success: false,
    });
  }
});

module.exports = router;
