

/*
3 cách kết nối mongodb
 1. callback                v
2.Promises                  x
3. Async/await (Promises)   x
*/

const Deck = require('../models/Deck');
const User = require('../models/User');
const {JWT_SECRET} = require('../configs');

const Joi = require('@hapi/joi');
const JWT = require('jsonwebtoken')
//hàm encode token
const encodeToken = (userID) => {
  return JWT.sign({
    iss: 'Tran Nam', // Người phát hành
    sub: userID,//Định danh user
    iat: new Date().getTime(),//Ngày phát hành
    exp: new Date().setDate(new Date().getDate() + 3),  //Ngày hết hạn
  },
  JWT_SECRET // mã
  )
}

///callback
// const index = (req, res, next) => {
//     // Promises way
//     User.find({}).then(users => {
//         return res.status(200).json({ users })
//     }).catch(err => next(err))
// }

// const newUser = (req, res, next) => {
//     console.log('req.body', req.body);
//     //create user
//     const newUser = new User(req.body)
//     console.log('newUser ', newUser)
//     newUser.save((err, user) => {
//         console.error("Error", err);
//         console.log('newUser', user);
//         return res.status(201).json({
//             message: "Tạo user thành công",
//             user
//         })
//     });
// }

///======================Promises=====================

// const index = (req, res, next) => {
//     User.find({}).then((user) => {
//         return res.status(200).json({
//             message: 'Thành công',
//             user
//         })
//     }).catch(
//         err => next(err)
//     );
// }

// const newUser = (req, res, next) => {

//     const newUser = new User(req.body);

//     newUser.save().then(
//         newUser => {
//             return res.status(201).json({
//                 message: 'Tạo thành công',
//                 newUser
//             })
//         }
//     ).catch(
//         err => next(err)
//     )
// }


///===============Async/Await================

// Get user theo id user
const getUser = async (req, res, next) => {
  const { userID } = req.value.params;
  const user = await User.findById(userID);

  console.log('req.params', userID);
  console.log('user', user);
  return res.status(200).json({
    message: 'Lấy danh sách thành công',
    user
  })

}

const getUserDeck = async (req, res, next) => {
  const { userID } = req.params;

  const user = await User.findById(userID).populate('decks');

  const listDeck = user.decks;


  return res.status(200).json({
    message: 'Lấy danh sách thành công',
    listDeck
  })
}
// Get toàn bộ user 
const index = async (req, res, next) => {
  const user = await User.find();
  return res.status(200).json({
    message: 'Lấy danh sách thành công',
    total: user.length,
    user
  })
}


const newUserDeck = async (req, res, next) => {
  const { userID } = req.params;
  //Tạo 1 deck mới
  const newDeck = new Deck(req.body);

  // Lấy user
  const user = await User.findById(userID);

  //Gán người vào deck
  newDeck.owner = user;

  //Lưu deck
  await newDeck.save();

  // thêm deck vào user
  user.decks.push(newDeck._id);

  //Lưu user
  await user.save();

  return res.status(201).json({
    message: 'Lấy danh sách thành công',
    user
  })
}
// Thêm user
const newUser = async (req, res, next) => {
  const newUser = User(req.value.body);
  await newUser.save();
  return res.status(201).json({
    message: 'Tạo user thành công',
    newUser
  })

}

//Cập nhật thông tin user PATCH

const updateUser = async (req, res, next) => {
  //number of field
  console.log('updateUser');
  const { userID } = req.params;

  const newUser = req.body;

  const result = await User.findByIdAndUpdate(userID, newUser)

  return res.status(201).json({
    message: 'Cập nhật user thành công',
    result
  })
}

//PUT 
const replaceUser = async (req, res, next) => {
  //number of field
  console.log('replaceUser');
  const { userID } = req.value.params;

  const newUser = req.value.body;

  const result = await User.findByIdAndUpdate(userID, newUser)

  return res.status(200).json({
    message: 'Thay user thành công',
    success: true,
    result
  })
}

// ====================================================

const secret = async (req, res, next) => {
  console.log('call secret');

}
const signup = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password }
    = req.value.body;
  const foundUser = await User.findOne({ email });
  const newUser = new User({
    firstName,
    lastName,
    email,
    password
  })

  if (foundUser) return res.status(403).json({ error: { message: 'Email đã tồn tại!' } })
  await newUser.save();

  //enCode token
  const token = encodeToken(newUser._id);


  //trả token về header

  res.setHeader('Authorization', token)
  return res.status(201).json({
    success: true,
    message: "Đăng ký user thành công",
  })
}
const signin = async (req, res, next) => {
  console.log('call signup');
  return res.status(200).json({
    success: true,
    message: "Đăng nhập user thành công",
  })

}
//========================module=======================
module.exports = {
  getUser,
  getUserDeck,
  index,
  newUser,
  newUserDeck,
  replaceUser,
  updateUser,
  // =========================
  signin,
  signup,
  secret
}