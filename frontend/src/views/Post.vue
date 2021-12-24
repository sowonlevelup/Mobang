<template>
  <div>
    <el-form class="post-form main-container"
    >
    <el-form-item label="평수" style="width:160px;">
      <el-input type="text" v-model="form.size" autocomplete="off"></el-input>
    </el-form-item>
    <!-- 옵션 -->
    <Option></Option>
    <!-- 주소 부분 -->
    <Map></Map>
    <!-- 이미지 업로드 부분  -->
    <Upload></Upload>
    <el-form-item label="제목" style="width:600px;">
      <el-input type="text" v-model="form.title" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="내용" style="width:600px;">
      <el-input type="text" v-model="form.content" autocomplete="off"></el-input>
    </el-form-item>
    
  <el-button type="primary" @click="posting">글 쓰기 </el-button>
    </el-form>
  </div>
</template>

<script>
import Option from "../components/Option.vue"
import Upload from "../components/Upload.vue"
import Map from "../components/Map.vue"
import {mapState} from 'vuex'
import {roomAPI} from '../utils/axios'

export default {
  components:{
    Upload,
    Map,
    Option
  },
  data(){
    return{
      form:{
        title:"",
        content:"",
        size:""
      }
    }
  },
  computed:{
    ...mapState(['options','location','fileList'])
  },
  methods:{
    async posting(){
      try {
        //data로부터 가져와야하는 값
        const {title,content, size} = this.form;
        // vuex로부터 가져와야하는 값
        const {options,location,fileList} = this;
        //지금 보내야하는 값들은 굉장히 복잡한 형태
        // 일반 텍스트 + 이미지도 한번에 보내야한다
        // 이런 경우에는 formData를 자바스크립트로 만들어서 보낸다
        const formData = new FormData();
        //new FormData를 통해 넣은 후 app를 통해 formData에 값은 넣는다
        formData.append('title',title);
        formData.append('content',content);
        formData.append('room_size',size);
        formData.append('location',location.address);
        formData.append('latitude',location.latitude);
        formData.append('longitude',location.longitude);
        //옵션들
        if(options.length){
          options.forEach(option =>{
            formData.append('item',option)
          })
        }
        //이미지
        if(fileList.length){
           fileList.forEach(list =>{
            formData.append('room_image',list.file)
          })
        }

        const result = await roomAPI.post(formData);
        console.log(result);
        if(result.data.status==="OK"){
          alert("게시글 작성이 완료되었습니다.");
          this.$router.push("/room");
        }else{
          alert("게시글 작성에 실패하였습니다.")
        }


      } catch (error) {
        console.log(error);
        alert("게시글 작성에 실패하였습니다.")
      }
    }
  }

}
</script>

<style>
.main-container{
  width:1200px;
  margin: 50px auto;
}
</style>