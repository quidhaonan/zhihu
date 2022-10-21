<template>
  <Nav />
  <van-form ref="formBox" @submit="submit">
    <van-cell-group inset>
      <van-field
        v-model="phone"
        center
        label="手机号"
        label-width="50px"
        name="phone"
        :rules="[
          { required: true, message: '手机号为必填项哦~' },
          { pattern: regPhone, message: '手机号格式不对哦~' },
        ]"
      >
        <template #button>
          <van-button
            size="small"
            :type="enable ? 'primary' : ''"
            class="form-btn"
            :disabled="!enable"
            @click="sendcode"
          >
            {{ enable ? "发送验证码" : time }}
          </van-button>
        </template>
      </van-field>

      <van-field
        v-model="code"
        label="验证码"
        label-width="50px"
        :rules="[
          { required: true, message: '验证码为必填项哦~' },
          { pattern: regCode, message: '验证码必须是6位数字哦~' },
        ]"
      />
    </van-cell-group>

    <div style="margin: 20px 40px">
      <van-button round block type="primary" native-type="submit">
        立即登录/注册
      </van-button>
    </div>
  </van-form>
</template>

<script>
  import { reactive, toRefs,ref } from 'vue'
  import Nav from "../components/Nav.vue";
  import { phoneCode,login } from '../api/index'
  import { Toast } from 'vant'
  import { useStore } from 'vuex'
  import { useRouter,useRoute } from 'vue-router'

  export default {
    name: "Login",
    components:{
      Nav
    },
    setup() {
      const store=useStore()
      const router=useRouter()
      const route=useRoute()

      const state=reactive({
        phone:'',
        code:'',
        enable:true,
        time:'60s'
      })

      const formBox=ref(null)

      // 发送验证码
      const sendcode=async ()=>{
        try{
          // 校验手机号格式
          await formBox.value.validate('phone')
          // 发送请求
          const { code }=await phoneCode(state.phone)
          if(+code!==0){
            Toast('当前网络繁忙，稍后再试')
            return
          }

          // 开启按钮倒计时
          state.enable=false
          state.time='10s'
          let n=10
          let timer=setInterval(() => {
            n--
            if(n===0){
              clearInterval(timer)
              state.enable=true
              return
            }
            state.time=`${n}s`
          }, 1000);
        }catch(err){
          // 单纯为了不报警告
          console.log()
        }
      }

      // 表单提交
      const submit=async ()=>{
        const { code,token }=await login(state.phone,state.code)
        if(+code!==0){
          Toast('登录失败')
          formBox.value.resetValidation()
          state.code=''
          return
        }
        localStorage.setItem('token',token)
        store.commit('changeIsLogin',true)
        store.dispatch('changeInfoAsync')
        Toast('登录成功')
        
        // 跳转到指定地址
        let from=route.query.from
        if(from){
          router.replace(`/${ from }`)
          return
        }
        router.replace('/person')
      }

      return {
        ...toRefs(state),
        formBox,
        regPhone:/^1\d{10}$/,
        regCode:/^\d{6}$/,
        sendcode,
        submit
      }
    }
  };
</script>

<style lang="less" scoped>
.van-form {
  margin-top: 30px;

  .form-btn {
    width: 78px;
  }
}
</style>