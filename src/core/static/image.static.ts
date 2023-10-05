import * as path from 'path';
import { BadRequest } from 'http-errors';

export const destination = function (req: any, file: any, cb: any) {
  cb(null, path.join(__dirname, '../../../public/avatar'));
};
export const filename = function (req: any, file: any, cb: any) {
  const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
  cb(null, uniqueSuffix + '-' + file.originalname);
};
export const FilterImage = (req: any, file: any, cb: any) => {
  const allowFileTypes = /jpeg|jpg|png|gif/;
  const maxFileSize = 10_000_000;
  if (maxFileSize && file.size >= maxFileSize) {
    cb(new BadRequest(`Only allow size less than ${maxFileSize / 1_000_000}`));
  }
  if (allowFileTypes) {
    const extname = allowFileTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowFileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new BadRequest('Only allow images'));
    }
  }
};
