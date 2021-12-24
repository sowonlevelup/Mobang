const express = require('express');
const router = express.Router();
const db = require('../models/index')
const {hashPassword,comparePassword} = require("../utils/bcrypt");
const jwt = require('jsonwebtoken');
const {verifyToken} = require('../utils/jwt');
const {upload} = require('../utils/multer');
const path = require('path');

router.get("/:id", async (req, res) => {
  console.log(req.params.id)

  try {
    const result = await db['user'].findOne({
      attributes: [
        "id",
        "name",
        "email",
        "profile",
        "type",
        "createdAt",
        "updatedAt",
      ],
      where: {
        id : req.params.id
      }
    })
    return res.json(result)
  } catch (err) {
    console.log(err)
    return res.json({ status: "ERROR"})
  }
})

// 유저 회원가입
router.post("/", async (req, res) => {
  // console.log(req.body)

  try {
    const { name, email, password, type } = req.body
    const hashedPassword = await hashPassword(password)

    const result = await db["user"].create({
      name,
      email,
      password : hashedPassword,
      type
    })
    return res.json({ status: "OK"})
  } catch (err) {
    console.log(err)
    return res.json({ status: "ERROR" });
  }
})

// 유저 정보 수정
//verifyToken을 한다는 건 로그인시에만 동작해야하기 때문에
// 미들웨어인 verifyToken을 통해 검증
router.patch("/:id",verifyToken, async(req, res) => {
  try {
    //유저 정보를 수정하기 위해서 pw를 받아와서 검증
    //검증이 성공할 시 업데이트 허용
    //name, type 변경하기
    //req.params.id
      const userInformation = await db["user"].findOne({
        where: {
          id: req.params.id,
        },
      });
      console.log(userInformation.dataValues);
  
      const result = comparePassword(
        password,
        userInformation.dataValues.password
      );
  
      if (result) {
        const update = await db["user"].update(
          {
            name: name,
            type: type,
          },
          {
            where: {
              id: req.params.id,
            },
          }
        );
        return res.json({ status: "OK" });
      } else {
        return res.json({ status: "ERROR" });
      }
    } catch (error) {
      console.log(error);
      return res.json({ status: "ERROR" });
    }

})

//프로필 업로드
router.post("/:id/profile",upload.single("profile"),async(req, res)=>{
try {
  return res.json({status:"OK"})
} catch (error) {
  console.log(error)
  return res.json({status:"ERROR"})
}
})

// 회원탈퇴
router.delete("/:id", async(req, res) => {
try {
  
  const result = await db['user'].destroy({
    where:{
      id: req.params.id
    }
  })
  return res.json({status:"ok"})
} catch (error) {
  console.lod(error);
  return res.json({status:"ERROR"})
}
})

// 로그인
router.post("/login", async(req, res) => {
  // DB에서 검증
  // jwt 발행
  // jwt 전달
  // jwt를 cookies localstorage session storage에 저장
  // 요청을 할때마다 header jwt를 담아서 전달
  // jwt가 유효한지 판별
  try {
    //console.log(req.body);
    const {email, password} = req.body;

    const userData = await db['user'].findOne({ 
      attributes : ['id','password','name'],
      where: {
        email:email
      }
    })
    //console.log(userData);
    
   // const compareResult = await comparePassword(password,hashedPassword)
   // if(compareResult){
      const token = jwt.sign({
        id:userData.dataValues.id
      },"ssafy",{expiresIn: "24h"});

      console.log(token)
      return res.json({
        resultCode:200, 
        token:token,
        id: userData.dataValues.id,
        name:userData.dataValues.name
      })
   // }

  } catch (error) {
    console.log(error);
    return res.json({status:"ERROR"})
  }
  
  
  // 응답
})
// 검증하는 역할


module.exports = router;

