<template>
  <van-skeleton title :row="5" v-if="newsInfo===null"/>
  <div class="content" v-html="newsInfo.body" v-else>
    
  </div>

  <div class="nav-box">
    <van-icon name="arrow-left" id='icon1' @click="handle"/>
    <van-icon name="comment-o" :badge='comments'/>
    <van-icon name="good-job-o" :badge='popularity'/>
    <van-icon name="star-o" color='#1989fa'/>
    <van-icon name="share-o" color='#ccc'/>
  </div>
</template>

<script>
    import { useRouter,useRoute } from 'vue-router'
    import { reactive,toRefs,onBeforeMount, onBeforeUnmount, onUpdated } from 'vue';
    import { queryNewsInfo,queryNewsStore } from '../api/index'

    export default {
        name:'Detail',
        setup() {
          const router=useRouter()
          const route=useRoute()
          const state=reactive({
            comments:0,
            popularity:0,
            newsInfo:null
          })

          onBeforeMount(async ()=>{
            const id=route.params.id
            const result=await queryNewsInfo(id)
            state.newsInfo=result

            // 动态创建 css
            const link=document.createElement('link')
            link.id='link'
            link.rel='stylesheet'
            link.href=state.newsInfo.css[0]
            document.head.appendChild(link)

            const { popularity,comments }=await queryNewsStore(id)
            state.popularity=popularity
            state.comments=comments
          })

          onBeforeUnmount(()=>{
            const link=document.getElementById('link')
            if(!link) return
            document.head.removeChild(link)
          })

          onUpdated(()=>{
            const imgPlaceHolder=document.querySelector('.img-place-holder')
            if(imgPlaceHolder){
              if(imgPlaceHolder.innerHTML===''){
                  imgPlaceHolder.innerHTML+=`'<img src="${ state.newsInfo.image}" alt="" />'`
              }
            }
          })

          const handle=()=>{
            router.back()
          }

          return {
            ...toRefs(state),
            handle
          }
        }
    }
</script>

<style type='less' scoped>
  .content{
    background: #fff;
    padding-bottom: 50px;
    /* margin 没用，因为这里没有 */
    margin: 0;
  }

  /deep/.img-place-holder{
    overflow: hidden;
    height: 375px;
    img{
      display: block;
      margin:0;
      width:100%;
      min-height:100%
    }
  }

  .van-skeleton{
    padding: 30px 15px;
  }

  .nav-box{
    position: fixed;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    padding: 0 15px;
    width: 100%;
    height: 50px;
    background: #f4f4f4;
  }

  #icon1::after{
    position: absolute;
    top: -10%;
    right: -15px;
    content: "";
    width: 1px;
    height: 120%;
    background: #d5d5d5;
  }

  /deep/ .van-badge{
    background-color: transparent;
    border: none;
    color: #000;
    right: -5px;
  }
</style>