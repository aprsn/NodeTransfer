const express = require("express");
const router = express.Router();
const db = require("../database");
const verify = require("./verifyToken");
const DATE_FORMATER = require("dateformat");
const { exec } = require("child_process");
const multer = require("multer");
const fs = require('fs');
const fileDestination = process.env.FILE_DESTINATION;

router.post("/", verify, async (req, res) => {
  res.json({ Response: "It works - (post)" });
  // console.log(req.user);
});

router.post("/upload", verify, async (req, res) => {
  const uploader = req.user._id;
  const date = DATE_FORMATER(new Date(), "yyyy-mm-dd HH:MM:ss");

  exec("df -h | grep '/dev/sda2' ", (err, stdout, stderr) => {
    if (err) {
      exec(
        "fdisk -l && mount /dev/sda2 /var/www/nodeAPI/uploads -o uid=ubuntu,gid=ubuntu -o nonempty",
        (err, stdout, stderr) => {
          if (err) {
            console.error(err);
          } else {
            console.log("Disk Mounted!");
            contUpload();
          }
        }
      );
    } else {
      console.log("Disk checked!");
      contUpload();
    }
  });

  const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, fileDestination + "/" + uploader);
    },
    filename: function(req, file, cb) {
      cb(null, new Date().getTime() + file.originalname);
    }
  });
  const fileFilter = (req, file, cb) => {
    cb(null, true);
  };

  function contUpload() {
    const checkSizeSql = `SELECT sizeLimit, usedSize FROM Users WHERE _id = '${uploader}' `;
    let sizeLeft;
    db.query(checkSizeSql, (err, response) => {
      if (err) return console.log(err);
      sizeLeft = response[0].sizeLimit - response[0].usedSize;
      const upload = multer({
        storage: storage,
        limits: {
          fileSize: 1024 * 1024 * sizeLeft // 5MB
        },
        fileFilter: fileFilter
      }).single("file");

      upload(req, res, function(err) {
        if (err) {
          if (err.message == "File too large") {
            return res
              .status(400)
              .json({
                Response:
                  "This file exceeds your storage limit. If you need more storage, please contact your administrator. You can check your storage limit on your profile page."
              });
          }
          return res.status(400).json({ Response: err.message });
        }
        const sizeAsMB = (req.file.size / 1048576).toFixed(2);
        const mimetype = req.file.mimetype;
        const path = req.file.path;
        const filename = req.file.filename;
        const sql = `INSERT INTO Uploads(filename, mimetype, size, uploader, path, date) 
                        VALUES('${filename}', '${mimetype}', ${sizeAsMB}, '${uploader}', '${path}', '${date}')`;

        db.query(sql, (err, response) => {
          if (err) res.json({ Response: err });
          res.json(response);
        });

        const sqlUpdate = `UPDATE Users SET usedSize = usedSize + ${sizeAsMB}, totalFile = totalFile + 1 WHERE _id = '${uploader}'`;
        db.query(sqlUpdate, (err, response) => {
          if (err) res.json({ Response: err });
        });
      });
    });
  }
});

router.post('/deleteFile', verify, async (req, res) => {
  const unique_id = req.body.unique_id;
  const filename = req.body.filename;
  const verifyId = req.user._id;
  if (unique_id != verifyId) {
    return res
      .status(401)
      .json({ Repsonse: "Access denied for this information!" });
  }


  const sql = `SELECT size, isDeleted FROM Uploads WHERE uploader = '${unique_id}' AND filename = '${filename}'`;
  db.query(sql, (err, response) => {

    if(response[0] == undefined) { return res.status(400).json({Response: "File did not found!"})}
    if(response[0].isDeleted) { return res.status(400).json({Response: "File is already deleted!"});}

    const sql = `UPDATE Uploads SET isDeleted = 1 WHERE uploader = '${unique_id}' AND filename = '${filename}'`;
    const filesize = response[0].size;
    db.query(sql, (err, response) => {
      if(err) return res.json(err);
      fs.unlinkSync(`./uploads/${unique_id}/${filename}`);
      const sql = `UPDATE Users SET usedSize = usedSize - ${filesize}, totalFile = totalFile -1 WHERE _id = '${unique_id}'`;
      db.query(sql, (err, response) => { 
        if(err) return res.status(400).json({Response: "Undefined error"});
        return res.json({Response: "File is successfully deleted!"}); })
    });
  });

});

router.post("/setPrivacy", verify, async (req, res) => {
  const privacy = req.body.privacy;
  const unique_id = req.body.unique_id;
  const verifyId = req.user._id;
  if (unique_id != verifyId) {
    return res
      .status(401)
      .json({ Repsonse: "Access denied for this information!" });
  }

  const sql = `UPDATE Users SET public = ${privacy} WHERE _id = '${unique_id}'`;

  db.query(sql, (err, response) => {
    if (err) res.json({ Response: err });
    res.json(response);
  });
});


router.post("/setFilePrivacy", verify, async (req, res) => {
  const privacy = req.body.privacy;
  const filename = req.body.filename;
  const unique_id = req.body.unique_id;
  const verifyId = req.user._id;
  if (unique_id != verifyId) {
    return res
      .status(401)
      .json({ Repsonse: "Access denied for this information!" });
  }

  const sql = `UPDATE Uploads SET public = ${privacy} WHERE uploader = '${unique_id}' AND filename = '${filename}'`;

  db.query(sql, (err, response) => {
    if (err) res.json({ Response: err });
    res.json(response);
  });
});


module.exports = router;
