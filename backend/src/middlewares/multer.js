import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/uplads/');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.split(' ').join('_');
    req.body.image = name;
    cb(null, name);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // Limite la taille du fichier à 5MB
  fileFilter: (request, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Seuls les fichiers image sont autorisés!'));
    }
  }
});

export default upload;