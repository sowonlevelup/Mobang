const express = require('express');
const router = express.Router();
const db = require('../models/index');
const {verifyToken} = require('../utils/jwt');
const {upload} = require('../utils/multer');
const fs = require('fs');
const Seq = require("sequelize");

// 전체방 가져오기
router.get("/", async (req, res) => {
  try {
    const roomInformations = await db["room"].findAll({
      include: [{ model: db["room_image"] }, { model: db["room_option"] }],
      where:{
        location:{
          //db에서 LIKE와 같다
          [Seq.Op.like]: req.query.search ?`%${req.query.search}%` : `%%`
        }
      }
    });
    console.log(req.url);
    console.log(req.hostname);
    console.log(req.get("host"));
    // 해당 주소로 가게되면 이미지 주소를 보내준다.
    const makeImageUrl = (id) =>
      `${req.protocol}://${req.get("host")}/api/room/image/${id}`;
  //   console.log(req.protocol + '://' + req.get('host') + req.originalUrl)

  //현재 데이터만 볼 수 있게 하는 옵션
    const plainInformation = roomInformations.map((el) => el.get({ plain: true }));
  // room image가 있을 경우 
  // 이미지 url 생성 
  // map을 통해서 image_url이 존재하는 경우 url을 삽입해주는 방식
  const result = plainInformation.map(li => {
      if(li['room_images'].length){
         li['room_images'] = li['room_images'].map(image =>{
              return {...image, url: makeImageUrl(image.id)}
          });
      }
      return li;
  })
    
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.json({ status: "ERROR" });
  } 
  });
// 전체 매물볼때

// 특정 방의 정보 가져오기
router.get("/:id", async(req, res) => {
  const result = await db['room'].findOne({
    include:[{model : db['room_image']},{model:db['room_option']}],
    where:{id: req.params.id}
  })

  console.log(result);
  return res.json({ status: "OK"})
})



// /image/:id
router.get('/image/:id', async(req ,res )=> {
  try {
    const roomImage = await db['room_image'].findOne({
      where: {
        id: req.params.id,
      }
    });
    //console.log(roomImage);
    // DB내 데이터가 존재하는경우
    if(roomImage.dataValues && roomImage.dataValues['file_name']){
      // 이미지가 바로 보이게 하기 
      res.set('Content-Disposition',`inline; filename=profile.png`);
      const file = fs.createReadStream(`uploads/${roomImage.dataValues['file_name']}`);
      return file.pipe(res);
    }else{
      return res.json({ status: "ERROR" });
    }
    
  } catch (error) {
    console.log(error);
    return res.json({ status: "ERROR" });
  }
})

// 방을 올릴때 -> 디비에 저장
// 1차적으로 로그인이 된 상태에서만 가능하다
// 즉 verifyToken을 거쳐서 작성이 가능해야하고
// 두번째 방에 대한 정보, 방 이미지에 대한 정보, 방 옵션에 대한 정보를
// 한번에 모든 테이블에 넣어야한다
// 트랜잭션 -> DB 처리할 때 일괄 단위
// 모든 DB작업이 마무리 되어야지만 실 DB에 들어가고
// 한가지라도 원활하게 되지 않으면 실 DB에 넣지 않는다.

// 방의 이미지는 multer라이브러리를 사용해서 다중으로 넣어야한다.

router.post("/",verifyToken,upload.array("room_image"), async(req, res) => {
  // 업데이트 처리
  const transaction = await db.sequelize.transaction();
  try {
    const {title,content,room_type,room_size,room,
           location, latitude, longitude, item } = req.body;
  // 이미지 데이터, verifyToken을 통해 id값까지 받아와서 넣어주어야 한다.
  const rooms = await db['room'].create(
   {title,content,room_type,room_size,room,
           location, latitude, longitude,
           user_id:req.decoded.id
          },
          {transaction: transaction}
  )
  // item 넣기
  // 냉장고, TV , ```
  if(item){
    //아이템이 하나만 올 때
    if(typeof item === "string"){
      await db["room_option"].create(
        {
          item:item,
          room_id:rooms.dataValues.id
        },
        {transaction}
      )


      //아이템이 배열로 올 때
    }else{
      //일괄적으로 비동기처리를 할 때 사용
      await Promise.all(
        item.map(async(li)=>{
          await db["room_option"].create(
            {
              item:li,
              room_id: rooms.dataValues.id
            },
            {transaction}
          )
        })
      )

    }
  }

  // 이미지 넣기
  // uploads 폴더에 실제 이미지 넣기
  // 해당 이미지 주소의 위치 및 파일이름을 DB에 저장
  if(req.files){
    await Promise.all(
      req.files.map(async(li)=>{
        await db['room_image'].create({
          file_name:li.filename,
          original_filename: li.originalname,
          room_id: rooms.dataValues.id,
        },{transaction: transaction})
      })
      )
  }

  //transaction이 마무리되고 실 DB에 넣을 경우
  transaction.commit();

    return res.json({status:"OK"});
  } catch (error) {
    console.log(error);
    transaction.rollback();
    return res.json({status:"ERROR"});
  }

})

// 방 정보를 수정할때
router.patch("/:id", (req, res) => {
  console.log(req.body)
  return res.json(req.body)
})

// 방을 삭제할때
router.delete("/:id", (req, res) => {
  console.log(req.params)
  return res.json(req.params)
})


// 방에 option만 업데이트할때
router.patch("/:id/option", (req, res) => {
  
})

// 방의 이미지를 업데이트할떄
router.patch("/:id/image", (req, res) => {
  // 기존의 파일을 삭제
  // 파일 있는곳 이동 -> 삭제 -> 업로드
})




module.exports = router;

