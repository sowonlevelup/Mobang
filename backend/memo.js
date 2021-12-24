//database 생성
//npx sequelize init

//npx sequelize model:generate --name user --attributes name:string, email:string, password:string, profile:string,type:string, deletedAt:date

//npx sequelize model:generate --name payment --attributes money:string, payment_type:string, user_id:string

//npx sequelize model:generate --name room --attributes title:string,content:string,room_type:string,room_size:string, location:string,latitude:string, logitude:string,user_id:integer, deletedAt:date

//npx sequelize model:generate --name room_image --attributes file_name:string,original_file_name:string,room_id:integer

//npx sequelize model:generate --name room_option --attributes item:string,user_id:integer

// 로그인 방식 
// 1차 
// 회원정보 조회 및 대조
// 아이디 조회 + 비밀번호 조회(암호화 되어있으니 bcrypt를 통해
// compare)
// 아이디를 조회해서 유저정보를 가져오고 
// 거기에서 비밀번호 대조까지 일치하게 되면 
// -> 로그인을 위한 준비 완료!! -> 이제 유저에 대한 정보를 저장하는
// 관리법 이 필요하다 (HTTP는 상태값을 저장하지 않으니까)
// -> 세션, 쿠키, jwt 
// 세션에서 저장하는 방식 -> 회원 정보의 id를 백엔드서버의 cookie에 저장한다 
// -> id가 저장되어있으니까 이를 DB를 통해 조회를 하고 이를 통해 다른서비스에 사용
// -> 세션은 로컬과 서버에 저장이 가능 , 쿠키는 로컬(프론트서버)에 저장
// (쿠키는 따로 지우는 요청이 있지않는이상 계속 남아있다)
// 쿠키는 탈취 위협이 크다 . 따라서 세션이 조금더 안전하다 
// -> 기본적으로 로그인 상태값을 서버에 세션으로 저장했다
// -> 세션에 저장해버리면 상태값관리가 힘들다 (특정 서버에만 user 값이 존재하기떄문에
// 다른곳에서는 로그인 했다고 인식을 하지 못한다, 그렇다고 쿠키를 통해 프론트에 저장하기에는
// 탈취 위협이크다, 세션은 확장성이 좋지 않다.)
// 확장성이 좋지않는 세션을 대비해서 나온 전략 두가지
// -> 첫번째 방식 Redis(캐시메모리를 사용하는 DB)를 활용해서 세션값을 DB에 저장해버리기
// -> 두번째 방식 JWT( 로컬에 저장하되 JWT는 json web token의 준말로써 
// 암호화 복호화가 가능하다
// )