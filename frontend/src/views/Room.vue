<template>
  <div class="card-wrapper">
    <el-card v-for = "room in rooms" :key="room.id" :body-style="{padding: '0px'}">
      <div v-if="room['room_images'].length"
      class="room-image"
      :style="{
        backgroundImage: `url(${room['room_images'][0].url})`
      }"
      >
      </div>
      <div v-else class="room-image" :style="{backgroundImage: `url(https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png)`}"></div>
        <div style="padding: 14px; color:gray;">
        <div>{{ room.location }}</div>
        <div>{{room.title}}</div>
        <div class="bottom clearfix">
          <time class="time">
            {{room.createdAt}}
          </time>
        </div>
      </div>
    </el-card>

  </div>
</template>

<script>
import {roomAPI} from '../utils/axios'

export default {
  data(){
    return{
      rooms:[]
    }
  },
  async mounted(){
    const result = await roomAPI.get();
    console.log(result);
    if(result.data){
      this.rooms = result.data;
    }
  }
}
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}
.bottom {
  margin-top: 13px;
  line-height: 12px;
}
.button {
  padding: 0;
  float: right;
}
.image {
  width: 100%;
  display: block;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.card-wrapper {
  width: 60%;
  display: flex;
  flex-wrap: wrap;
  /* justify-content:center; */
  margin: 50px auto 0 auto;
  /* justify-items: left; */
}
.card-wrapper > * {
  margin: 10px;
}
.room-image {
  height: 250px;
  width: 300px;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}
</style>
</style>