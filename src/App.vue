<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>
<style>
.body-cont{
  padding: 30px;
  padding-top: 0;
}
.border-form{
  border: 1px solid #ebeef5;
  padding-top: 20px;
  margin: 10px 0;
  padding-left:10px;
}
.el-dialog{
  max-width: 60%;
  margin-top: 10vh;
}
.el-pagination {
  padding: 30px 0;
}
label {
  font-weight: normal;
}
.block .el-form-item__content input,
.block .el-form-item__content select {
  width: 200px;
}
.el-alert--info {
  margin-bottom: 20px;
}
.submit-btn {
  text-align: center;
  padding: 20px;
}
.block {
  border: 1px solid #ededde;
  margin-top: 20px;
}
.block .demo-form-inline {
  padding: 0;
}
.block .clearfix {
  border-bottom: 1px solid #ededde;
  border-top: 1px solid #ededde;
  padding: 10px 20px;
  margin-bottom: 20px;
  font-weight: bold;
}
.block .ser-sel {
  position: absolute;
  background: #fff;
  max-height: 250px;
  overflow: hidden;
  overflow: auto;
  width: auto;
  z-index: 100;
  border: 1px solid #dcdfe6;
}
.block .ser-sel .has-gutter {
  display: none;
}
.block .ser-sel-z{
  z-index: 1000
}
.block .el-tabs__nav-scroll {
  padding-left: 30px;
}
.block .ser-sel button {
  border: none;
}
.block .el-tabs__nav {
  padding-bottom: 10px;
}
.block .el-tabs__header {
  margin: 0 0 35px;
}
.block .el-input {
  display: block;
  width: 180px;
}
.form-input .el-form-item--medium .el-form-item__content {
  width: 180px;
}
.jv-container .jv-code {
  padding: 0;
}
.el-input.is-disabled .el-input__inner {
  color: #333;
}
.el-button--medium {
  margin-bottom: 22px;
}
.block .el-col-12 {
  height: 180px;
}
.disabled .el-upload--picture-card {
  display: none;
}
.mall-floor .bg-purple {
  background: -webkit-linear-gradient(#FCC16A, #FF7800);
  background: -o-linear-gradient(#FCC16A, #FF7800);
  background: -moz-linear-gradient(#FCC16A, #FF7800);
  background: linear-gradient(#FCC16A, #FF7800);
  padding-top: 30px;
  box-shadow: #ddd 10px 10px 30px 5px;
  width: 180px;
  height: 220px;
  color: #fff;
  margin: 0 auto;
  text-align: center;
  float: left;
  margin-left: 20px;margin-right: 30px
}
.mall-floor .bg-purple:nth-child(2){
  background: -webkit-linear-gradient(#FF698C, #FF1445);
  background: -o-linear-gradient(#FF698C, #FF1445);
  background: -moz-linear-gradient(#FF698C, #FF1445);
  background: linear-gradient(#FF698C, #FF1445);
}
.mall-floor .bg-purple:nth-child(3){
  background: -webkit-linear-gradient(#2ED7AC, #2FA77A);
  background: -o-linear-gradient(#2ED7AC, #2FA77A);
  background: -moz-linear-gradient(#2ED7AC, #2FA77A);
  background: linear-gradient(#2ED7AC, #2FA77A);
}
.mall-floor .head_pic {
  width: 70px;
  height: 70px;
  margin: 0 auto 60px;
  background: #fff;
  padding: 10px;
  border-radius: 100%;
}
.mall-floor .head_pic img {
  width: 90%;
  height: 90%;
}
.mall-floor .bg-purple:hover {
  box-shadow: 6px 6px 10px #ddd;
}
.cove-img .el-upload-list--picture-card .el-upload-list__item{
  width: 500px;height: auto;line-height: 0
}
</style>

